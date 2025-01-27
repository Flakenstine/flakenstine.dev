import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/contact-form";
import Tools from "@/components/tools";
import PageTransition from "@/components/page-transition";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function HomePage() {
  return (
    <PageTransition>
      <main className="flex min-h-screen flex-col items-center">
        {/* Main Content */}
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
          {/* Logo Section */}
          <div className="relative mb-4 flex h-64 w-64 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#00FF9D] opacity-20 blur-3xl" />
            <Image
              src="/flak-logo.png"
              alt="Flakenstine Logo"
              width={512}
              height={512}
              className="glow-effect relative z-10"
              priority
            />
          </div>

          {/* Introduction */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold md:text-5xl">
              <span className="text-[#00FF9D]">Hi there. I am</span>{" "}
              <span className="text-[#E1F8D4]">Flakenstine.</span>
            </h1>
            <p className="text-1xl font-bold text-[#E1F8D4] md:py-10 md:text-5xl">
              I like to make
              <br />
              cool <span className="text-[#00FF9D]">websites</span>.
            </p>
          </div>

          {/* About Text */}
          <div className="max-w-2xl space-y-6 text-center text-gray-400 transition-all duration-300 md:text-xl">
            <p>
              The web is my playground; Since high-school I have been playing
              around with various web technologies and systems, my favorite
              thing is to build really cool websites like this one!
            </p>
            <p>
              I love to challenge myself to build scale-able and responsive
              websites. I have also started to dive in to basic design using
              tools such as figma.
            </p>
            <p>
              Outside of the web-space, I love technology (especially anything
              with an Apple on it), fantasy, video games, music, and various
              other forms of art. If I&apos;m not tinkering on the web,
              You&apos;ll usually find me roaming around the digital landscape
              known as World of Warcraft. I am not very good at it, but from
              time to time I will also ramble on my blogs posted to this site.
            </p>
          </div>

          {/* Tools Section */}
          <div className="space-y-4">
            <h2 className="text-xl">tools I like to use</h2>
            <div className="flex justify-center gap-4">
              <Tools />
              {/* Add your tool icons here */}
            </div>
            <p className="text-sm text-gray-400">and more...</p>
          </div>

          {/* Contact Form */}
          <div className="w-full max-w-md space-y-4">
            <h2 className="text-xl">let&apos;s chat</h2>
            <ContactForm />

            <div className="text-center">
              <div className="flex w-full items-center justify-center gap-3">
                <Separator className="w-1/4" />
                <p className="my-4">or</p>
                <Separator className="w-1/4" />
              </div>
              <div className="flex justify-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 hover:text-black"
                      >
                        <Link
                          href="https://x.com/Flakenstine"
                          className="text-[#00FF9D]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>X</title>
                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                          </svg>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">@flakenstine</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 hover:text-black"
                      >
                        <Link
                          href="https://discordapp.com/users/129471053717176320"
                          className="text-[#00FF9D]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Discord</title>
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                          </svg>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">@flakenstine</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 hover:text-black"
                      >
                        <Link
                          href="https://www.instagram.com/flakenstine/"
                          className="text-[#00FF9D]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>Instagram</title>
                            <path d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077" />
                          </svg>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">@flakenstine</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        size="sm"
                        asChild
                        className="bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 hover:text-black"
                      >
                        <Link
                          href="https://www.linkedin.com/in/isaac-goodwin-03827b124/"
                          className="text-[#00FF9D]"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="100"
                            height="100"
                            viewBox="0 0 50 50"
                          >
                            <path d="M41,4H9C6.24,4,4,6.24,4,9v32c0,2.76,2.24,5,5,5h32c2.76,0,5-2.24,5-5V9C46,6.24,43.76,4,41,4z M17,20v19h-6V20H17z M11,14.47c0-1.4,1.2-2.47,3-2.47s2.93,1.07,3,2.47c0,1.4-1.12,2.53-3,2.53C12.2,17,11,15.87,11,14.47z M39,39h-6c0,0,0-9.26,0-10 c0-2-1-4-3.5-4.04h-0.08C27,24.96,26,27.02,26,29c0,0.91,0,10,0,10h-6V20h6v2.56c0,0,1.93-2.56,5.81-2.56 c3.97,0,7.19,2.73,7.19,8.26V39z"></path>
                          </svg>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">@isaacgoodwin</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Button
                        variant="default"
                        size="sm"
                        className="bg-[#00FF9D] text-black hover:bg-[#00FF9D]/90 hover:text-black"
                        asChild
                      >
                        <Link
                          href="https://github.com/flakenstine"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#00FF9D]"
                        >
                          <svg
                            role="img"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <title>GitHub</title>
                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                          </svg>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-mono">@flakenstine</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
