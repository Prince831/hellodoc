
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Calendar, MessageCircle, Shield, Clock, Users, Star, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Index = () => {
  const user = null; // No authentication

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  const features = [
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />,
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with industry-leading security measures."
    },
    {
      icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />,
      title: "24/7 Availability",
      description: "Access healthcare services anytime, anywhere with our round-the-clock platform."
    },
    {
      icon: <Users className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />,
      title: "Expert Doctors",
      description: "Connect with certified healthcare professionals and specialists in various fields."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Patients" },
    { number: "500+", label: "Expert Doctors" },
    { number: "24/7", label: "Support Available" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/3 to-accent/5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 lg:py-12">
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-8 sm:mb-12 lg:mb-16"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="mb-3 sm:mb-4 lg:mb-6 text-xs sm:text-sm px-2 py-1" variant="secondary">
                <Star className="h-4 w-4 mr-2" />
                Welcome to HelloDoc
              </Badge>
            </motion.div>
            <motion.h1 
              variants={fadeInUp}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight px-2"
            >
              Your Health Journey{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                Starts Here
              </span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 lg:mb-8 px-4 sm:px-2 max-w-3xl mx-auto leading-relaxed"
            >
              Connect with qualified doctors, manage your health records, and get the care you deserve - all in one convenient platform.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 sm:px-2"
            >
              {user ? (
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                    <Link to="/symptom-checker">
                      Start with Symptoms <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 lg:px-8 h-10 sm:h-11 lg:h-12" asChild>
                    <Link to="/doctors">Browse All Doctors</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          className="py-8 sm:py-12 mb-8 sm:mb-12 lg:mb-16 relative"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <div className="relative backdrop-blur-sm bg-card/80 rounded-2xl shadow-xl border border-border/20 p-6">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl blur-lg opacity-60" />
            <div className="relative container mx-auto px-4">
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8"
              variants={staggerChildren}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm lg:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section 
          className="mb-8 sm:mb-12 lg:mb-16"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              variants={fadeInUp}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-gray-900 dark:text-white px-2"
            >
              What would you like to do?
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0"
              variants={staggerChildren}
            >
              <motion.div variants={scaleIn}>
                <Link to="/symptom-checker" className="block">
                  <Card className="text-center hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:scale-105 border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                    <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                      <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                        <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                      </div>
                      <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Start with Symptoms</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 sm:px-6">
                      <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                        Tell us what you're experiencing and we'll connect you with the right doctors for your condition.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Link to="/doctors" className="block">
                  <Card className="text-center hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:scale-105 border-0 shadow-md">
                    <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                      <div className="flex justify-center mb-2 sm:mb-3 lg:mb-4">
                        <Heart className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
                      </div>
                      <CardTitle className="text-base sm:text-lg lg:text-xl mb-2">Browse All Doctors</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 px-4 sm:px-6">
                      <CardDescription className="text-xs sm:text-sm lg:text-base leading-relaxed">
                        Explore our network of qualified healthcare professionals and find specialists by category.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>

              <motion.div variants={scaleIn}>
                <Link to="/appointments" className="block">
                  <Card className="text-center hover:shadow-lg transition-all duration-300 h-full cursor-pointer hover:scale-105 border-0 shadow-md">
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
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="mb-8 sm:mb-12 lg:mb-16"
          initial="initial"
          animate="animate"
          variants={staggerChildren}
        >
          <div className="max-w-6xl mx-auto">
            <motion.h2 
              variants={fadeInUp}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-12 text-gray-900 dark:text-white px-2"
            >
              Why Choose HelloDoc?
            </motion.h2>
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0"
              variants={staggerChildren}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-center">
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
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* CTA Section */}
        {!user && (
          <motion.section 
            className="py-12 lg:py-16 bg-gradient-to-r from-primary to-indigo-600 text-white relative overflow-hidden rounded-2xl"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="container mx-auto px-4 relative">
              <motion.div
                className="text-center max-w-4xl mx-auto"
                variants={staggerChildren}
              >
                <motion.h2 
                  variants={fadeInUp}
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6"
                >
                  Ready to Transform Your Healthcare Experience?
                </motion.h2>
                <motion.p 
                  variants={fadeInUp}
                  className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto"
                >
                  Join thousands of users who have already discovered the power of comprehensive healthcare management. 
                  Start your journey to better health today.
                </motion.p>
                <motion.div 
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
                >
                    <Button 
                    size="lg" 
                    variant="secondary"
                    className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-auto shadow-lg hover:shadow-xl transition-all text-primary font-semibold"
                    asChild
                  >
                    <Link to="/dashboard">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 h-auto border-white text-white hover:bg-white hover:text-primary transition-all"
                    asChild
                  >
                    <Link to="/symptom-checker">Try Symptom Checker</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </main>
      </div>
    </div>
  );
};

export default Index;
