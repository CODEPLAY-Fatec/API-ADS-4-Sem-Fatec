"use client";
import { motion } from "framer-motion";
import React from "react";

interface EmergeInProps {
  children: React.ReactNode;
  delay?: number;
}

const EmergeIn: React.FC<EmergeInProps> = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}  // Começa invisível
      animate={{ opacity: 1 }}  // Torna-se visível
      transition={{ duration: 0.5, ease: "easeInOut", delay }}  // Duração e delay ajustáveis
    >
      {children}
    </motion.div>
  );
};

export default EmergeIn;