"use client";

import { motion } from "motion/react";
import Link from "next/link";

import {
  MinimalCard,
  MinimalCardDescription,
  MinimalCardFooter,
  MinimalCardImage,
  MinimalCardTitle,
} from "@/components/ui/minimal-card";

interface BlogCardProps {
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
}

export function BlogCard({
  title,
  description,
  image,
  slug,
  date,
}: BlogCardProps) {
  return (
    <motion.div
      className="rounded-lg bg-transparent p-4 shadow-md"
      whileHover={{ scale: 1.05, rotate: -1 }}
      whileTap={{ scale: 0.95, rotate: -1 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={`/blog/${slug}`}>
        <MinimalCard>
          <MinimalCardImage src={image} alt={title} />
          <MinimalCardTitle className="text-gray-800">{title}</MinimalCardTitle>
          <MinimalCardDescription>
            <p>{description}</p>
          </MinimalCardDescription>
          <MinimalCardFooter>
            <p className="text-sm text-gray-400">
              Published on {date.toString()}
            </p>
          </MinimalCardFooter>
        </MinimalCard>
      </Link>
    </motion.div>
  );
}
