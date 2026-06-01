import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import LandingNavbar from "@/components/landing/LandingNavbar";
import SEOHead from "@/components/common/SEOHead";
import MegsyStar from "@/components/branding/MegsyStar";

const LandingFooter = lazy(() => import("@/components/landing/LandingFooter"));

const SectionFallback = () => (
  <div className="min-h-[200px] w-full px-4 py-16 mx-auto max-w-7xl">
    <div className="h-8 w-48 rounded-md bg-foreground/[0.04] animate-pulse mb-6" />
  </div>
);

type Tier = "Free" | "Pro" | "Elite" | "Business";
const TIERS: Tier[] = ["Free", "Pro", "Elite", "Business"];
const PRICES: Record<Tier, string> = {
  Free: "$0",
  Pro: "$25",
  Elite: "$50",
  Business: "$125",
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
    tagline: "Talk to every premium model in one place",
    description:
      "Chat with GPT-4, Claude, Gemini, and other premium models from a single interface. Switch models mid-conversation, keep your full history, and never get rate-limited on paid plans.",
    highlights: [
      "Access to 10+ premium AI models",
      "Persistent conversation history",
      "Switch models without losing context",
      "Free plan uses basic models only",
    ],
    values: {
      Free: "Basic models — unlimited",
      Pro: "All premium models — unlimited",
      Elite: "All premium models — unlimited",
      Business: "All premium models — unlimited",
    },
  },
  {
    name: "Image Generation",
    tagline: "Studio-quality images from a single prompt",
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
      Pro: "Unlimited for 7 days / month",
      Elite: "Unlimited for 15 days / month",
      Business: "Unlimited all month (30 days)",
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
      Pro: "Unlimited for 7 days / month",
      Elite: "Unlimited for 15 days / month",
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
      Pro: "Unlimited for 7 days / month",
      Elite: "Unlimited for 15 days / month",
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
      Pro: "Unlimited for 7 days / month",
      Elite: "Unlimited for 15 days / month",
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
      Pro: "500 MC included",
      Elite: "1,200 MC included",
      Business: "3,500 MC included",
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
      Pro: true,
      Elite: true,
      Business: true,
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
      Pro: "500 MC / month",
      Elite: "1,200 MC / month",
      Business: "3,500 MC / month",
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
    tagline: "From community help to dedicated success",
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
  if (value === true) return <Check className="w-5 h-5 text-emerald-400 mx-auto" />;
  if (value === false) return <X className="w-5 h-5 text-muted-foreground/40 mx-auto" />;
  return <span className="text-sm font-medium">{value}</span>;
};

const FeaturesGuidePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Features & Plan Comparison | Megsy"
        description="Detailed breakdown of every Megsy feature and a side-by-side comparison of Free, Pro, Elite, and Business plans."
        path="/features-guide"
      />
      <div data-theme="dark" className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <LandingNavbar />

        <main id="main" className="pt-24">
          {/* Hero */}
          <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-10 sm:pb-14 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-foreground/5 border border-border mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                Features & Plan Comparison
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-black tracking-tight leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(2rem, 6vw, 4.75rem)", letterSpacing: "-0.03em" }}
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
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="bg-foreground/[0.03] border-b border-border">
                      <th className="text-left px-5 py-5 font-bold text-sm sticky left-0 bg-card z-10">
                        Feature
                      </th>
                      {TIERS.map((t) => (
                        <th key={t} className="px-5 py-5 text-center min-w-[140px]">
                          <div className="font-black text-base">{t}</div>
                          <div className="text-xs text-muted-foreground font-medium mt-0.5">
                            {PRICES[t]}/mo
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICES.map((s, i) => (
                      <tr
                        key={s.name}
                        className={`border-b border-border last:border-0 ${
                          i % 2 === 1 ? "bg-foreground/[0.015]" : ""
                        }`}
                      >
                        <td className="px-5 py-4 font-semibold text-sm sticky left-0 bg-card z-10">
                          {s.name}
                        </td>
                        {TIERS.map((t) => (
                          <td key={t} className="px-5 py-4 text-center text-muted-foreground">
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
              Yearly plans get 2 months free. All prices in USD.
            </p>
          </section>

          {/* Detailed sections */}
          <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-16">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-10 text-center">
              Deep dive into every feature
            </h2>
            <div className="space-y-6">
              {SERVICES.map((s, i) => (
                <motion.article
                  key={s.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: i * 0.04 }}
                  className="rounded-2xl border border-border bg-card p-6 sm:p-8"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <MegsyStar className="w-6 h-6 shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black tracking-tight">{s.name}</h3>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        {s.tagline}
                      </p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed mb-5">{s.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 mb-5">
                    {s.highlights.map((h) => (
                      <div key={h} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{h}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-5 border-t border-border">
                    {TIERS.map((t) => (
                      <div
                        key={t}
                        className="rounded-lg bg-foreground/[0.03] border border-border px-3 py-2.5"
                      >
                        <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-muted-foreground">
                          {t}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-foreground">
                          {typeof s.values[t] === "boolean"
                            ? s.values[t]
                              ? "Included"
                              : "Not included"
                            : (s.values[t] as string)}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-24 text-center">
            <div className="rounded-3xl bg-gradient-to-br from-purple-600/20 via-fuchsia-500/10 to-amber-500/10 border border-border p-10 sm:p-14">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
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
