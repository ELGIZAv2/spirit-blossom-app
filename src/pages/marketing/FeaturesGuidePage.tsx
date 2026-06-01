import { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

const TIER_META: Record<Tier, { price: string; subtitle: string }> = {
  Free:     { price: "$0",    subtitle: "Forever free" },
  Pro:      { price: "$25",   subtitle: "For creators" },
  Elite:    { price: "$50",   subtitle: "Most popular" },
  Business: { price: "$125",  subtitle: "For teams" },
};

type Media =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; poster?: string };

interface ServiceDetail {
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  media: Media;
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
    media: { kind: "image", src: "/api-showcase/showcase-1.webp", alt: "Megsy AI chat preview" },
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
    media: { kind: "image", src: "/api-showcase/image-gen-preview.webp", alt: "Image generation preview" },
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
    media: { kind: "video", src: "/api-showcase/video-gen-preview.mp4" },
    values: {
      Free: false,
      Pro: "100 MC included",
      Elite: "250 MC included",
      Business: "600 MC included",
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
    media: { kind: "image", src: "/api-showcase/showcase-2.webp", alt: "Slides preview" },
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
    media: { kind: "image", src: "/api-showcase/showcase-3.webp", alt: "Docs preview" },
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
    media: { kind: "video", src: "/api-showcase/video-1.mp4" },
    values: {
      Free: false,
      Pro: "Unlimited 7 days / month",
      Elite: "Unlimited 15 days / month",
      Business: "Unlimited all month",
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
    media: { kind: "video", src: "/api-showcase/video-3.mp4" },
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
    media: { kind: "image", src: "/api-showcase/showcase-4.webp", alt: "Credits preview" },
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
    media: { kind: "video", src: "/api-showcase/video-4.mp4" },
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
    media: { kind: "video", src: "/api-showcase/video-5.mp4" },
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
    media: { kind: "video", src: "/api-showcase/video-6.mp4" },
    values: {
      Free: "Community",
      Pro: "Priority email",
      Elite: "24/7 chat",
      Business: "Dedicated manager",
    },
  },
];

const renderCell = (value: string | boolean) => {
  if (value === true) return <span className="text-foreground font-bold">Included</span>;
  if (value === false) return <span className="text-muted-foreground/50">—</span>;
  return <span className="text-sm font-semibold text-foreground">{value}</span>;
};

const MediaBlock = ({ media }: { media: Media }) => (
  <div className="relative overflow-hidden rounded-3xl border border-border bg-card aspect-[16/10] shadow-[0_30px_80px_-30px_hsl(var(--foreground)/0.25)]">
    {media.kind === "image" ? (
      <img
        src={media.src}
        alt={media.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
    ) : (
      <video
        src={media.src}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
    )}
  </div>
);

const FeaturesGuidePage = () => {
  const navigate = useNavigate();

  return (
    <>
      <SEOHead
        title="Megsy Services — Everything explained | Megsy AI"
        description="A clean, in-depth walkthrough of every Megsy service with live previews and a side-by-side plan comparison."
        path="/features-guide"
      />
      <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <LandingNavbar />

        <main id="main" className="pt-24">
          {/* Back link */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-2">
            <button
              onClick={() => goBackOr(navigate, "/pricing")}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to pricing
            </button>
          </div>

          {/* Hero — landing style */}
          <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-14 pb-16 sm:pb-24 text-center">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-[11px] font-bold tracking-[0.28em] uppercase text-muted-foreground mb-6"
            >
              Megsy Services
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-black tracking-tight leading-[1.02] text-foreground"
              style={{ fontSize: "clamp(2.4rem, 7.5vw, 5.5rem)", letterSpacing: "-0.035em" }}
            >
              Everything Megsy does,
              <br />
              <span className="italic font-light text-muted-foreground">explained clearly.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mx-auto mt-7 max-w-2xl text-muted-foreground font-medium"
              style={{ fontSize: "clamp(1rem, 1.7vw, 1.2rem)" }}
            >
              Eleven services, four plans, one transparent system. See exactly what's
              included and how each tool works — with live previews.
            </motion.p>
          </section>

          {/* Zigzag service sections — landing style */}
          <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-24 space-y-28 sm:space-y-40">
            {SERVICES.map((s, i) => {
              const reverse = i % 2 === 1;
              return (
                <motion.article
                  key={s.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.7 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
                >
                  <div className={reverse ? "lg:order-2" : ""}>
                    <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-muted-foreground mb-4">
                      {String(i + 1).padStart(2, "0")} — {s.tagline}
                    </p>
                    <h2
                      className="font-black tracking-tight text-foreground leading-[1.05]"
                      style={{ fontSize: "clamp(1.9rem, 4vw, 3.25rem)", letterSpacing: "-0.025em" }}
                    >
                      {s.name}
                    </h2>
                    <p className="mt-5 text-foreground/75 leading-relaxed text-base sm:text-lg max-w-xl">
                      {s.description}
                    </p>

                    <ul className="mt-7 space-y-2.5">
                      {s.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex items-baseline gap-3 text-sm sm:text-[15px] text-foreground/85"
                        >
                          <span className="text-muted-foreground/60 select-none">—</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 max-w-xl">
                      {TIERS.map((t) => {
                        const v = s.values[t];
                        const text =
                          typeof v === "boolean" ? (v ? "Included" : "Not included") : v;
                        const off = v === false;
                        return (
                          <div
                            key={t}
                            className={`rounded-xl border px-3 py-2.5 ${
                              off
                                ? "border-border bg-transparent"
                                : "border-foreground/20 bg-foreground/[0.03]"
                            }`}
                          >
                            <div className="text-[10px] font-black tracking-[0.18em] uppercase text-muted-foreground">
                              {t}
                            </div>
                            <div
                              className={`mt-1 text-xs font-bold ${
                                off ? "text-muted-foreground/50" : "text-foreground"
                              }`}
                            >
                              {text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className={reverse ? "lg:order-1" : ""}>
                    <MediaBlock media={s.media} />
                  </div>
                </motion.article>
              );
            })}
          </section>

          {/* Full comparison table */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
            <div className="text-center mb-10">
              <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-muted-foreground mb-4">
                Full comparison
              </p>
              <h2
                className="font-black tracking-tight"
                style={{ fontSize: "clamp(1.9rem, 4vw, 3rem)", letterSpacing: "-0.025em" }}
              >
                All services, side by side.
              </h2>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left px-6 py-5 font-bold text-[11px] uppercase tracking-[0.18em] text-muted-foreground sticky left-0 bg-card z-10 min-w-[220px]">
                        Service
                      </th>
                      {TIERS.map((t) => {
                        const meta = TIER_META[t];
                        return (
                          <th key={t} className="px-5 py-5 text-center min-w-[150px]">
                            <div className="font-black text-base text-foreground">{t}</div>
                            <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground mt-1">
                              {meta.subtitle}
                            </div>
                            <div className="mt-1.5 text-xs font-bold text-foreground/70">
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
                          <td
                            key={t}
                            className="px-5 py-4 text-center text-muted-foreground align-middle"
                          >
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

          {/* Final CTA — minimal */}
          <section className="max-w-4xl mx-auto px-5 sm:px-8 pb-28 text-center">
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.03em" }}
            >
              Ready to pick your plan?
            </h2>
            <p className="mt-5 text-muted-foreground max-w-xl mx-auto">
              Start free, no card required. Upgrade anytime as you grow.
            </p>
            <button
              onClick={() => navigate("/pricing")}
              className="mt-8 inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-opacity"
            >
              Go to pricing →
            </button>
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
