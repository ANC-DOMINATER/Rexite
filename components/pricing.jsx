"use client";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import { useState, useRef } from "react";
import confetti from "canvas-confetti";
import NumberFlow from "@number-flow/react";

export function Pricing({
  plans,
  title = "Simple, Transparent Pricing",
  description = "Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
}) {
  const [isMonthly, setIsMonthly] = useState(true);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const switchRef = useRef(null);

  const handleToggle = (checked) => {
    setIsMonthly(!checked);
    if (checked && switchRef.current) {
      const rect = switchRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      confetti({
        particleCount: 50,
        spread: 60,
        origin: {
          x: x / window.innerWidth,
          y: y / window.innerHeight,
        },
        colors: [
          "hsl(var(--primary))",
          "hsl(var(--accent))",
          "hsl(var(--secondary))",
          "hsl(var(--muted))",
        ],
        ticks: 200,
        gravity: 1.2,
        decay: 0.94,
        startVelocity: 30,
        shapes: ["circle"],
      });
    }
  };
  return (
    <div className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h2>
          <p className="text-muted-foreground text-lg whitespace-pre-line">
            {description}
          </p>
        </div>

        <div className="flex justify-center items-center gap-3 mb-10">
          <span className="text-sm font-medium text-muted-foreground">
            Monthly
          </span>
          <Switch
            ref={switchRef}
            checked={!isMonthly}
            onCheckedChange={handleToggle}
            className="relative"
          />
          <span className="text-sm font-medium">
            Annual <span className="text-primary font-semibold">(Save 20%)</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className={cn(
                "rounded-2xl border p-6 bg-card text-center relative flex flex-col h-full",
                plan.isPopular
                  ? "border-primary border-2 shadow-lg scale-105"
                  : "border-border hover:border-primary/50 transition-colors"
              )}
            >            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground py-1 px-4 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="h-3 w-3 fill-current" />
                <span>Most Popular</span>
              </div>
            )}            <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-lg font-semibold text-foreground mb-2">
                    {plan.name}
                  </p>

                  <div className="mb-4">                    <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold tracking-tight text-foreground">
                      <NumberFlow
                        value={
                          isMonthly ? Number(plan.price) : Number(plan.yearlyPrice)
                        }
                        format={{
                          style: "currency",
                          currency: "INR",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }}
                        formatter={(value) => `₹${value}`}
                        transformTiming={{
                          duration: 500,
                          easing: "ease-out",
                        }}
                        willChange
                        className="tabular-nums"
                      />
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isMonthly ? "billed monthly" : "billed annually"}
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground mb-6">
                    {plan.description}
                  </p>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-left">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={plan.href}
                  className={cn(
                    buttonVariants({
                      variant: plan.isPopular ? "default" : "outline",
                    }),
                    "w-full font-semibold transition-all duration-200",
                    plan.isPopular
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-primary hover:text-primary-foreground"
                  )}
                >
                  {plan.buttonText}              </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
