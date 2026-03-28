import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Mail, Lock, User, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setResult(null);
    const { error } = await signUp(email, password, name);
    setLoading(false);
    if (error) {
      setResult({ type: "error", message: error.message });
    } else {
      setResult({ type: "success", message: "Verification link has been sent to your email!" });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 hero-glow">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground text-lg">AI Financial Copilot</span>
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-1">Create your account</h2>
        <p className="text-sm text-muted-foreground mb-6">Start your financial journey</p>

        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.type}
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className={`mb-5 rounded-xl p-4 flex items-start gap-3 border ${
                result.type === "success"
                  ? "bg-success/10 border-success/30 text-success"
                  : "bg-destructive/10 border-destructive/30 text-destructive"
              }`}
            >
              {result.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  {result.type === "success" ? "✅ Check your email" : "❌ Signup failed"}
                </p>
                <p className="text-xs mt-0.5 opacity-80">{result.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!result?.type || result.type !== "success" ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Full Name" value={name}
                onChange={e => setName(e.target.value)} className="pl-10"
                required maxLength={100}
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="email" placeholder="Email" value={email}
                onChange={e => setEmail(e.target.value)} className="pl-10"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input
                type="password" placeholder="Password (min 6 chars)" value={password}
                onChange={e => setPassword(e.target.value)} className="pl-10"
                required minLength={6}
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : "Create Account"}
            </Button>
            <p className="text-xs text-center text-muted-foreground pt-1">
              📧 Please check your email and verify your account before logging in.
            </p>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Verify your email, then sign in to get started.
            </p>
            <Button asChild className="w-full">
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
        <p className="mt-2 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
