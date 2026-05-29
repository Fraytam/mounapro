"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, BarChart3, Calculator, Check, ChevronDown, DollarSign, LineChart, Menu, Shield, Sparkles, Star, Target, TrendingUp, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
    <div className="relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
              <TrendingUp className="h-4 w-4 text-white dark:text-zinc-900" />
            </div>
            <span className="text-lg font-bold">MounaPro</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Features
            </Link>
            <Link href="#calculators" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Calculators
            </Link>
            <Link href="#pricing" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Pricing
            </Link>
            <Link href="/login" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
              Sign In
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started Free</Button>
            </Link>
          </div>
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-zinc-200 dark:border-zinc-800 md:hidden"
            >
              <div className="flex flex-col gap-3 px-6 py-4">
                <Link href="#features" className="text-sm text-zinc-600 dark:text-zinc-400">Features</Link>
                <Link href="#calculators" className="text-sm text-zinc-600 dark:text-zinc-400">Calculators</Link>
                <Link href="#pricing" className="text-sm text-zinc-600 dark:text-zinc-400">Pricing</Link>
                <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-400">Sign In</Link>
                <Link href="/signup"><Button size="sm" className="w-full">Get Started Free</Button></Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0">
          <div className="floating-gradient h-96 w-96 bg-zinc-900 dark:bg-zinc-50 top-20 left-10 animate-float" />
          <div className="floating-gradient h-72 w-72 bg-zinc-600 dark:bg-zinc-400 bottom-20 right-10 animate-float" style={{ animationDelay: "-3s" }} />
          <div className="floating-gradient h-64 w-64 bg-zinc-400 dark:bg-zinc-600 top-1/2 left-1/2 animate-float" style={{ animationDelay: "-5s" }} />
        </motion.div>
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 px-4 py-1.5 text-xs font-medium">
              <Sparkles className="h-3 w-3" />
              AI-Powered Financial Intelligence for Freelancers
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              Stop Guessing Your{" "}
              <span className="gradient-text">Freelance Pricing</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
              Make data-driven decisions with AI-powered calculators for rates, fees, ROI, and taxes.
              Built for freelancers, consultants, and agencies who want to maximize their earnings.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="xl" className="w-full sm:w-auto gap-2">
                  Get Started Now <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#calculators">
                <Button size="xl" variant="outline" className="w-full sm:w-auto">
                  Try Rate Calculator Free
                </Button>
              </Link>
            </div>
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-zinc-500 dark:text-zinc-500">
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> Free tools</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-500" /> 14-day pro trial</span>
            </div>
          </motion.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-6 w-6 text-zinc-400" />
        </div>
      </section>

      {/* Social Proof */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-y border-zinc-200 dark:border-zinc-800 py-12"
      >
        <div className="mx-auto max-w-7xl px-6">
          <p className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-zinc-500">
            Trusted by freelancers and agencies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["50K+ Users", "10K+ Agencies", "150+ Countries", "4.9/5 Rating"].map((stat) => (
              <div key={stat} className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-zinc-900 text-zinc-900 dark:fill-zinc-50 dark:text-zinc-50" />
                <span className="text-sm font-semibold">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Everything You Need
            </motion.h2>
            <motion.h3 variants={fadeUp} className="mb-4 text-4xl font-bold sm:text-5xl">
              Your Financial Command Center
            </motion.h3>
            <motion.p variants={fadeUp} className="mx-auto mb-16 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              From calculating your ideal hourly rate to estimating taxes, MounaPro has every tool you need to run a profitable freelance business.
            </motion.p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Calculator,
                title: "Rate Calculator",
                desc: "Find your ideal hourly rate based on income goals, expenses, and market rates. No more underpricing.",
              },
              {
                icon: DollarSign,
                title: "Fee Calculator",
                desc: "Know exactly what you'll earn after platform fees, processing fees, and currency conversion.",
              },
              {
                icon: Target,
                title: "ROI Calculator",
                desc: "Evaluate contracts before you accept them. Calculate effective hourly rate and risk score.",
              },
              {
                icon: Shield,
                title: "Tax Estimator",
                desc: "Estimate your federal taxes, self-employment tax, and know exactly how much to set aside each month.",
              },
              {
                icon: LineChart,
                title: "Income Forecast",
                desc: "Project your income for the next 12 months based on historical data and booked projects.",
              },
              {
                icon: BarChart3,
                title: "Proposal Pricing",
                desc: "Generate data-driven project proposals with confidence. Win more bids with smart pricing.",
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
                className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 transition-all duration-300 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="mb-2 text-lg font-semibold">{feature.title}</h4>
                <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Overview Section */}
      <section id="calculators" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Smart Calculators
            </motion.h2>
            <motion.h3 variants={fadeUp} className="mb-4 text-4xl font-bold sm:text-5xl">
              Real Numbers, Real Confidence
            </motion.h3>
            <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Here is how Sarah, a freelance designer, used our freelancer income calculator to stop guessing and start earning what she is worth.
            </motion.p>
          </motion.div>
          <div className="grid gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="floating-gradient h-48 w-48 bg-zinc-900 dark:bg-zinc-50 top-0 -left-10 opacity-10" />
              <div className="relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 shadow-xl">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
                    <Calculator className="h-5 w-5 text-white dark:text-zinc-900" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Freelancer Income Calculator</h4>
                    <p className="text-xs text-zinc-500">See how it works</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm">
                    <span className="text-zinc-500">Yearly Income Goal</span>
                    <span className="font-mono font-medium">$100,000</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm">
                    <span className="text-zinc-500">Monthly Expenses</span>
                    <span className="font-mono font-medium">$2,000</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm">
                    <span className="text-zinc-500">Billable Hours/Week</span>
                    <span className="font-mono font-medium">25</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Recommended Rate</span>
                    <span className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400">$97/hr</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >
              <h4 className="mb-4 text-2xl font-bold">Sarah&apos;s Story</h4>
              <p className="mb-4 leading-relaxed text-zinc-600 dark:text-zinc-400">
                &ldquo;I was charging $35/hr for UI design work, barely covering my bills. After using
                the MounaPro rate calculator, I realized I needed to charge $97/hr to hit my
                $100K goal. I updated my proposal pricing and landed my next client at $95/hr.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-sm font-bold">S</div>
                <div>
                  <p className="text-sm font-medium">Sarah Chen</p>
                  <p className="text-xs text-zinc-500">Freelance UI/UX Designer</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Financial Insights */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Financial Insights
            </motion.h2>
            <motion.h3 variants={fadeUp} className="mb-4 text-4xl font-bold sm:text-5xl">
              Data-Driven Decisions
            </motion.h3>
            <motion.p variants={fadeUp} className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Understand your freelance business finances at a glance with powerful visualizations.
            </motion.p>
          </motion.div>
          <div className="grid gap-8 lg:grid-cols-3">
            {[
              { value: "73%", label: "of freelancers underprice their services", icon: TrendingUp },
              { value: "$47K", label: "average annual income left on the table", icon: DollarSign },
              { value: "3.2x", label: "more revenue with data-driven pricing", icon: BarChart3 },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8 text-center"
              >
                <stat.icon className="mx-auto mb-4 h-8 w-8 text-zinc-900 dark:text-zinc-50" />
                <p className="mb-2 text-4xl font-bold">{stat.value}</p>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Pricing Plans
            </motion.h2>
            <motion.h3 variants={fadeUp} className="mb-4 text-4xl font-bold sm:text-5xl">
              Start Free, Scale as You Grow
            </motion.h3>
          </motion.div>
          <div className="grid gap-8 lg:grid-cols-3 mx-auto max-w-5xl">
            {[
              {
                name: "Free",
                price: "$0",
                desc: "Perfect for getting started",
                features: ["Rate Calculator", "Fee Calculator", "3 saved reports", "Basic insights"],
                cta: "Get Started Free",
                popular: false,
              },
              {
                name: "Pro",
                price: "$19",
                period: "/month",
                desc: "For serious freelancers",
                features: [
                  "All calculators",
                  "Unlimited saved reports",
                  "Income forecasting",
                  "Proposal pricing",
                  "Priority support",
                  "Export to PDF/CSV",
                ],
                cta: "Start 14-Day Free Trial",
                popular: true,
              },
              {
                name: "Enterprise",
                price: "$49",
                period: "/month",
                desc: "For agencies & teams",
                features: [
                  "Everything in Pro",
                  "Team accounts (up to 5)",
                  "API access",
                  "Custom branding",
                  "Dedicated account manager",
                  "White-label reports",
                ],
                cta: "Contact Sales",
                popular: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -8 }}
                className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-zinc-900 dark:border-zinc-50 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 shadow-2xl scale-105"
                    : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-1 text-xs font-medium text-white dark:text-zinc-900">
                    Most Popular
                  </div>
                )}
                <h4 className="mb-1 text-xl font-bold">{plan.name}</h4>
                <div className="mb-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-sm opacity-70">{plan.period}</span>}
                </div>
                <p className={`mb-6 text-sm ${plan.popular ? "text-zinc-300 dark:text-zinc-600" : "text-zinc-500"}`}>
                  {plan.desc}
                </p>
                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 ${plan.popular ? "text-emerald-300 dark:text-emerald-600" : "text-emerald-500"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "secondary" : "outline"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-16 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
              Testimonials
            </motion.h2>
            <motion.h3 variants={fadeUp} className="mb-4 text-4xl font-bold sm:text-5xl">
              Loved by Freelancers Everywhere
            </motion.h3>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Marcus J.",
                role: "Freelance Developer",
                content:
                  "The ROI calculator alone saved me from accepting a money-losing contract. I now evaluate every project before saying yes.",
              },
              {
                name: "Priya K.",
                role: "Independent Consultant",
                content:
                  "I was setting aside way too little for taxes. The tax estimator showed me I needed to save 32% more each month. Lifesaver.",
              },
              {
                name: "Alex R.",
                role: "Creative Agency Owner",
                content:
                  "We use the proposal pricing tool for every client pitch. Our win rate went up 40% since we started using data-driven pricing.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-8"
              >
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-zinc-900 text-zinc-900 dark:fill-zinc-50 dark:text-zinc-50" />
                  ))}
                </div>
                <p className="mb-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">&ldquo;{t.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-800 text-xs font-bold">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 sm:py-32 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="mb-12 text-center"
          >
            <motion.h2 variants={fadeUp} className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
              FAQ
            </motion.h2>
            <motion.h3 variants={fadeUp} className="text-4xl font-bold sm:text-5xl">
              Got Questions?
            </motion.h3>
          </motion.div>
          <div className="space-y-3">
            {[
              { q: "Is MounaPro really free to use?", a: "Yes! Our basic calculators and tools are completely free. The Pro plan adds unlimited reports, forecasting, and premium features with a 14-day free trial." },
              { q: "How accurate is the freelancer income calculator?", a: "The rate calculator uses your actual financial data and market rates. For best results, input your real expenses and income goals. It is as accurate as the data you provide." },
              { q: "Can I use it for my agency team?", a: "Absolutely. The Enterprise plan supports up to 5 team members with shared reports, white-labeling, and a dedicated account manager." },
              { q: "Is my financial data secure?", a: "We use bank-level encryption (AES-256) for all data. Your financial information is never shared with third parties. We are SOC 2 compliant." },
              { q: "Do you support international freelancers?", a: "Yes! While our tax estimator focuses on US federal taxes, our rate, fee, and ROI calculators work for any currency and country. The fee calculator specifically supports USA and Canada platforms." },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left font-medium transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 transition-transform ${faqOpen === i ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {faqOpen === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="floating-gradient h-96 w-96 bg-zinc-900 dark:bg-zinc-50 top-0 right-0 opacity-5" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-6 text-4xl font-bold sm:text-5xl">
              Ready to Stop Guessing?
            </h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-zinc-600 dark:text-zinc-400">
              Join 50,000+ freelancers who use MounaPro to make data-driven financial decisions.
              Start your free account today.
            </p>
            <Link href="/signup">
              <Button size="xl" className="gap-2">
                Get Started Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-xs text-zinc-500">No credit card required • 14-day Pro trial</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-50">
                <TrendingUp className="h-4 w-4 text-white dark:text-zinc-900" />
              </div>
              <span className="text-sm font-bold">MounaPro</span>
            </div>
            <div className="flex gap-6 text-sm text-zinc-500">
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Privacy Policy</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Terms of Service</Link>
              <Link href="#" className="hover:text-zinc-900 dark:hover:text-zinc-50">Contact</Link>
            </div>
            <p className="text-xs text-zinc-400">&copy; 2026 MounaPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
