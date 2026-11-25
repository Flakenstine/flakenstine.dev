"use client";

import { HoverCard, HoverCardContent, HoverCardTrigger } from "@ui-sdk/react/hover-card";
import { useEffect, useState } from "react";
import { BrandIcon } from "@/components/brand-icon";
import { button } from "@/components/ui/button";
import { discord } from "@/data/brands";
import {
  activityHeading,
  assetUrl,
  avatarUrl,
  formatDuration,
  splitActivities,
  STATUS_COLOR,
  STATUS_LABEL,
  type LanyardActivity,
  type LanyardData,
} from "@/lib/lanyard";
import { usePresence, type Presence } from "@/lib/presence";
import { cn } from "@/lib/utils";

/* Discord and Spotify serve these at the size they are shown. */
/* eslint-disable @next/next/no-img-element */

function statusOf(presence: Presence) {
  if (presence.state === "ready") {
    const status = presence.data.discord_status;
    return { label: STATUS_LABEL[status], dot: STATUS_COLOR[status], status };
  }
  return {
    label: presence.state === "loading" ? "Checking status" : "Status unavailable",
    dot: "bg-[#80848e]",
    status: "offline" as const,
  };
}

/** What is going on right now, in a few words. */
function nowOf(data: LanyardData) {
  if (data.listening_to_spotify && data.spotify) {
    return `listening to ${data.spotify.song} by ${data.spotify.artist}`;
  }
  const { primary } = splitActivities(data.activities);
  if (primary) return `${activityHeading(primary).toLowerCase()} ${primary.name}`;
  return STATUS_LABEL[data.discord_status].toLowerCase();
}

