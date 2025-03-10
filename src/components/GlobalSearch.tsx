
import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
import SearchResultItem from "./search/SearchResultItem";
import type { SearchResult } from "@/types/search";

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, loading, performSearch } = useGlobalSearch();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, performSearch]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.url);
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 xl:mr-2" />
        <span className="hidden xl:inline-flex">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium opacity-100 xl:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search doctors, appointments, records..."
          value={search}
          onValueChange={setSearch}
          ref={inputRef}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : (
              "No results found."
            )}
          </CommandEmpty>
          {results.length > 0 && (
            <>
              <CommandGroup heading="Doctors">
                {results
                  .filter(result => result.type === 'doctor')
                  .map(result => (
                    <CommandItem
                      key={`doctor-${result.id}`}
                      onSelect={() => handleSelect(result)}
                    >
                      <SearchResultItem result={result} onSelect={handleSelect} />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Appointments">
                {results
                  .filter(result => result.type === 'appointment')
                  .map(result => (
                    <CommandItem
                      key={`appointment-${result.id}`}
                      onSelect={() => handleSelect(result)}
                    >
                      <SearchResultItem result={result} onSelect={handleSelect} />
                    </CommandItem>
                  ))}
              </CommandGroup>
              <CommandGroup heading="Health Records">
                {results
                  .filter(result => result.type === 'record')
                  .map(result => (
                    <CommandItem
                      key={`record-${result.id}`}
                      onSelect={() => handleSelect(result)}
                    >
                      <SearchResultItem result={result} onSelect={handleSelect} />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
