import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Clock, Users, Star, Heart, Zap, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const { user } = useAuth();

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
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description: "Your health data is encrypted and protected with industry-leading security measures."
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "24/7 Availability",
      description: "Access healthcare services anytime, anywhere with our round-the-clock platform."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Expert Doctors",
      description: "Connect with certified healthcare professionals and specialists in various fields."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "AI-Powered",
      description: "Get instant symptom analysis and personalized health recommendations."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Comprehensive Care",
      description: "From consultations to prescriptions, manage your entire health journey."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Trusted Platform",
      description: "Join thousands of satisfied users who trust HelloDoc for their healthcare needs."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Patients" },
    { number: "500+", label: "Expert Doctors" },
    { number: "24/7", label: "Support Available" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-indigo-500/5" />
        
        <div className="relative container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="mb-4 text-sm px-4 py-2" variant="secondary">
                <Star className="h-4 w-4 mr-2" />
                AI-Powered Healthcare Platform
              </Badge>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            >
              Your Health,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                Our Priority
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-3xl mx-auto"
            >
              Experience the future of healthcare with instant medical advice, expert consultations, 
              and comprehensive health management - all in one intelligent platform.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user ? (
                <>
                  <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link to="/dashboard">
                      Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link to="/doctors">Browse Doctors</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button size="lg" className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link to="/symptom-checker">
                      Check Symptoms <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all" asChild>
                    <Link to="/doctors">Browse Doctors</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-20 left-10 opacity-20"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Heart className="h-12 w-12 text-primary" />
        </motion.div>
        
        <motion.div
          className="absolute top-32 right-16 opacity-20"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        >
          <Shield className="h-16 w-16 text-indigo-500" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-sm lg:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose HelloDoc?
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience healthcare like never before with our comprehensive suite of features
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-6 mx-auto">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-indigo-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 relative">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerChildren}
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6"
            >
              Ready to Transform Your Healthcare Experience?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-lg lg:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            >
              Join thousands of users who have already discovered the power of AI-driven healthcare. 
              Start your journey to better health today.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {!user && (
                <>
                  <Button 
                    size="lg" 
                    variant="secondary"
                    className="text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all text-primary font-semibold"
                    asChild
                  >
                    <Link to="/auth">
                      Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg px-8 py-6 h-auto border-white text-white hover:bg-white hover:text-primary transition-all"
                    asChild
                  >
                    <Link to="/doctors">Browse Doctors</Link>
                  </Button>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
