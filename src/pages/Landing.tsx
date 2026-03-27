import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Shield, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: TrendingUp, title: "FIRE Planner", desc: "Calculate your path to financial independence" },
  { icon: Shield, title: "Money Health Score", desc: "Get a 360° view of your financial fitness" },
  { icon: Calculator, title: "Tax AI Engine", desc: "Old vs New regime — save lakhs automatically" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground text-lg">AI Financial Copilot</span>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" asChild><Link to="/login">Login</Link></Button>
          <Button asChild><Link to="/signup">Get Started</Link></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/30 text-primary mb-6">
            🇮🇳 Built for India
          </span>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground max-w-3xl leading-tight">
            Your AI-Powered<br />
            <span className="gradient-text-primary">Financial Copilot</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
            Smart tax planning, FIRE projections, and personalized insights — designed for the Indian financial ecosystem.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link to="/signup">Start Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-card rounded-xl p-6 text-center"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
