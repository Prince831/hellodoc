
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DoctorSection from "@/components/home/DoctorSection";
import { useDoctors } from "@/hooks/useDoctors";

const Doctors = () => {
  const { data: doctors = [], isLoading } = useDoctors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm px-2 py-1" variant="secondary">
              Find Your Perfect Healthcare Provider
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight px-2">
              Meet Our{" "}
              <span className="text-primary">Expert Doctors</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-2 max-w-3xl mx-auto leading-relaxed">
              Browse our network of qualified healthcare professionals and book appointments with specialists in various medical fields.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-2">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                <Link to="/symptom-checker">
                  Find Doctors by Symptoms <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                <Link to="/auth">Book Appointment</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Why Choose Section */}
        <motion.section 
          className="mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-gray-900 dark:text-white px-2">
              Why Choose Our Doctors?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
              {[
                {
                  icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />,
                  title: "Certified Professionals",
                  description: "All our doctors are board-certified with verified credentials and years of experience."
                },
                {
                  icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />,
                  title: "Flexible Scheduling",
                  description: "Book appointments at your convenience with flexible time slots and quick booking options."
                },
                {
                  icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />,
                  title: "Specialized Care",
                  description: "Find specialists across multiple medical fields to address your specific healthcare needs."
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 sm:px-6">
                    <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Doctor Section */}
        <DoctorSection doctors={doctors} loading={isLoading} />
      </main>
    </div>
  );
};

export default Doctors;
