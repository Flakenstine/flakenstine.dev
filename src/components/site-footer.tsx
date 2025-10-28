import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { LinkPreview } from "./ui/link-preview";

export function SiteFooter() {
  return (
    <>
      <Separator className="bg-transparent bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent opacity-25 dark:opacity-100" />
      <footer className="py-6 text-center text-sm text-gray-400">
        Powered by{" "}
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="px-1">
              <span className="inline-block align-middle text-[#00FF9D]">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="16"
                  height="16"
                  className="align-middle"
                >
                  <path d="M24 22.525H0l12-21.05 12 21.05z" />
                </svg>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono">Vercel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span className="px-1">+</span> */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="px-1">
              <span className="inline-block align-middle text-[#00FF9D]">
                <svg
                  role="img"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  width="16"
                  height="16"
                  className="align-middle"
                >
                  <path d="M18.665 21.978C16.758 23.255 14.465 24 12 24 5.377 24 0 18.623 0 12S5.377 0 12 0s12 5.377 12 12c0 3.583-1.574 6.801-4.067 9.001L9.219 7.2H7.2v9.596h1.615V9.251l9.85 12.727Zm-3.332-8.533 1.6 2.061V7.2h-1.6v6.245Z" />
                </svg>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-mono">Next.js</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span>
          {" "}
          | Source available on{" "}
          <LinkPreview
            url="https://github.com/flakenstine/flakenstine.dev"
            className="text-[#00FF9D] underline"
          >
            Github
          </LinkPreview>
        </span>
      </footer>
    </>
  );
}
