
import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type SearchResult = {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'doctor' | 'appointment' | 'record';
  url: string;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcut to open search
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

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      // Search for doctors
      const { data: doctors, error: doctorsError } = await supabase
        .from('doctors')
        .select('id, name, specialization')
        .ilike('name', `%${query}%`)
        .limit(5);

      if (doctorsError) throw doctorsError;

      // Search for appointments
      const { data: appointments, error: appointmentsError } = await supabase
        .from('appointments')
        .select(`
          id, 
          date, 
          reason,
          doctor:doctor_id (
            name
          )
        `)
        .ilike('reason', `%${query}%`)
        .limit(5);

      if (appointmentsError) throw appointmentsError;

      // Search for health records
      const { data: records, error: recordsError } = await supabase
        .from('health_records')
        .select(`
          id, 
          diagnosis, 
          date
        `)
        .ilike('diagnosis', `%${query}%`)
        .limit(5);

      if (recordsError) throw recordsError;

      // Format the results
      const formattedResults: SearchResult[] = [
        ...(doctors || []).map((doctor) => ({
          id: doctor.id,
          title: doctor.name,
          description: `${doctor.specialization}`,
          icon: "user-md",
          type: 'doctor' as const,
          url: `/doctor/${doctor.id}`
        })),
        ...(appointments || []).map((appointment) => ({
          id: appointment.id,
          title: appointment.doctor?.name || "Appointment",
          description: `${new Date(appointment.date).toLocaleDateString()} - ${appointment.reason}`,
          icon: "calendar",
          type: 'appointment' as const,
          url: `/appointments?id=${appointment.id}`
        })),
        ...(records || []).map((record) => ({
          id: record.id,
          title: record.diagnosis,
          description: `Record from ${new Date(record.date).toLocaleDateString()}`,
          icon: "file-text",
          type: 'record' as const,
          url: `/health-records?id=${record.id}`
        }))
      ];

      setResults(formattedResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    navigate(result.url);
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><path d="M13 11v4"></path><path d="M16 13h-6"></path></svg>;
      case 'appointment':
        return <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
      case 'record':
        return <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>;
      default:
        return <Search className="h-4 w-4 mr-2" />;
    }
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
                      className="flex items-center"
                    >
                      {renderIcon(result.type)}
                      <div>
                        <p>{result.title}</p>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
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
                      className="flex items-center"
                    >
                      {renderIcon(result.type)}
                      <div>
                        <p>{result.title}</p>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
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
                      className="flex items-center"
                    >
                      {renderIcon(result.type)}
                      <div>
                        <p>{result.title}</p>
                        <p className="text-sm text-muted-foreground">{result.description}</p>
                      </div>
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