/** Discord's own card, opened from the link to the profile. */
export function DiscordPresence() {
  const presence = usePresence();
  const { label, dot, status } = statusOf(presence);

  return (
    <HoverCard delay={120} closeDelay={160}>
      <HoverCardTrigger
        href={discord.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Discord, ${discord.handle} (${label})`}
        className={button("solid", "h-8 px-3 text-xs")}
      >
        <BrandIcon icon={discord.icon} className="size-4" />
        discord
        <span
          aria-hidden="true"
          className={cn(
            "size-2.5 shrink-0 rounded-full ring-3 ring-black",
            dot,
            status === "online" && "animate-pulse",
          )}
        />
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        sideOffset={10}
        className="popup w-80 overflow-hidden bg-[#111214]"
      >
        <PresenceCard presence={presence} />
      </HoverCardContent>
    </HoverCard>
  );
}

/** A line under the headline: online, and up to something. */
export function NowLine() {
  const presence = usePresence();
  if (presence.state !== "ready") return <p className="h-6" />;
  const { dot } = statusOf(presence);

  return (
    <p className="now-line flex h-6 max-w-full items-center justify-center gap-2.5 font-mono text-sm text-muted">
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dot)} />
      <span className="truncate">{nowOf(presence.data)}</span>
    </p>
  );
}

/** Once a second, so elapsed timers and the Spotify bar stay live. */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);
  return now;
}

function PresenceCard({ presence }: { presence: Presence }) {
  const now = useNow();
  const { state, data } = presence;
  const handle = discord.handle;

  if (state === "loading") {
    return (
      <div className="p-4 font-mono text-sm text-gray-400">
        Checking Discord…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-4 font-mono text-sm text-gray-400">
        Discord status is unavailable right now.
      </div>
    );
  }

  const { custom, primary } = splitActivities(data.activities);
  const avatar = avatarUrl(data.discord_user);
  const name =
    data.discord_user.global_name ??
    data.discord_user.display_name ??
    data.discord_user.username;

  return (
    <div>
      {/* Banner + avatar, mirroring Discord's own profile popout */}
      <div className="h-12 bg-linear-to-r from-phosphor/40 to-phosphor/5" />
      <div className="px-4 pb-4">
        <div className="-mt-8 mb-3 flex items-end gap-3">
          <div className="relative">
            {avatar ? (
              <img
                src={avatar}
                alt=""
                width={64}
                height={64}
                className="size-16 rounded-full border-4 border-[#111214] bg-[#111214]"
              />
            ) : (
              <div className="size-16 rounded-full border-4 border-[#111214] bg-[#2b2d31]" />
            )}
            <span
              className={`absolute bottom-0.5 right-0.5 size-4 rounded-full border-[3px] border-[#111214] ${
                STATUS_COLOR[data.discord_status]
              }`}
              title={STATUS_LABEL[data.discord_status]}
            />
          </div>
          <div className="min-w-0 pb-1">
            <p className="truncate font-semibold leading-tight">{name}</p>
            <p className="truncate font-mono text-xs text-gray-400">{handle}</p>
          </div>
        </div>

        {custom?.state && (
          <p className="mb-3 rounded bg-[#2b2d31] px-3 py-2 text-sm text-gray-200">
            {custom.emoji?.name && !custom.emoji.id && (
              <span className="mr-1">{custom.emoji.name}</span>
            )}
            {custom.state}
          </p>
        )}

        {data.listening_to_spotify && data.spotify ? (
          <SpotifyActivity spotify={data.spotify} now={now} />
        ) : primary ? (
          <Activity activity={primary} now={now} />
        ) : (
          <p className="font-mono text-xs text-gray-500">
            {data.discord_status === "offline"
              ? "Offline, probably touching grass."
              : `${STATUS_LABEL[data.discord_status]}, nothing going on right now.`}
          </p>
        )}
      </div>
    </div>
  );
}

function ActivityShell({
  heading,
  image,
  imageAlt,
  badge,
  badgeAlt,
  children,
}: {
  heading: string;
  image: string | null;
  imageAlt: string;
  badge?: string | null;
  badgeAlt?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-phosphor">
        {heading}
      </p>
      <div className="flex gap-3">
        <div className="relative shrink-0">
          {image ? (
            <img
              src={image}
              alt={imageAlt}
              width={60}
              height={60}
              className="size-[60px] rounded-lg bg-[#2b2d31] object-cover"
              loading="lazy"
            />
          ) : (
            <div className="size-[60px] rounded-lg bg-[#2b2d31]" />
          )}
          {badge && (
            <img
              src={badge}
              alt={badgeAlt ?? ""}
              width={22}
              height={22}
              className="absolute -bottom-1 -right-1 size-[22px] rounded-full border-2 border-[#111214] bg-[#2b2d31]"
              loading="lazy"
            />
          )}
        </div>
        <div className="min-w-0 flex-1 self-center">{children}</div>
      </div>
    </div>
  );
}

function Activity({
  activity,
  now,
}: {
  activity: LanyardActivity;
  now: number;
}) {
  const start = activity.timestamps?.start;
  const end = activity.timestamps?.end;

  const timer = end
    ? `${formatDuration(end - now)} left`
    : start
      ? `${formatDuration(now - start)} elapsed`
      : null;

  return (
    <ActivityShell
      heading={activityHeading(activity)}
      image={assetUrl(activity, "large_image")}
      imageAlt={activity.assets?.large_text ?? activity.name}
      badge={assetUrl(activity, "small_image")}
      badgeAlt={activity.assets?.small_text ?? ""}
    >
      <p className="truncate text-sm font-semibold">{activity.name}</p>
      {activity.details && (
        <p className="truncate text-xs text-gray-300">{activity.details}</p>
      )}
      {activity.state && (
        <p className="truncate text-xs text-gray-400">{activity.state}</p>
      )}
      {timer && (
        <p className="mt-0.5 font-mono text-xs tabular-nums text-gray-500">
          {timer}
        </p>
      )}
    </ActivityShell>
  );
}

function SpotifyActivity({
  spotify,
  now,
}: {
  spotify: NonNullable<LanyardData["spotify"]>;
  now: number;
}) {
  const { start, end } = spotify.timestamps;
  const total = Math.max(1, end - start);
  const elapsed = Math.min(Math.max(0, now - start), total);
  const progress = (elapsed / total) * 100;

  return (
    <ActivityShell
      heading="Listening to Spotify"
      image={spotify.album_art_url}
      imageAlt={spotify.album}
    >
      <p className="truncate text-sm font-semibold">{spotify.song}</p>
      <p className="truncate text-xs text-gray-300">by {spotify.artist}</p>
      <p className="truncate text-xs text-gray-400">on {spotify.album}</p>
      <div className="mt-2">
        <div
          className="h-1 overflow-hidden rounded-full bg-[#2b2d31]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
        >
          <div
            className="h-full rounded-full bg-phosphor transition-[width] duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-gray-500">
          <span>{formatDuration(elapsed)}</span>
          <span>{formatDuration(total)}</span>
        </div>
      </div>
    </ActivityShell>
  );
}
