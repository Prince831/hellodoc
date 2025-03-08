
import { useState } from "react";
import { mockDoctors } from "@/types/messages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onSelectDoctor: (doctorId: string) => void;
}

const DoctorSelector = ({ selectedDoctorId, onSelectDoctor }: DoctorSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredDoctors = mockDoctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search for a doctor" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDoctors.map(doctor => (
          <div 
            key={doctor.id}
            className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
              selectedDoctorId === doctor.id ? 'border-primary bg-primary/10' : ''
            }`}
            onClick={() => onSelectDoctor(doctor.id)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-medium text-lg">
                {doctor.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-medium">{doctor.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Family Medicine
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {filteredDoctors.length === 0 && (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            No doctors found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorSelector;
