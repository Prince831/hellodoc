import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Heart, Calendar, MessageCircle, Shield, Clock, Users, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Aurora from "@/components/layout/Aurora";
import PageTransition from "@/components/layout/PageTransition";
import TiltCard from "@/components/ui/tilt-card";
import SceneBoundary, { isWebGLAvailable } from "@/components/three/SceneBoundary";

const HeroScene = lazy(() => import("@/components/three/HeroScene"));


const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.09 } },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.94, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

const features = [
  {
    icon: Shield,
    title: "Private by design",
    description: "Row-level security, verified clinicians and encrypted sessions protect every record you store.",
  },
  {
    icon: Clock,
    title: "Care around the clock",
    description: "Book, message and join consultations whenever symptoms appear — no waiting rooms involved.",
  },
  {
    icon: Users,
    title: "Verified specialists",
    description: "Every doctor in the directory is credential-checked before they can accept an appointment.",
  },
];

const quickActions = [
  {
    to: "/symptom-checker",
    icon: MessageCircle,
    title: "Start with symptoms",
    description: "Describe what you feel and get an AI triage summary with the right specialty to see next.",
  },
  {
    to: "/doctors",
    icon: Heart,
    title: "Browse doctors",
    description: "Explore verified professionals by specialty, availability and consultation fee.",
  },
  {
    to: "/appointments",
    icon: Calendar,
    title: "Book a consultation",
    description: "Pick a slot that suits you and join by secure video when the time arrives.",
  },
];

const stats = [
  { number: "50K+", label: "Patients cared for" },
  { number: "500+", label: "Verified doctors" },
  { number: "24/7", label: "Consultation access" },
  { number: "99.9%", label: "Platform uptime" },
];

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <Aurora />
      <Navbar />

      <PageTransition>
        <main className="container mx-auto px-4 py-10 lg:py-16">
          {/* Hero */}
          <motion.section
            className="grid items-center gap-10 lg:grid-cols-2 lg:gap-6"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            <div className="max-w-xl">
              <motion.div variants={fadeInUp}>
                <Badge variant="secondary" className="mb-5 gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI triage · Live video care
                </Badge>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl xl:text-6xl"
              >
                Your health journey,{" "}
                <span className="gradient-text">beautifully connected</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
                Triage your symptoms with AI, meet verified doctors over secure WebRTC video, and keep prescriptions,
                notes and records flowing in one calm workspace.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/symptom-checker">
                    Start with symptoms <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="glass" size="lg" asChild>
                  <Link to="/doctors">Browse all doctors</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              variants={scaleIn}
              className="relative mx-auto h-[300px] w-full max-w-xl sm:h-[380px] lg:h-[460px]"
            >
              <div className="absolute inset-8 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
              {isWebGLAvailable() ? (
                <SceneBoundary>
                  <Suspense
                    fallback={
                      <div className="grid h-full place-items-center">
                        <div className="h-40 w-40 animate-pulse rounded-full bg-gradient-primary opacity-30 blur-2xl" />
                      </div>
                    }
                  >
                    <HeroScene className="h-full w-full" />
                  </Suspense>
                </SceneBoundary>
              ) : (
                <div className="grid h-full place-items-center">
                  <div className="float-3d h-48 w-48 rounded-full bg-gradient-primary opacity-40 blur-2xl" />
                </div>
              )}

            </motion.div>
          </motion.section>

          {/* Stats */}
          <motion.section
            className="mt-16"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <div className="glass-panel grid grid-cols-2 gap-6 p-8 lg:grid-cols-4">
              {stats.map((stat) => (
                <motion.div key={stat.label} variants={scaleIn} className="text-center">
                  <div className="font-display text-3xl font-bold gradient-text lg:text-4xl">{stat.number}</div>
                  <div className="mt-1 text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Quick actions */}
          <motion.section
            className="mt-20 scene-3d"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-center font-display text-3xl font-bold md:text-4xl">
              What would you like to do?
            </motion.h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <motion.div key={action.to} variants={scaleIn}>
                  <TiltCard className="h-full rounded-lg">
                    <Link to={action.to} className="block h-full">
                      <Card className="h-full border-transparent gradient-border hover:shadow-elevated">
                        <CardHeader>
                          <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                            <action.icon className="h-6 w-6 text-primary-foreground" />
                          </span>
                          <CardTitle className="text-xl">{action.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-sm leading-relaxed">{action.description}</CardDescription>
                        </CardContent>
                      </Card>
                    </Link>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Features */}
          <motion.section
            className="mt-20 scene-3d"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <motion.h2 variants={fadeInUp} className="text-center font-display text-3xl font-bold md:text-4xl">
              Why choose HelloDoc?
            </motion.h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={scaleIn}>
                  <Card className="tilt-3d h-full">
                    <CardHeader>
                      <span className="mb-3 grid h-12 w-12 place-items-center rounded-xl bg-gradient-mint">
                        <feature.icon className="h-6 w-6 text-accent-foreground" />
                      </span>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.section
            className="relative mt-20 overflow-hidden rounded-2xl p-10 text-center lg:p-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-95" />
            <div className="relative mx-auto max-w-3xl text-primary-foreground">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                Ready to transform your healthcare experience?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm opacity-90 md:text-base">
                Join thousands already managing appointments, records and live consultations in one secure place.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button size="lg" variant="glass" asChild className="text-primary-foreground">
                  <Link to="/dashboard">
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="glass" asChild className="text-primary-foreground">
                  <Link to="/symptom-checker">Try symptom checker</Link>
                </Button>
              </div>
            </div>
          </motion.section>
        </main>
      </PageTransition>
    </div>
  );
};

export default Index;
