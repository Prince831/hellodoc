
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Star, Clock } from "lucide-react";
import { useDoctors } from "@/hooks/useDoctors";
import DoctorList from "@/components/symptom-checker/DoctorList";
import { useLocation } from "react-router-dom";

const DoctorsList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const location = useLocation();
  
  // Get recommended specialization from symptom checker if available
  const recommendedSpecialization = location.state?.recommendedSpecialization || "";
  
  const { data: doctors = [], isLoading } = useDoctors(
    selectedSpecialization || recommendedSpecialization,
    searchTerm
  );

  const specializations = [
    "General Practice",
    "Cardiology", 
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology"
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Find Your Doctor
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Connect with certified healthcare professionals and book appointments with ease.
          </p>
          {recommendedSpecialization && (
            <Badge className="mt-4 bg-primary/10 text-primary border-primary/20">
              Recommended: {recommendedSpecialization}
            </Badge>
          )}
        </motion.div>

        {/* Search and Filters */}
        <motion.div variants={fadeInUp} initial="initial" animate="animate" className="mb-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Doctors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by name or specialization..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Button variant="outline" className="md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Specialization Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Specialization</label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedSpecialization === "" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialization("")}
                  >
                    All
                  </Button>
                  {specializations.map((spec) => (
                    <Button
                      key={spec}
                      variant={selectedSpecialization === spec ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSpecialization(spec)}
                    >
                      {spec}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          variants={fadeInUp} 
          initial="initial" 
          animate="animate"
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold">4.8+</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Available</div>
          </Card>
          <Card className="text-center p-6">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="h-8 w-8 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm text-muted-foreground">Doctors</div>
          </Card>
        </motion.div>

        {/* Doctors List */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.4 }}
        >
          <DoctorList 
            doctors={doctors}
            loading={isLoading}
            title={selectedSpecialization ? `${selectedSpecialization} Specialists` : "All Available Doctors"}
            onSearch={() => {
              setSearchTerm("");
              setSelectedSpecialization("");
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorsList;
