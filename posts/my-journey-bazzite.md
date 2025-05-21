---
title: My Journey to Bazzite - Making the Switch from Windows to Linux
date: 2025-05-21
description: Sharing my personal experience moving from years of Windows use to embracing Bazzite Linux as my daily driver.
image: "/blog/journey-to-linux.png"
tags:
  - linux
  - bazzite
  - fedora
  - windows
  - switch
  - gaming
  - personal
  - gnome
---

## The Long Haul with Windows

For as long as I can remember, my primary computing experience has been on Windows. From the days of **Windows XP, Vista, 7, 8, 8.1, and 10 through to Windows 11**, it was the default, the standard, the operating system everyone used. It did what I needed it to do – browse the web, handle productivity tasks, and, crucially, play games.

However, over the past few years, I started feeling a growing dissatisfaction. Bloat, forced updates at inconvenient times, increasing privacy concerns, and a general feeling of less control over my own machine began to gnaw at me. I'd tinkered with Linux in the past, usually in virtual machines or on older hardware, but the idea of making it my *daily driver* felt daunting. Compatibility issues, especially with gaming and the specific software I relied on, seemed like insurmountable hurdles.

Still, the seed was planted. The increasing popularity of the Steam Deck, running SteamOS (a form of Linux), showed that Linux gaming was becoming not just viable, but genuinely good. The ecosystem had clearly matured.

## Why Bazzite? Diving into the World of Immutable Linux

When I finally decided to take the plunge, the first big question was: Which distribution? There are *so many* Linux distributions (distros) out there, each with its own philosophy and focus. Ubuntu, Fedora, Mint, Arch, Debian... the list goes on.

My research kept leading me back to a concept that was new to me: Immutable operating systems. Unlike traditional Linux distros where you can modify the base system files directly, immutable distros treat the core OS like a read-only image. You install applications separately, often in containers or using technologies like Flatpak. Updates are applied atomically, meaning they either succeed completely or revert cleanly, drastically reducing the chance of breaking your system.

This approach appealed to my desire for stability and reliability. And among the leading immutable options built on Fedora's rock-solid base, the UBlue project, and specifically **Bazzite**, stood out.

Bazzite markets itself as a game-focused desktop operating system. It comes pre-configured with many of the tools gamers on Linux need: the latest graphics drivers, Steam (with Proton pre-configured), Lutris, Bottles, and essential codecs. It also offers different versions optimized for AMD, NVIDIA, and even the Steam Deck, featuring different desktop environments like KDE Plasma and GNOME. This seemed like the perfect entry point for someone like me, coming from Windows with gaming as a major use case.

## The Migration: Taking the Leap

Preparing for the switch involved backing up everything important (a crucial step for *any* major OS change!). The installation process itself was surprisingly straightforward. I downloaded the Bazzite ISO, created a bootable USB drive, and followed the graphical installer. It detected my hardware, an **Intel based PC with an Intel Core i9-9900K CPU, 32GB of DDR4 RAM, and an AMD Radeon RX 7800 XT GPU**, without a hitch, which was a huge relief.

The first boot into Bazzite was exciting. I had specifically chosen the **GNOME** version of Bazzite. It looked clean, modern, and felt immediately responsive. Based on Fedora's Kinoite/Silverblue immutable tech, Bazzite offers different desktop environments, and for me, GNOME provided a clean, focused interface that felt intuitive right away.

## Living with Bazzite: The Daily Driver Experience

It's been **3 months** since I made the switch, and I can confidently say it was the right decision.

**Performance:** The system feels incredibly snappy. Boot times are fast, applications launch quickly, and overall responsiveness is excellent.

**Software:** This was my biggest concern. How would I run the apps I needed?
*   **Gaming:** As advertised, Bazzite shines here. Steam works flawlessly with Proton, allowing me to play a vast majority of my Windows library ([Mention a few specific games that worked well, e.g., Cyberpunk 2077, Baldur's Gate 3]). Lutris and Bottles handle other launchers (like Epic Games Store, GOG) and non-Steam games remarkably well. There were a few minor tweaks needed for some games, but the community documentation is fantastic.
*   **Productivity:** Applications like my new favorite browser, **Zen**, along with **Blender**, **Cursor**, **1Password**, and many more were readily available as Flatpaks. Flatpak is a game-changer for immutable distros, providing a sandboxed environment for applications that just works. I found alternatives for almost everything I used on Windows, and in some cases, the Linux native options felt even better.
*   **Specific Software:** My niche software like **Cider (an Apple Music client)** required some tinkering to get working, ultimately I found the **AppImage** version to be the solution. `[Mention any *other* specific software that was challenging or surprisingly easy to get working, e.g., Adobe Creative Suite alternatives, a specific engineering tool]`. This required some searching and experimentation, but I eventually found solutions or acceptable alternatives.

**Stability & Updates:** This is where the immutable nature of Bazzite really pays off. Updates are handled in the background and applied on reboot. If an update has an issue, you can easily roll back to the previous working version. This peace of mind is something I never had with Windows updates. Installing new software or system packages via `rpm-ostree` or layering also feels robust.

**Customization:** Linux is renowned for its flexibility, and the GNOME desktop environment, while sometimes seen as less customizable than KDE Plasma, offers a clean, focused workflow that I appreciate. I've been able to use extensions to tweak things to my liking.

## Challenges Along the Way

It hasn't been entirely without its bumps.
*   The most notable hardware challenge I faced involved my **XLR Microphone setup (the Rode PodMic powered by the Focusrite Scarlett Mini)**. It suddenly stopped working properly, specifically in applications like **Discord**. I spent a good deal of time searching online for solutions, troubleshooting drivers and settings. Much to my surprise, the fix was incredibly simple: I just needed to run the system update tool and apply the latest OS updates. Once the machine restarted, my microphone worked perfectly as expected. This was a great reminder that sometimes the simplest solution is the correct one, and keeping the system up-to-date is crucial, even on an immutable distro like Bazzite.
*   The tinkering required to get some specific applications like **Cider** working initially.
*   Understanding the immutable workflow (like layering vs. Flatpaks) took a little getting used to compared to traditional package managers.
*   Sometimes finding the "Linux way" of doing something familiar from Windows required a quick search.

These challenges were minor roadblocks, not showstoppers, and the thriving Linux community was always a helpful resource.

## The Verdict: Was It Worth It?

Absolutely. Switching to Bazzite Linux has revitalized my computing experience. It's stable, fast, customizable, and gives me the control over my machine that I felt I had lost. Gaming performance is excellent, often on par with, and sometimes even better than, Windows on the same hardware, and the software situation is far better than I anticipated thanks to Flatpaks and compatibility layers like Proton.

If you're a long-time Windows user feeling curious about Linux, especially if gaming or system stability is important to you, I highly recommend giving Bazzite a look. It provides a fantastic, opinionated starting point that removes many of the initial hurdles of getting into the Linux desktop world, and you have the choice of excellent desktop environments like GNOME or KDE Plasma.

The journey isn't over – there's always more to learn and optimize – but I'm excited to continue exploring everything Bazzite and the wider Linux ecosystem have to offer.

---
