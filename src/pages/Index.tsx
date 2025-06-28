
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DoctorSection from "@/components/home/DoctorSection";
import SymptomAnalysis from "@/components/home/SymptomAnalysis";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-6 text-xs sm:text-sm" variant="secondary">
              AI-Powered Healthcare Platform
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
              Your Health,{" "}
              <span className="text-primary">Our Priority</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 px-2 sm:px-0 max-w-2xl mx-auto leading-relaxed">
              Get instant medical advice, book appointments with qualified doctors, and manage your health records all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-0">
              <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12" asChild>
                <Link to="/symptom-checker">
                  Check Symptoms <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 h-12" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mb-12 lg:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-900 dark:text-white px-4 sm:px-0">
              Why Choose HelloDoc?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-4 sm:px-0">
              {[
                {
                  icon: <Shield className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
                  title: "Secure & Private",
                  description: "Your health data is encrypted and protected with industry-leading security measures."
                },
                {
                  icon: <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
                  title: "24/7 Availability",
                  description: "Access healthcare services anytime, anywhere with our round-the-clock platform."
                },
                {
                  icon: <Users className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />,
                  title: "Expert Doctors",
                  description: "Connect with certified healthcare professionals and specialists in various fields."
                }
              ].map((feature, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 h-full">
                  <CardHeader className="pb-3 sm:pb-4">
                    <div className="flex justify-center mb-3 sm:mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg sm:text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <CardDescription className="text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Symptom Analysis Section */}
        <SymptomAnalysis />

        {/* Doctor Section */}
        <DoctorSection doctors={[]} loading={false} />

        {/* Call to Action */}
        <CallToAction />
      </main>
    </div>
  );
};

export default Index;
