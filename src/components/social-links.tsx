import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip";
import { BrandIcon } from "@/components/brand-icon";
import { button } from "@/components/ui/button";
import { socials } from "@/data/brands";

export function SocialLinks() {
  return (
    <ul className="flex justify-center gap-3">
      {socials.map((social) => (
        <li key={social.name}>
          <Tooltip>
            <TooltipTrigger
              render={
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              aria-label={`${social.name}, ${social.handle}`}
              className={button("solid", "w-12 px-0")}
            >
              <BrandIcon icon={social.icon} className="size-4.5" />
            </TooltipTrigger>
            <TooltipContent sideOffset={8} className="popup px-2.5 py-1.5 font-mono text-xs">
              {social.handle}
            </TooltipContent>
          </Tooltip>
        </li>
      ))}
    </ul>
  );
}
