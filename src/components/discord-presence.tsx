import { useEffect, useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
  type LanyardResponse,
} from "@/lib/lanyard";

interface Props {
  userId: string;
  href: string;
  handle: string;
}

export function DiscordPresence({ userId, href, handle }: Props) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  // Ticks once a second so elapsed timers and the Spotify bar stay live.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const response = await fetch(
          `https://api.lanyard.rest/v1/users/${userId}`,
          { headers: { Accept: "application/json" } },
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const body = (await response.json()) as LanyardResponse;
        if (cancelled) return;

        if (!body.success) throw new Error("Lanyard returned success: false");
        setData(body.data);
        setState("ready");
      } catch {
        if (cancelled) return;
        setData(null);
        setState("error");
      }
    };

    void fetchStatus();
    const poll = setInterval(() => void fetchStatus(), 30_000);
    const tick = setInterval(() => setNow(Date.now()), 1_000);

    return () => {
      cancelled = true;
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [userId]);

  const status = data?.discord_status ?? "offline";
  const dotColor =
    state === "ready" ? STATUS_COLOR[status] : "bg-[#80848e]";
  const statusLabel =
    state === "loading"
      ? "Checking status…"
      : state === "error"
        ? "Status unavailable"
        : STATUS_LABEL[status];

  return (
    <HoverCard openDelay={120} closeDelay={120}>
      <HoverCardTrigger asChild>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Discord — ${handle} (${statusLabel})`}
          className="relative inline-flex h-8 items-center gap-2 rounded-md bg-[#00FF9D] px-3 text-xs font-medium text-black transition-colors hover:bg-[#00FF9D]/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00FF9D]"
        >
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="size-4"
            aria-hidden="true"
          >
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
          </svg>
          discord
          <span
            className={`size-3 shrink-0 rounded-full ${dotColor} ${
              status === "online" && state === "ready" ? "animate-pulse" : ""
            }`}
            aria-hidden="true"
          />
        </a>
      </HoverCardTrigger>

      <HoverCardContent
        align="end"
        sideOffset={10}
        className="w-80 border-[#00FF9D]/20 bg-[#111214] p-0 text-white shadow-xl"
      >
        <PresenceCard data={data} state={state} handle={handle} now={now} />
      </HoverCardContent>
    </HoverCard>
  );
}

function PresenceCard({
  data,
  state,
  handle,
  now,
}: {
  data: LanyardData | null;
  state: "loading" | "ready" | "error";
  handle: string;
  now: number;
}) {
  if (state === "loading") {
    return (
      <div className="p-4 font-mono text-sm text-gray-400">
        Checking Discord…
      </div>
    );
  }

  if (state === "error" || !data) {
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
      <div className="h-12 rounded-t-md bg-gradient-to-r from-[#00FF9D]/30 to-[#00FF9D]/5" />
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
              ? "Offline — probably touching grass."
              : `${STATUS_LABEL[data.discord_status]} — nothing going on right now.`}
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
      <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#00FF9D]">
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
            className="h-full rounded-full bg-[#00FF9D] transition-[width] duration-1000 ease-linear"
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
