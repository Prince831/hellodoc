
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Symptom Checker",
    description: "Get instant AI-powered analysis of your symptoms and recommendations",
    icon: "🤖",
  },
  {
    title: "Video Consultations",
    description: "Connect with doctors face-to-face from the comfort of your home",
    icon: "🎥",
  },
  {
    title: "Instant Messaging",
    description: "Quick chat with healthcare professionals for minor concerns",
    icon: "💬",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 animate-fade-down">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Healthcare at Your Fingertips
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect with qualified doctors instantly through secure video calls and chat.
            Get the care you need, when you need it.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="h-12 px-8">
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="h-12 px-8">
              <Link to="/symptom-checker">Try AI Symptom Checker</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 animate-fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-primary text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of patients who trust Hello Doc for their healthcare needs.
          </p>
          <Button
            variant="secondary"
            size="lg"
            asChild
            className="h-12 px-8 text-primary"
          >
            <Link to="/signup">Sign Up Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
