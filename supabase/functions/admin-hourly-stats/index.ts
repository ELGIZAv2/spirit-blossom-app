// Sends hourly admin stats to a Telegram chat.
// Triggered by pg_cron every hour. Public (no JWT) — protected by a shared secret token.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_CHAT_ID = "6657246146";

async function sendTelegram(token: string, text: string) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: ADMIN_CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Telegram error ${res.status}: ${body}`);
  }
  return res.json();
}

async function safeCount(
  supabase: ReturnType<typeof createClient>,
  table: string,
  sinceISO?: string,
): Promise<number> {
  try {
    let q = supabase.from(table).select("*", { count: "exact", head: true });
    if (sinceISO) q = q.gte("created_at", sinceISO);
    const { count, error } = await q;
    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function sumCreditsLastHour(
  supabase: ReturnType<typeof createClient>,
  sinceISO: string,
): Promise<{ spent: number; added: number }> {
  try {
    const { data } = await supabase
      .from("credit_transactions")
      .select("amount, action_type, created_at")
      .gte("created_at", sinceISO)
      .limit(5000);
    let spent = 0;
    let added = 0;
    for (const row of (data ?? []) as Array<{ amount: number; action_type: string }>) {
      const amt = Number(row.amount) || 0;
      if (row.action_type === "credit_addition" || amt < 0) added += Math.abs(amt);
      else spent += amt;
    }
    return { spent, added };
  } catch {
    return { spent: 0, added: 0 };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Optional shared-secret check — pg_cron sends it via header
  const cronSecret = Deno.env.get("CRON_SHARED_SECRET");
  if (cronSecret) {
    const got = req.headers.get("x-cron-secret");
    if (got !== cronSecret) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
  if (!TELEGRAM_BOT_TOKEN) {
    return new Response(
      JSON.stringify({ error: "TELEGRAM_BOT_TOKEN is not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false },
  });

  const now = new Date();
  const hourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // Parallel stat fetches
  const [
    totalUsers,
    newUsersHour,
    newUsersDay,
    messagesHour,
    visitsHour,
    visitsDay,
    generationsHour,
    ordersHour,
    ordersDay,
    credits,
  ] = await Promise.all([
    safeCount(supabase, "profiles"),
    safeCount(supabase, "profiles", hourAgo),
    safeCount(supabase, "profiles", dayAgo),
    safeCount(supabase, "messages", hourAgo),
    safeCount(supabase, "project_visits", hourAgo),
    safeCount(supabase, "project_visits", dayAgo),
    safeCount(supabase, "generation_jobs", hourAgo),
    safeCount(supabase, "processed_orders", hourAgo),
    safeCount(supabase, "processed_orders", dayAgo),
    sumCreditsLastHour(supabase, hourAgo),
  ]);

  const time = now.toISOString().replace("T", " ").slice(0, 16) + " UTC";

  const text = [
    `📊 <b>Megsy — Hourly Admin Report</b>`,
    `<i>${time}</i>`,
    ``,
    `👥 <b>Users</b>`,
    `• Total: <b>${totalUsers}</b>`,
    `• New (1h): <b>${newUsersHour}</b>`,
    `• New (24h): <b>${newUsersDay}</b>`,
    ``,
    `💬 <b>Activity (last 1h)</b>`,
    `• Messages: <b>${messagesHour}</b>`,
    `• Generations: <b>${generationsHour}</b>`,
    `• Page visits: <b>${visitsHour}</b>`,
    ``,
    `👁 <b>Visits (24h)</b>: <b>${visitsDay}</b>`,
    ``,
    `💳 <b>Payments</b>`,
    `• Orders (1h): <b>${ordersHour}</b>`,
    `• Orders (24h): <b>${ordersDay}</b>`,
    ``,
    `🪙 <b>Credits (1h)</b>`,
    `• Spent: <b>${credits.spent.toFixed(2)} MC</b>`,
    `• Added: <b>${credits.added.toFixed(2)} MC</b>`,
  ].join("\n");

  try {
    await sendTelegram(TELEGRAM_BOT_TOKEN, text);
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, time }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
