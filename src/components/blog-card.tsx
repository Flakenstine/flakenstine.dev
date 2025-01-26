"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

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
      className="rounded-lg bg-gray-800 p-4 shadow-md"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={`/blog/${slug}`}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="rounded-lg object-cover"
          />
        </div>
        <CardFooter>
          <p className="text-sm text-gray-400">{date.toString()}</p>
          {/* <Link href={`/blog/${slug}`} className="text-[#00FF9D] hover:underline">
          Read More
        </Link> */}
        </CardFooter>
      </Link>
    </motion.div>
  );
}
