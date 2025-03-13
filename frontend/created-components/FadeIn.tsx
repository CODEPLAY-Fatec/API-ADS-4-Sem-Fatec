"use client";
import { motion } from "framer-motion";
import React from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1, ease: "easeInOut", delay }}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
