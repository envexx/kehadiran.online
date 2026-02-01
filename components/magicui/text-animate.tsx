"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

type AnimationType =
  | "blurInUp"
  | "blurInDown"
  | "blurIn"
  | "fadeIn"
  | "slideInUp"
  | "slideInDown";

type TextAnimateProps = {
  children: string;
  animation?: AnimationType;
  by?: "character" | "word";
  once?: boolean;
  className?: string;
};

const animationVariants: Record<AnimationType, Variants> = {
  blurInUp: {
    hidden: { opacity: 0, filter: "blur(10px)", y: 20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  blurInDown: {
    hidden: { opacity: 0, filter: "blur(10px)", y: -20 },
    visible: { opacity: 1, filter: "blur(0px)", y: 0 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(10px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  },
  slideInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  },
};

export function TextAnimate({
  children,
  animation = "blurInUp",
  by = "word",
  once = true,
  className = "",
}: TextAnimateProps) {
  const items = by === "character" ? children.split("") : children.split(" ");
  const variants = animationVariants[animation];

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: by === "character" ? 0.03 : 0.1,
      },
    },
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={container}
      style={{ display: "inline-block" }}
    >
      {items.map((item, index) => (
        <motion.span
          key={index}
          variants={variants}
          style={{ 
            display: "inline-block",
            marginRight: by === "character" && item !== " " ? "0" : "0"
          }}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.4, 0.25, 1],
          }}
        >
          {item === " " ? "\u00A0" : item}
          {by === "word" && index < items.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}

