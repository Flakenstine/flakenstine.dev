import { Separator } from "@/components/ui/separator"
import Tools from "@/components/tools"
import TextType from "@/components/ui/text-type"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-dvh w-screen flex items-center justify-center flex-col gap-y-4 p-4">
      <section className="container flex flex-col items-center justify-center gap-12 px-4 py-16 text-center">
        <div className="relative mb-4 flex h-64 w-64 items-center justify-center">
          {/* put logo here */}
        </div>

        {/* Introduction */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold md:text-5xl">
            <TextType text="Hi there. I am Flakenstine." typingSpeed={75} initialDelay={1000} showCursor={true} cursorCharacter="_" />
          </h1>
          <p className="text-1xl font-bold text-[#E1F8D4] md:py-8 md:text-5xl">
            I like to make {" "}
            cool <span className="text-[#00FF9D]">websites.</span>
          </p>
        </div>
        <Separator className="bg-transparent bg-gradient-to-r from-transparent via-[#00FF9D] to-transparent opacity-25 dark:opacity-100 w-full" />

        {/* About */}
        <div className="max-w-2xl space-y-6 text-center text-gray-400 transition-all duration-300 md:text-xl font-mono">
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

        {/* Tools */}
        <div className="space-y-4">
          <h2 className="text-xl">tools I like to use</h2>
          <Tools />
        </div>
      </section>
    </main>
  )
}