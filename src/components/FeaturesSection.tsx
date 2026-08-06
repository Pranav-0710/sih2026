import { Button } from "@/components/ui/button";
import {
  Bot,
  MapPin,
  Users,
  Shield,
  ShieldAlert,
  Compass,
  Camera,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const iconColorVariants: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  heritage: "bg-heritage/15 text-heritage",
  accent: "bg-accent/10 text-accent",
  nature: "bg-nature/10 text-nature",
  destructive: "bg-destructive/10 text-destructive",
  cultural: "bg-cultural/10 text-cultural",
};

/**
 * Bento tile. Content is always visible — nothing is hidden behind a hover,
 * so everything is readable on touch devices and on a projector.
 */
const BentoTile = ({ feature, index }) => {
  const featured = feature.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.08 }}
      className={cn("min-h-[190px]", feature.span)}
    >
      <Link
        to={feature.path}
        className={cn(
          "group relative flex h-full flex-col justify-end overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:-translate-y-1.5",
          featured
            ? "border-white/10 text-white shadow-2xl hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.5)]"
            : "border-border bg-card shadow-sm hover:border-primary/30 hover:shadow-xl"
        )}
      >
        {/* Featured tiles get real photography behind the copy */}
        {featured && (
          <>
            <img
              src={feature.image}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/25" />
          </>
        )}

        <div className="relative">
          <div
            className={cn(
              "mb-4 flex h-11 w-11 items-center justify-center rounded-xl",
              featured
                ? "bg-white/15 text-white backdrop-blur"
                : iconColorVariants[feature.color]
            )}
          >
            <feature.icon className="h-5 w-5" />
          </div>

          <h3
            className={cn(
              "font-display font-semibold tracking-tight",
              featured
                ? "text-2xl text-white md:text-3xl"
                : "text-lg text-foreground"
            )}
          >
            {feature.title}
          </h3>

          <p
            className={cn(
              "mt-2 leading-relaxed",
              featured
                ? "max-w-md text-sm text-white/75"
                : "text-sm text-muted-foreground"
            )}
          >
            {feature.description}
          </p>

          <span
            className={cn(
              "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold transition-transform duration-300 group-hover:translate-x-1",
              featured ? "text-heritage" : "text-primary"
            )}
          >
            {feature.cta}
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: Bot,
      title: t("features.kora.title"),
      description: t("features.kora.description"),
      cta: "Chat with Kora",
      color: "primary",
      path: "/trip-genie",
      featured: true,
      image: "/vr-assets/rumtek-monastery.jpg",
      span: "lg:col-span-2 lg:row-span-2",
    },
    {
      icon: ShieldAlert,
      title: t("features.condition_report.title"),
      description: t("features.condition_report.description"),
      cta: "Submit a report",
      color: "heritage",
      path: "/report-condition",
      featured: true,
      image: "/vr-assets/tashiding-monastery.jpg",
      span: "lg:col-span-2",
    },
    {
      icon: Camera,
      title: t("features.virtual_tours.title"),
      description: t("features.virtual_tours.description"),
      cta: "Start the tour",
      color: "accent",
      path: "/vr-experience",
      span: "lg:col-span-1",
    },
    {
      icon: MapPin,
      title: t("features.heritage.title"),
      description: t("features.heritage.description"),
      cta: "Open the map",
      color: "cultural",
      path: "/heritage",
      span: "lg:col-span-1",
    },
    {
      icon: Users,
      title: t("features.community_wall.title"),
      description: t("features.community_wall.description"),
      cta: "Join the conversation",
      color: "nature",
      path: "/community",
      span: "lg:col-span-2",
    },
    {
      icon: Shield,
      title: t("features.emergency_assistance.title"),
      description: t("features.emergency_assistance.description"),
      cta: "See safety info",
      color: "destructive",
      path: "/emergency",
      span: "lg:col-span-2",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 text-primary mb-4">
            <Compass className="h-5 w-5" />
            <span className="font-semibold">{t("features.title")}</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4 tracking-tight">
            {t("features.description")}
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t("features.long_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:auto-rows-[minmax(190px,auto)]">
          {features.map((feature, index) => (
            <BentoTile key={feature.path} feature={feature} index={index} />
          ))}
        </div>

        <div className="text-center mt-16">
          <Button
            size="lg"
            asChild
            className="font-bold text-lg px-8 py-6 rounded-2xl bg-gradient-to-r from-primary to-nature text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            <Link to="/explore">
              <Camera className="h-6 w-6 mr-3" />
              {t("features.start_exploring_now")}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
