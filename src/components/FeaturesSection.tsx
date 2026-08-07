import {
  Bot,
  MapPin,
  Users,
  Shield,
  ShieldAlert,
  Camera,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import ProgressiveImage from "@/components/ProgressiveImage";

interface Feature {
  icon: typeof Bot;
  title: string;
  description: string;
  cta: string;
  path: string;
  index: string;
  featured?: boolean;
  image?: string;
  span: string;
}

/**
 * Feature tile.
 *
 * Deliberately plain: a hairline border, a numeral, an unfilled icon and a
 * rule above the CTA. The previous version leaned on tinted icon pills,
 * heavy shadows, large corner radii and a lift-and-scale hover, which is
 * the stock "generated landing page" look. Structure now comes from rules
 * and numbering rather than from cards floating on shadows.
 */
const FeatureTile = ({ feature, i }: { feature: Feature; i: number }) => {
  const { featured } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: Math.min(i, 4) * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className={cn("min-h-[13rem]", feature.span)}
    >
      <Link
        to={feature.path}
        className={cn(
          "group relative flex h-full flex-col justify-between overflow-hidden rounded-sm p-6 md:p-7",
          featured
            ? "text-white"
            : "border border-foreground/10 bg-card transition-colors duration-500 hover:border-foreground/35"
        )}
      >
        {featured && feature.image && (
          <>
            <ProgressiveImage
              src={feature.image}
              alt=""
              aria-hidden
              wrapperClassName="absolute inset-0"
              className="h-full w-full object-cover transition-transform [transition-duration:1200ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />
          </>
        )}

        <div className="relative flex items-start justify-between">
          <feature.icon
            className={cn(
              "h-5 w-5",
              featured ? "text-heritage" : "text-foreground/70"
            )}
            strokeWidth={1.5}
          />
          <span
            className={cn(
              "font-mono text-[11px] tabular-nums tracking-widest",
              featured ? "text-white/45" : "text-foreground/30"
            )}
          >
            {feature.index}
          </span>
        </div>

        <div className="relative mt-10">
          <h3
            className={cn(
              "font-display tracking-tight",
              featured
                ? "text-2xl text-white md:text-[1.75rem]"
                : "text-xl text-foreground"
            )}
          >
            {feature.title}
          </h3>
          <p
            className={cn(
              "mt-2.5 text-sm leading-relaxed",
              featured ? "max-w-md text-white/70" : "text-muted-foreground"
            )}
          >
            {feature.description}
          </p>

          <div
            className={cn(
              "mt-5 flex items-center justify-between border-t pt-3.5",
              featured ? "border-white/20" : "border-foreground/10"
            )}
          >
            <span
              className={cn(
                "text-[11px] font-medium uppercase tracking-[0.18em]",
                featured ? "text-heritage" : "text-foreground/70"
              )}
            >
              {feature.cta}
            </span>
            <ArrowUpRight
              className={cn(
                "h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                featured ? "text-heritage" : "text-foreground/50"
              )}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features: Feature[] = [
    {
      icon: Bot,
      title: t("features.kora.title"),
      description: t("features.kora.description"),
      cta: "Chat with Kora",
      path: "/trip-genie",
      index: "01",
      featured: true,
      image: "/vr-assets/rumtek-monastery.jpg",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      icon: ShieldAlert,
      title: t("features.condition_report.title"),
      description: t("features.condition_report.description"),
      cta: "Submit a report",
      path: "/report-condition",
      index: "02",
      featured: true,
      image: "/vr-assets/tashiding-monastery.jpg",
      span: "lg:col-span-2",
    },
    {
      icon: Camera,
      title: t("features.virtual_tours.title"),
      description: t("features.virtual_tours.description"),
      cta: "Start the tour",
      path: "/vr-experience",
      index: "03",
      span: "lg:col-span-1",
    },
    {
      icon: MapPin,
      title: t("features.heritage.title"),
      description: t("features.heritage.description"),
      cta: "Open the map",
      path: "/heritage",
      index: "04",
      span: "lg:col-span-1",
    },
    {
      icon: Users,
      title: t("features.community_wall.title"),
      description: t("features.community_wall.description"),
      cta: "Join the conversation",
      path: "/community",
      index: "05",
      span: "lg:col-span-2",
    },
    {
      icon: Shield,
      title: t("features.emergency_assistance.title"),
      description: t("features.emergency_assistance.description"),
      cta: "See safety info",
      path: "/emergency",
      index: "06",
      span: "lg:col-span-2",
    },
  ];

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        {/* Section masthead — label, rule, then the statement. */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-primary" />
            <span className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
              {t("features.title")}
            </span>
          </div>
          <div className="mt-8 grid gap-8 border-t border-foreground/10 pt-8 md:grid-cols-12">
            <h2 className="font-display text-4xl tracking-tight text-foreground md:col-span-7 md:text-5xl">
              {t("features.description")}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:col-span-5 md:pt-2">
              {t("features.long_description")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:auto-rows-[13rem] lg:grid-cols-4">
          {features.map((feature, i) => (
            <FeatureTile key={feature.path} feature={feature} i={i} />
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <Link
            to="/explore"
            style={{ "--wipe": "hsl(var(--primary))" } as React.CSSProperties}
            className="btn-wipe group inline-flex items-center gap-3 border border-foreground/25 bg-transparent px-8 py-4 text-[13px] font-medium uppercase tracking-[0.18em] text-foreground hover:border-transparent hover:text-white"
          >
            {t("features.start_exploring_now")}
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-500 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
