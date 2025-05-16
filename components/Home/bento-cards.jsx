"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import {
  IconBoxAlignRightFilled,
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

export function BentoGridThirdDemo() {
  return (
    <BentoGrid className="max-w-4xl mx-auto md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={cn("[&>p:text-lg]", item.className)}
          icon={item.icon} />
      ))}
    </BentoGrid>
  );
}

const SkeletonOne = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black">
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black">
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black">
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variants = {
    initial: {
      width: 0,
    },
    animate: {
      width: "100%",
      transition: {
        duration: 0.4,
      },
    },
    hover: {
      width: ["0%", "100%"],
      transition: {
        duration: 1.5,
      },
    },
  };
  // Create fixed widths to prevent hydration mismatch
  const fixedWidths = [85, 75, 65, 90, 70, 80];
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      {arr.map((_, i) => (
        <motion.div
          key={"skeleton-two-" + i}
          variants={variants}
          style={{
            maxWidth: `${fixedWidths[i]}%`,
          }}
          className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-neutral-100 dark:bg-black w-full h-4"></motion.div>
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] rounded-lg bg-dot-black/[0.2] flex-col space-y-2"
      style={{
        background:
          "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
      }}>
      <motion.div className="h-full w-full rounded-lg"></motion.div>
    </motion.div>
  );
};

const SkeletonFour = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
return (
  <motion.div
    initial="initial"
    animate="animate"
    whileHover="hover"
    className="flex flex-1 w-full h-full min-h-[8rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
  >
    {/* Testimonial 1: Real-Time Interview Experience */}
    <motion.div
      variants={first}
      className="h-full w-1/3 rounded-2xl bg-white p-6 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
    >
      <img
        src="/profiles/man.png"
        alt="User Avatar"
        height="120"
        width="120"
        className="rounded-full h-12 w-12"
      />
      <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
        The real-time interview felt just like the real thing with Gemini’s voice!
      </p>
      <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
        Realistic
      </p>
    </motion.div>

    {/* Testimonial 2: Real-Time Interview Feedback */}
    <motion.div
      className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-6 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
    >
      <img
        src="/profiles/man(1).png"
        alt="User Avatar"
        height="120"
        width="120"
        className="rounded-full h-12 w-12"
      />
      <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
        Got instant feedback during the real-time session—super helpful!
      </p>
      <p className="border border-blue-500 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs rounded-full px-2 py-0.5 mt-4">
        Insightful
      </p>
    </motion.div>

    {/* Testimonial 3: Real-Time Interview Practice */}
    <motion.div
      variants={second}
      className="h-full w-1/3 rounded-2xl bg-white p-6 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
    >
      <img
        src="/profiles/profile.png"
        alt="User Avatar"
        height="120"
        width="120"
        className="rounded-full h-12 w-12"
      />
      <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
        Practicing in real-time with Gemini voice boosted your confidence.
      </p>
      <p className="border border-purple-500 bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-xs rounded-full px-2 py-0.5 mt-4">
        Confident
      </p>
    </motion.div>
  </motion.div>
);
};

const SkeletonFive = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2">
      <motion.div
        variants={variants}
        className="flex flex-row rounded-2xl border border-neutral-100 dark:border-white/[0.2] p-2  items-start space-x-2 bg-white dark:bg-black">
        <img
          src="/profiles/bussiness-man.png"
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10" />
        <p className="text-xs text-neutral-500">
          There are a lot of cool framerworks out there like React, Angular,
          Vue, Svelte that can make your life ....
        </p>
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center justify-end space-x-2 w-3/4 ml-auto bg-white dark:bg-black">
        <p className="text-xs text-neutral-500">Use NextJS.</p>
        <div
          className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 shrink-0" />
      </motion.div>
    </motion.div>
  );
};

const items = [
  {
    title: "AI Cover Letter Writer",
    description: (
      <span className="text-sm">
        Generate personalized cover letters tailored to your job applications with AI.
      </span>
    ),
    header: <SkeletonOne />,
    className: "md:col-span-1",
    icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Mock Interview Practice",
    description: (
      <span className="text-sm">
        Practice interview questions and receive AI-powered feedback to improve.
      </span>
    ),
    header: <SkeletonTwo />,
    className: "md:col-span-1",
    icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Performance Analytics",
    description: (
      <span className="text-sm">
        Track your progress with detailed analytics from your mock interviews.
      </span>
    ),
    header: <SkeletonThree />,
    className: "md:col-span-1",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Real-Time AI Interview",
    description: (
      <span className="text-sm">
        Engage in realistic interview simulations using the Gemini voice module.
      </span>
    ),
    header: <SkeletonFour />,
    className: "md:col-span-2",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Top Company's Interview Questions",
    description: (
      <span className="text-sm">
        Access a library of AI-generated interview questions tailored to your industry.
      </span>
    ),
    header: <SkeletonFive />,
    className: "md:col-span-1",
    icon: <IconBoxAlignRightFilled className="h-4 w-4 text-neutral-500" />,
  },
];