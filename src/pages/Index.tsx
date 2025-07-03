
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Calendar, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
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
              Welcome to HelloDoc
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight px-2">
              Your Health Journey{" "}
              <span className="text-primary">Starts Here</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-2 max-w-3xl mx-auto leading-relaxed">
              Connect with qualified doctors, manage your health records, and get the care you deserve - all in one convenient platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-2">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                <Link to="/doctors">
                  Browse Doctors <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                <Link to="/symptom-checker">Find by Symptoms</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="mb-8 sm:mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-gray-900 dark:text-white px-2">
              What would you like to do?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
              <Link to="/doctors" className="block">
                <Card className="text-center hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:scale-105">
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                      <Heart className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Browse Doctors</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 sm:px-6">
                    <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                      Explore our network of qualified healthcare professionals and find the right specialist for you.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/symptom-checker" className="block">
                <Card className="text-center hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:scale-105">
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                      <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Find by Symptoms</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 sm:px-6">
                    <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                      Describe your symptoms and we'll help you find doctors who specialize in treating your condition.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/auth" className="block">
                <Card className="text-center hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:scale-105">
                  <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                    <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                      <Calendar className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Book Appointment</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 px-4 sm:px-6">
                    <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                      Schedule a consultation with your preferred doctor at a time that works for you.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default Index;
