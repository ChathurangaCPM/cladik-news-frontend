"use client";

import { Search, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useTransition, useEffect, useRef } from "react";
import { searchNewsAction } from "@/app/developer/news/actions";
import moment from "moment";

export default function NewsSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qStr = searchParams.get("q") || "";

  const [query, setQuery] = useState(qStr);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLFormElement>(null);

  // Debounced semantic search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsSearching(true);
      searchNewsAction(trimmed, 5)
        .then((results) => {
          setSuggestions(results);
          setShowSuggestions(true);
        })
        .catch(console.error)
        .finally(() => {
          setIsSearching(false);
        });
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setShowSuggestions(false);
      startTransition(() => {
        const trimmed = query.trim();
        if (trimmed) {
          router.push(`/developer/news?q=${encodeURIComponent(trimmed)}`);
        } else {
          router.push(`/developer/news`);
        }
      });
    },
    [query, router],
  );

  const handleClear = () => {
    setQuery("");
    setShowSuggestions(false);
    startTransition(() => {
      router.push(`/developer/news`);
    });
  };

  return (
    <form
      ref={containerRef}
      onSubmit={handleSearch}
      className="relative flex items-center w-full max-w-2xl mx-auto mb-8 px-4 group z-20"
    >
      <div className="absolute inset-y-0 left-5 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-zinc-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors z-10">
        {isSearching || isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Search className="w-5 h-5" />
        )}
      </div>
      <input
        type="search"
        value={query}
        onChange={(e) => {
          const val = e.target.value;
          setQuery(val);
          if (val.trim() === "") {
            setShowSuggestions(false);
            startTransition(() => {
              router.push(`/news`);
            });
          } else {
            setShowSuggestions(true);
          }
        }}
        onFocus={() => {
          if (suggestions.length > 0) setShowSuggestions(true);
        }}
        placeholder="Search conceptual topics..."
        className="w-full pl-14 pr-12 rounded-full h-[60px] bg-white dark:bg-zinc-900/30 border border-slate-200 dark:border-zinc-800/80 outline-none shadow-[0_4px_20px_rgb(0,0,0,0.03)] dark:shadow-[0_4px_20px_rgb(0,0,0,0.3)] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all font-inter text-slate-800 dark:text-zinc-100"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-5 flex items-center pr-4 text-neutral-400 hover:text-slate-650 dark:hover:text-zinc-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-4 right-4 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border border-slate-100 dark:border-zinc-800/80 rounded-3xl shadow-xl dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden z-50">
          <ul className="py-2">
            {suggestions.map((item) => (
              <li key={item._id}>
                <button
                  type="button"
                  onClick={() => {
                    setQuery(item.title);
                    setShowSuggestions(false);
                    if (item.slug) {
                      router.push(`/news/${item.slug}`);
                    } else {
                      router.push(`/news?q=${encodeURIComponent(item.title)}`);
                    }
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors flex items-start gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-light text-slate-800 dark:text-zinc-100 line-clamp-2 leading-snug font-inter">
                      {item.title}
                    </span>
                    {item.categories && item.categories[0] && (
                      <span className="text-[10px] text-muted-foreground mt-0.5 capitalize tracking-wide block">
                        {item.categories[0]}
                      </span>
                    )}
                    <div className="text-[10px] text-muted-foreground mt-0.5 capitalize tracking-wide block">
                      {moment(item.pubDate || item.createdAt).fromNow()}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <div className="text-xs text-muted-foreground text-center mt-0.5 capitalize block p-3 bg-slate-50/80 dark:bg-zinc-900/40 border-t border-slate-100 dark:border-zinc-800/80">
            Press enter to search all{" "}
            <span className="font-medium truncate max-w-[100px] h-3 overflow-hidden inline-block">
              "{query}"
            </span>{" "}
            related news
          </div>
        </div>
      )}
    </form>
  );
}
