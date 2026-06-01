import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import SEOHead from "@/components/common/SEOHead";
import { goBackOr } from "@/lib/navigation";

const LandingFooter = lazy(() => import("@/components/landing/LandingFooter"));

const SectionFallback = () => (
  <div className="min-h-[200px] w-full px-4 py-16 mx-auto max-w-7xl">
    <div className="h-8 w-48 rounded-md bg-foreground/[0.04] animate-pulse mb-6" />
  </div>
);

type Tier = "Free" | "Pro" | "Elite" | "Business";
const TIERS: Tier[] = ["Free", "Pro", "Elite", "Business"];

const TIER_META: Record<Tier, { price: string; accent: string; subtitle: string }> = {
  Free:     { price: "$0",    accent: "#10B981", subtitle: "Forever free" },
  Pro:      { price: "$25",   accent: "#2563EB", subtitle: "For creators" },
  Elite:    { price: "$50",   accent: "#7C3AED", subtitle: "Most popular" },
  Business: { price: "$125",  accent: "#D97706", subtitle: "For teams" },
};

interface ServiceDetail {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  values: Record<Tier, string | boolean>;
}

const SERVICES: ServiceDetail[] = [
  {
    name: "AI Chat",
    tagline: "Talk to Megsy AI in one place",
    description:
      "Chat with Megsy AI — our own model built for fast, accurate, multi-turn conversations. Keep your full history, switch reasoning modes, and never get rate-limited on paid plans.",
    highlights: [
      "Powered by Megsy's proprietary model",
      "Persistent conversation history",
      "Multi-turn context with no resets",
      "Free plan uses Megsy Lite",
    ],
    values: {
      Free: "Megsy Lite — unlimited",
      Pro: "Megsy AI — unlimited",
      Elite: "Megsy AI — unlimited",
      Business: "Megsy AI — unlimited",
    },
  },
  {
    name: "Image Generation",
    tagline: "Studio-quality images from a prompt",
    description:
      "Generate high-resolution images using the top image models. During your unlimited window (7 / 15 / 30 days depending on plan), generate as many as you want. Outside the window, generation uses MC credits.",
    highlights: [
      "Multiple image models in one tool",
      "HD / 4K resolution support",
      "Style presets & custom branding",
      "Bulk generation for campaigns",
    ],
    values: {
      Free: false,
      Pro: "Unlimited 7 days / month",
      Elite: "Unlimited 15 days / month",
      Business: "Unlimited all month",
    },
  },
  {
    name: "Slides & Presentations",
    tagline: "Full decks from a prompt — fully editable",
    description:
      "Describe your topic and get a complete presentation with structured slides, images, and speaker notes. Export to PowerPoint or PDF. Free users get 3 generations per day; paid plans unlock long unlimited windows.",
    highlights: [
      "Auto-generated structure & design",
      "Fully editable slide-by-slide",
      "Export to PPTX, PDF, Google Slides",
      "Brand-aware templates (Elite+)",
    ],
    values: {
      Free: "3 / day",
      Pro: "Unlimited 7 days / month",
      Elite: "Unlimited 15 days / month",
      Business: "Unlimited all month",
    },
  },
  {
    name: "Docs & Deep Research",
    tagline: "Long-form documents and cited research",
    description:
      "Generate long, structured documents and run multi-source research with inline citations. Perfect for reports, articles, and proposals. Free plan gets 3 of each per day.",
    highlights: [
      "Multi-source web research with citations",
      "Long-form structured documents",
      "Export to DOCX, PDF, Markdown",
      "Custom output tone & length",
    ],
    values: {
      Free: "3 / day each",
      Pro: "Unlimited 7 days / month",
      Elite: "Unlimited 15 days / month",
      Business: "Unlimited all month",
    },
  },
  {
    name: "Code Builder",
    tagline: "Build full apps in natural language",
    description:
      "Describe your app and Megsy writes, edits, and deploys it. One-click publishing, custom domains, and full GitHub sync. Unlimited during your plan window.",
    highlights: [
      "Generate full-stack apps & websites",
      "One-click deploy & custom domains",
      "GitHub sync & version control",
      "Live preview while you iterate",
    ],
    values: {
      Free: false,
      Pro: "Unlimited 7 days / month",
      Elite: "Unlimited 15 days / month",
      Business: "Unlimited all month",
    },
  },
  {
    name: "Video Generation",
    tagline: "AI video — credit-based on all plans",
    description:
      "Generate short videos from text or images. Always credit-based — each video consumes MC from your monthly balance. You're never charged extra; you only spend the credits already included in your plan.",
    highlights: [
      "Text-to-video and image-to-video",
      "Multiple quality presets",
      "Predictable credit cost per video",
      "No surprise overage charges",
    ],
    values: {
      Free: false,
      Pro: "100 MC included",
      Elite: "250 MC included",
      Business: "600 MC included",
    },
  },
  {
    name: "Megsy OS",
    tagline: "Your 24/7 autonomous agent",
    description:
      "Megsy OS runs tasks in the background — monitors projects, executes multi-step workflows, and finishes work while you're offline. Available on Pro and above.",
    highlights: [
      "Multi-step autonomous workflows",
      "Runs 24/7 in the background",
      "Connects across all Megsy tools",
      "Schedule recurring tasks",
    ],
    values: {
      Free: false,
      Pro: "Unlimited tasks",
      Elite: "Unlimited tasks",
      Business: "Unlimited tasks",
    },
  },
  {
    name: "Megsy Credits (MC)",
    tagline: "One credit pool for video & extras",
    description:
      "MC covers video generation and any usage beyond your unlimited windows. Credits reset monthly. No hidden charges — you only ever spend what's in your plan.",
    highlights: [
      "Single transparent currency",
      "Resets every billing cycle",
      "Covers video + overage usage",
      "Never charged beyond your plan",
    ],
    values: {
      Free: "0 MC",
      Pro: "100 MC / month",
      Elite: "250 MC / month",
      Business: "600 MC / month",
    },
  },
  {
    name: "Team Workspace",
    tagline: "Collaborate on shared projects",
    description:
      "Shared workspace for your team — projects, chats, and files all in one place. Pro includes a team workspace; Business has unlimited seats with SSO.",
    highlights: [
      "Shared projects, files & history",
      "Role-based permissions",
      "Centralized billing",
      "SSO/SAML on Business",
    ],
    values: {
      Free: false,
      Pro: "Included",
      Elite: "Included",
      Business: "Unlimited seats + SSO",
    },
  },
  {
    name: "Priority Queue & Speed",
    tagline: "3× faster generations on Elite & Business",
    description:
      "Skip the standard queue and get 3× faster generation speeds on Elite and Business plans. Critical for teams working under tight deadlines.",
    highlights: [
      "3× faster on Elite & Business",
      "Skip standard queue",
      "Priority during high-traffic hours",
      "99.9% SLA on Business",
    ],
    values: {
      Free: false,
      Pro: "Standard speed",
      Elite: "3× priority",
      Business: "3× priority + SLA",
    },
  },
  {
    name: "Support",
    tagline: "From community to dedicated success",
    description:
      "Free users get community support. Pro gets priority email. Elite gets 24/7 chat. Business gets a dedicated success manager with white-glove onboarding.",
    highlights: [
      "Community on Free",
      "Priority email on Pro",
      "24/7 chat on Elite",
      "Dedicated manager on Business",
    ],
    values: {
      Free: "Community",
      Pro: "Priority email",
      Elite: "24/7 chat",
      Business: "Dedicated manager",
    },
  },
];

