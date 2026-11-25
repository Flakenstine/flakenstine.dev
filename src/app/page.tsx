import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { NowLine } from "@/components/discord-presence";
import { GlyphStage } from "@/components/glyph-stage";
import { JsonLd } from "@/components/json-ld";
import { LitText } from "@/components/lit-text";
import { Page } from "@/components/page";
import { SocialLinks } from "@/components/social-links";
import { Strand } from "@/components/strand";
import { ToolPad } from "@/components/tool-pad";
import { Typed } from "@/components/typed";
import { site } from "@/lib/site";
import head from "../../public/images/flak-head.png";

export default function Home() {
  return (
    <Page>
      <JsonLd
        data={{
          "@type": "WebSite",
          name: site.name,
          description: site.description,
          url: site.url,
          author: {
            "@type": "Person",
            name: site.author,
            alternateName: site.handle,
          },
        }}
      />

      <section className="hero">
        <GlyphStage
          source={{ image: head.src }}
          label="Shock the head. Press and hold for a bigger one."
          hint="press and hold"
          className="hero-head"
        >
          <Image src={head} alt="" preload className="size-full" />
        </GlyphStage>
        <div className="hero-text">
          <h1 className="font-mono text-base font-bold text-phosphor sm:text-xl">
            <Typed text="Hi there. I am Flakenstine." />
          </h1>
          <p className="hero-title">
            I like to make
            <br />
            cool <span className="text-phosphor">websites</span>.
          </p>
          <NowLine />
        </div>
      </section>

      <Strand note={196} />

      <section aria-label="About" className="section max-w-2xl space-y-8 text-center font-mono leading-relaxed md:text-xl md:leading-relaxed">
        <LitText>
          The web is my playground; Since high-school I have been playing around
          with various web technologies and systems, my favorite thing is to
          build really cool websites like this one!
        </LitText>
        <LitText>
          I love to challenge myself to build scalable and responsive websites. I
          have also started to dive into basic design using tools such as Figma.
        </LitText>
        <LitText>
          Outside of the web-space, I love technology (especially anything with
          an Apple on it), fantasy, video games, music, and various other forms
          of art. If I&apos;m not tinkering on the web, You&apos;ll usually find
          me roaming around the digital landscape known as World of Warcraft. I
          am not very good at it, but from time to time I will also ramble on my
          blogs posted to this site.
        </LitText>
      </section>

      <section aria-labelledby="tools" className="section max-w-3xl text-center">
        <h2 id="tools" className="section-title">
          tools I like to use
        </h2>
        <ToolPad />
        <p className="mt-6 text-sm text-muted">and more...</p>
      </section>

      <Strand note={164.81} />

      <section id="chat" aria-labelledby="chat-title" className="section max-w-xl scroll-mt-4 text-center">
        <h2 id="chat-title" className="section-title">
          let&apos;s chat
        </h2>
        <ContactForm />
        <div className="my-8 flex items-center justify-center gap-4 text-muted">
          <span className="h-px w-1/4 bg-line" />
          or
          <span className="h-px w-1/4 bg-line" />
        </div>
        <SocialLinks />
      </section>
    </Page>
  );
}
