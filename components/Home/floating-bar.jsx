"use client";
import { FloatingDock } from '@/components/ui/floating-dock';
import { IconHome, IconUser, IconBrandGithub, IconInfoCircle, IconBrandDiscord } from '@tabler/icons-react';
import { Crown, FileText, GraduationCap, LayoutDashboard, PenIcon } from 'lucide-react';

export default function FloatingBar() {
  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: <IconHome className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: "About Developer",
      href: "/about",
      icon: <IconInfoCircle className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: "Resume Builder",
      href: "/resume-builder",
      icon: <FileText className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: "Industry Insights",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: "Cover Letter Writer",
      href: "/ai-cover-letter",
      icon: <PenIcon className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
    {
      title: "Mock Interview Preparation",
      href: "/interview-test-quiz",
      icon: <GraduationCap className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
     {
      title: "Rexite(Alpha)",
      href: "/rexite-ai",
      icon: <Crown className="h-full w-full text-neutral-500 dark:text-neutral-400" />,
    },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50">
      <FloatingDock 
        items={navItems}
        desktopClassName="mx-auto max-w-fit shadow-lg shadow-black/5 dark:shadow-black/20"
        mobileClassName="mx-auto max-w-fit shadow-lg shadow-black/5 dark:shadow-black/20"
      />
    </div>
  );
}