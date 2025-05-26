"use client";

import { Pricing } from "@/components/pricing";

const demoPlans = [
  {
    name: "STARTER",
    price: "499",
    yearlyPrice: "299",
    period: "per month",
    features: [
      "3 AI-generated resumes per month",
      "5 AI cover letters per month",
      "Basic interview practice (15 minutes)",
      "Industry insights dashboard",
      "Standard resume templates",
      "Email support",
      "PDF download",
    ],
    description: "Perfect for job seekers starting their career journey",
    buttonText: "Start Free Trial",
    href: "/sign-up",
    isPopular: false,
  },
  {
    name: "PROFESSIONAL",
    price: "699",
    yearlyPrice: "499",
    period: "per month",
    features: [
      "Unlimited AI resume building",
      "Unlimited AI cover letters",
      "Advanced interview practice (60 minutes/month)",
      "Real-time interview feedback",
      "Advanced industry analytics",
      "Premium resume templates",
      "ATS optimization",
      "Priority support",
      "LinkedIn profile optimization",
    ],
    description: "Ideal for active job seekers and career changers",
    buttonText: "Get Started",
    href: "/sign-up",
    isPopular: true,
  },
  {
    name: "ENTERPRISE",
    price: "799",
    yearlyPrice: "629",
    period: "per month",
    features: [
      "Everything in Professional",
      "Unlimited interview practice",
      "Custom industry insights",
      "Dedicated career coach support",
      "Team collaboration features",
      "Bulk resume generation",
      "API access for integrations",
      "Advanced analytics dashboard",
      "Custom branding",
      "SLA agreement",
    ],
    description: "For HR teams and career coaching organizations",
    buttonText: "Contact Sales",
    href: "/contact",
    isPopular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Pricing
        plans={demoPlans}
        title="Simple, Transparent Pricing"
        description="Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
      />
    </div>
  );
}