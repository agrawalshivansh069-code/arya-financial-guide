import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Shield, Calculator, ArrowRight, Zap, BarChart3, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: TrendingUp, title: "FIRE Planner", desc: "Calculate your path to financial independence with real-time projections" },
  { icon: Shield, title: "Money Health Score", desc: "Get a 360° view of your financial fitness with AI-powered analysis" },
  { icon: Calculator, title: "Tax AI Engine", desc: "Old vs New regime comparison — save lakhs automatically" },
  { icon: BarChart3, title: "Smart Dashboard", desc: "Real-time insights with risk badges and actionable recommendations" },
  { icon: Target, title: "Goal Tracker", desc: "Track your financial goals with milestone-based progress" },
  { icon: Zap, title: "Life Events Simulator", desc: "See how marriage, home purchase, or job loss impacts your finances" },
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
          <Button asChild className="gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"><Link to="/signup">Get Started</Link></Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center py-24 hero-glow">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold border border-primary/30 text-primary mb-6 bg-primary/5">
            🇮🇳 Built for India — Powered by AI
          </span>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground max-w-4xl leading-[1.1]">
            Your AI-Powered<br />
            <span className="gradient-text-primary">Financial Copilot</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Smart tax planning, FIRE projections, and personalized insights — designed for the Indian financial ecosystem.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap">
            <Button size="lg" asChild className="gap-2 gradient-primary text-primary-foreground hover:opacity-90 transition-opacity px-8 text-base">
              <Link to="/signup">Start Free <ArrowRight className="w-4 h-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="px-8 text-base border-border/60">
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-12 pb-24">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-center mb-12">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">Everything you need to master your money</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Six powerful tools, one intelligent platform.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="glass-card glass-card-hover rounded-xl p-6"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Financial Copilot. Built with ❤️ for India.
      </footer>
    </div>
  );
}
