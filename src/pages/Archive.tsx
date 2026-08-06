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

/** Text the semantic model matches against for each item. */
const searchableText = (item: ArchiveItem) =>
  [item.title, item.monasteryName, item.category, item.description]
    .filter(Boolean)
    .join(". ");

const DigitalArchive = () => {
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
    return byCategory.filter((i) => searchableText(i).toLowerCase().includes(q));
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
        title: "Showing keyword results",
        description: "AI search is unavailable right now.",
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
      <div className="relative min-h-screen overflow-hidden bg-[#0a0e1a]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/3 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/25 blur-[130px]" />
          <div className="absolute bottom-0 right-0 h-[26rem] w-[26rem] translate-x-1/3 rounded-full bg-heritage/15 blur-[130px]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 pt-28 pb-24">
          {/* Header */}
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <ArchiveIcon className="h-3.5 w-3.5" />
              Digital Archive
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Murals, Shrines &{" "}
              <span className="text-gradient-heritage">Sacred Objects</span>
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              {archiveItems.length} openly-licensed images of Sikkim's monastic
              heritage, searchable by meaning rather than keywords.
            </p>
          </div>

          {/* Search */}
          <div className="mx-auto mb-6 max-w-2xl">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setRanking(null);
                    setSemantic(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && runSemanticSearch()}
                  placeholder="Try: cylinders devotees spin for merit"
                  className="border-white/15 bg-white/5 pl-9 pr-9 text-white placeholder:text-white/40 focus-visible:ring-heritage/40"
                />
                {query && (
                  <button
                    onClick={clearSearch}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                onClick={runSemanticSearch}
                disabled={searching || !query.trim()}
                className="bg-gradient-to-r from-primary to-accent font-semibold text-white hover:opacity-90"
              >
                {searching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                <span className="ml-2 hidden sm:inline">AI Search</span>
              </Button>
            </div>

            {semantic && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-heritage">
                <Sparkles className="h-3 w-3" />
                Ranked by meaning — results need not contain your words.
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
                    : "border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results */}
          {visible.length === 0 ? (
            <p className="text-center text-sm text-white/50">
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
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/25"
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
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-white/50">{item.monasteryName}</p>

                    {/* CC BY / CC BY-SA both require visible attribution. */}
                    <p className="mt-3 border-t border-white/10 pt-2 text-[10px] leading-relaxed text-white/40">
                      {item.author} · {item.license}
                      <ExternalLink className="ml-1 inline h-2.5 w-2.5" />
                    </p>
                  </div>
                </motion.a>
              ))}
            </div>
          )}

          <p className="mx-auto mt-14 max-w-2xl text-center text-xs leading-relaxed text-white/35">
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
