import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Archive as ArchiveIcon, Search, Sparkles, ExternalLink, X, Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import ProgressiveImage from "@/components/ProgressiveImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { archiveItems, archiveCategories, type ArchiveItem } from "@/data/archive";
import { useTranslation } from "react-i18next";

/**
 * Factual Tibetan-Buddhist synonyms, added so plain-English queries can reach
 * items titled with specialist terms. These are established equivalences, not
 * guesses about what a given photograph depicts: Guru Rinpoche *is*
 * Padmasambhava, "the lotus-born"; a chorten *is* a stupa; a dukhang *is* the
 * assembly hall monks chant in. The small embedding model has no reliable
 * knowledge of this vocabulary, so without it "where monks chant" matches
 * nothing useful.
 */
const SYNONYMS: Array<[RegExp, string]> = [
  [/guru rinpoche|padmasambhava|lhakhang/i, "Padmasambhava the lotus-born saint who brought Vajrayana Buddhism to Tibet"],
  [/chorten|stupa/i, "stupa reliquary dome monument holding sacred relics"],
  [/prayer hall|dukhang|assembly/i, "dukhang assembly hall where monks gather to chant and pray"],
  [/prayer.?wheel/i, "mani wheel cylinder spun clockwise to accumulate merit"],
  [/inscription|mani|slab/i, "mani stones carved with the Om Mani Padme Hum mantra"],
  [/mural|wall art|fresco/i, "painted wall art depicting deities"],
  [/statue|idol|deity/i, "sculpted figure of a deity or teacher"],
  [/cham|mask/i, "masked ritual dance costume"],
  [/thangka|thanka/i, "scroll painting on cloth"],
];

/**
 * Text the semantic model matches against.
 *
 * The Commons descriptions are deliberately excluded: 84 of the 87 items share
 * just 22 distinct blurbs (one repeats 15 times), because they describe the
 * monastery rather than the individual photograph. Including them drowned the
 * distinguishing title in boilerplate — measurably so, e.g. "where monks
 * gather to chant" returned prayer wheels instead of the prayer hall.
 */
const searchableText = (item: ArchiveItem) => {
  const base = `${item.title}. ${item.title}. ${item.category}. ${item.monasteryName}.`;
  const extra = SYNONYMS.filter(([re]) => re.test(item.title) || re.test(item.category))
    .map(([, text]) => text)
    .join(" ");
  return extra ? `${base} ${extra}` : base;
};

/** Plain-text haystack for the non-AI keyword fallback. */
const keywordText = (item: ArchiveItem) =>
  [item.title, item.monasteryName, item.category, item.description].filter(Boolean).join(" ");

const DigitalArchive = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [searching, setSearching] = useState(false);
  /** id -> similarity score, set only after a semantic search. */
  const [ranking, setRanking] = useState<Record<string, number> | null>(null);
  const [semantic, setSemantic] = useState(false);

  const byCategory = useMemo(
    () =>
      category === "All"
        ? archiveItems
        : archiveItems.filter((i) => i.category === category),
    [category]
  );

  const visible = useMemo(() => {
    if (ranking) {
      return [...byCategory]
        .filter((i) => (ranking[i.id] ?? 0) > 0.12)
        .sort((a, b) => (ranking[b.id] ?? 0) - (ranking[a.id] ?? 0));
    }
    if (!query.trim()) return byCategory;
    // Plain keyword filter — what you get before running a semantic search,
    // and the fallback if the AI call fails.
    const q = query.toLowerCase();
    return byCategory.filter((i) => keywordText(i).toLowerCase().includes(q));
  }, [byCategory, query, ranking]);

  const runSemanticSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);

    try {
      const documents = archiveItems.map(searchableText);
      const { data, error } = await supabase.functions.invoke("archive-search", {
        body: { query: query.trim(), documents },
      });

      if (error) throw error;
      if (!data?.success || !Array.isArray(data.scores)) {
        throw new Error(data?.error || "Search returned no scores.");
      }

      const scores: Record<string, number> = {};
      archiveItems.forEach((item, i) => {
        scores[item.id] = data.scores[i] ?? 0;
      });
      setRanking(scores);
      setSemantic(true);
    } catch (err) {
      console.error("Archive semantic search failed:", err);
      // Keyword results are already showing, so this degrades rather than breaks.
      setRanking(null);
      setSemantic(false);
      toast({
        title: t("archive.showingKeyword", "Showing keyword results"),
        description: t("archive.aiUnavailable", "AI search is unavailable right now."),
      });
    } finally {
      setSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setRanking(null);
    setSemantic(false);
  };

  return (
    <PageLayout noTopPadding noBackground>
      <div className="relative min-h-screen overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-heritage/15 blur-[130px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-24">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
              <ArchiveIcon className="h-3.5 w-3.5" />
              {t("archive.label", "Digital Archive")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Murals, Shrines &{" "}
              <span className="text-gradient-heritage">Sacred Objects</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {archiveItems.length} openly-licensed images of Sikkim's monastic
              heritage, searchable by meaning rather than keywords.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mb-6 max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setRanking(null);
                    setSemantic(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && runSemanticSearch()}
                  placeholder="Try: cylinders devotees spin for merit"
                  className="border-border bg-card pl-9 pr-9 text-foreground placeholder:text-muted-foreground focus-visible:ring-heritage/40"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={runSemanticSearch}
                disabled={searching || !query.trim()}
                className="bg-gradient-to-r from-primary to-accent font-semibold text-foreground hover:opacity-90"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">{t("archive.aiSearch", "AI Search")}</span>
              </Button>
            </div>

            {semantic && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-heritage">
                <Sparkles className="h-3 w-3" />
                {t("archive.semanticNote", "Ranked by meaning — results need not contain your words.")}
              </p>
            )}
          </div>

          {/* Categories */}
          <div className="mx-auto mb-10 flex max-w-3xl flex-wrap justify-center gap-2">
            {archiveCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                  category === cat
                    ? "bg-heritage text-black"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {t("archive.category." + cat.toLowerCase().replace(/[^a-z0-9]/g, ""), cat)}
              </button>
            ))}
          </div>

          {/* Results */}
          {visible.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              Nothing matched. Try a broader description.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((item, index) => (
                <motion.a
                  key={item.id}
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.03 }}
                  className="group overflow-hidden rounded-2xl border border-border bg-card backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-foreground/30"
                >
                  <div className="relative">
                    <ProgressiveImage
                      src={item.image}
                      alt={item.title}
                      wrapperClassName="aspect-[4/3]"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur">
                      {item.category}
                    </span>
                    {ranking && (
                      <span className="absolute right-3 top-3 rounded-full bg-heritage/90 px-2 py-1 text-[10px] font-semibold text-black">
                        {Math.round((ranking[item.id] ?? 0) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">{item.monasteryName}</p>

                    {/* CC BY / CC BY-SA both require visible attribution. */}
                    <p className="mt-3 border-t border-border pt-2 text-[10px] leading-relaxed text-muted-foreground">
                      {item.author} · {item.license}
                      <ExternalLink className="ml-1 inline h-2.5 w-2.5" />
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          <p className="mx-auto mt-14 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
            All images are sourced from Wikimedia Commons under Creative Commons
            licences and remain the copyright of their photographers. Each entry
            links to its source page for full licence terms.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default DigitalArchive;