const renderCell = (value: string | boolean) => {
  if (value === true) return <Check className="w-5 h-5 text-emerald-500 mx-auto" strokeWidth={3} />;
  if (value === false) return <X className="w-5 h-5 text-muted-foreground/40 mx-auto" strokeWidth={2.5} />;
  return <span className="text-sm font-semibold text-foreground">{value}</span>;
};

const FeaturesGuidePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Compare Plans & Features | Megsy AI"
        description="A clean, side-by-side comparison of every Megsy feature across Free, Pro, Elite, and Business plans."
        path="/features-guide"
      />
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <LandingNavbar />

        <main id="main" className="pt-24">
          {/* Top bar with back link */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-2">
            <button
              onClick={() => goBackOr(navigate, "/pricing")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to pricing
            </button>
          </div>

          {/* Hero */}
          <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-10 pb-10 sm:pb-14 text-center">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.22em] px-4 py-1.5 rounded-full bg-foreground/[0.06] border border-border text-muted-foreground mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              PLAN COMPARISON
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-black tracking-tight leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(2rem, 6vw, 4.5rem)", letterSpacing: "-0.03em" }}
            >
              Everything Megsy does,
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-fuchsia-500 to-amber-400 bg-clip-text text-transparent">
                explained clearly.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto mt-5 max-w-2xl text-muted-foreground font-medium"
              style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.125rem)" }}
            >
              Every feature, every limit, every plan — laid out so you know exactly what you're paying for.
            </motion.p>
          </section>

          {/* Comparison table */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-[0_20px_60px_-20px_hsl(var(--foreground)/0.12)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-5 font-bold text-xs uppercase tracking-[0.15em] text-muted-foreground sticky left-0 bg-card z-10 min-w-[220px]">
                        Feature
                      </th>
                      {TIERS.map((t) => {
                        const meta = TIER_META[t];
                        return (
                          <th
                            key={t}
                            className="px-5 py-5 text-center min-w-[160px]"
                            style={{
                              borderTop: `3px solid ${meta.accent}`,
                              background: `linear-gradient(180deg, ${meta.accent}14, transparent)`,
                            }}
                          >
                            <div className="font-black text-lg text-foreground">{t}</div>
                            <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground mt-1">
                              {meta.subtitle}
                            </div>
                            <div
                              className="mt-2 inline-block text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ background: `${meta.accent}1f`, color: meta.accent }}
                            >
                              {meta.price}/mo
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICES.map((s, i) => (
                      <tr
                        key={s.name}
                        className={`border-b border-border last:border-0 transition-colors hover:bg-foreground/[0.02] ${
                          i % 2 === 1 ? "bg-foreground/[0.015]" : ""
                        }`}
                      >
                        <td className="px-6 py-4 sticky left-0 bg-card z-10">
                          <div className="font-bold text-sm text-foreground">{s.name}</div>
                          <div className="text-xs text-muted-foreground font-medium mt-0.5">
                            {s.tagline}
                          </div>
                        </td>
                        {TIERS.map((t) => (
                          <td key={t} className="px-5 py-4 text-center text-muted-foreground align-middle">
                            {renderCell(s.values[t])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground text-center">
              Yearly plans get 2 months free + bonus MC. All prices in USD.
            </p>
          </section>

          {/* Detailed sections */}
          <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Deep dive into every feature
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                What it does, what's included, and exactly what each plan gets.
              </p>
            </div>
            <div className="space-y-5">
              {SERVICES.map((s, i) => (
                <motion.article
                  key={s.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8 hover:border-foreground/20 transition-colors"
                >
                  <div className="mb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground/[0.06] text-xs font-black text-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight">{s.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-semibold">
                      {s.tagline}
                    </p>
                  </div>
                  <p className="text-foreground/80 leading-relaxed mb-5">{s.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                    {s.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-muted-foreground">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-5 border-t border-border">
                    {TIERS.map((t) => {
                      const meta = TIER_META[t];
                      const v = s.values[t];
                      const text =
                        typeof v === "boolean"
                          ? v
                            ? "Included"
                            : "Not included"
                          : v;
                      const notIncluded = v === false;
                      return (
                        <div
                          key={t}
                          className="rounded-lg border border-border px-3 py-2.5 transition-all"
                          style={{
                            background: notIncluded ? "transparent" : `${meta.accent}0d`,
                            borderColor: notIncluded ? "hsl(var(--border))" : `${meta.accent}40`,
                          }}
                        >
                          <div
                            className="text-[10px] font-black tracking-[0.18em] uppercase"
                            style={{ color: notIncluded ? "hsl(var(--muted-foreground))" : meta.accent }}
                          >
                            {t}
                          </div>
                          <div className={`mt-1 text-xs font-bold ${notIncluded ? "text-muted-foreground/60" : "text-foreground"}`}>
                            {text}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-24 text-center">
            <div className="relative overflow-hidden rounded-3xl border border-border p-10 sm:p-14"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--muted)) 100%)",
              }}
            >
              <div
                aria-hidden
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(124,58,237,0.5), transparent 70%)" }}
              />
              <div
                aria-hidden
                className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(255,165,0,0.5), transparent 70%)" }}
              />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
                  Ready to pick your plan?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Start free, no card required. Upgrade anytime as you grow.
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
                >
                  Go to pricing
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        </main>

        <Suspense fallback={<SectionFallback />}>
          <LandingFooter />
        </Suspense>
      </div>
    </>
  );
};

export default FeaturesGuidePage;
