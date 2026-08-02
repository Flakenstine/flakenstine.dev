/** Types and helpers for the Lanyard API (https://api.lanyard.rest). */

export type DiscordStatusValue = "online" | "idle" | "dnd" | "offline";

export interface LanyardActivity {
  id?: string;
  name: string;
  /** 0 playing · 1 streaming · 2 listening · 3 watching · 4 custom · 5 competing */
  type: number;
  url?: string;
  details?: string;
  state?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  emoji?: { name: string; id?: string; animated?: boolean };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
}

export interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    global_name?: string | null;
    display_name?: string | null;
    avatar: string | null;
  };
  discord_status: DiscordStatusValue;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify?: {
    track_id: string;
    timestamps: { start: number; end: number };
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
  } | null;
}

export interface LanyardResponse {
  success: boolean;
  data: LanyardData;
}

export const STATUS_LABEL: Record<DiscordStatusValue, string> = {
  online: "Online",
  idle: "Away",
  dnd: "Do Not Disturb",
  offline: "Offline",
};

export const STATUS_COLOR: Record<DiscordStatusValue, string> = {
  online: "bg-[#23a55a]",
  idle: "bg-[#f0b232]",
  dnd: "bg-[#f23f43]",
  offline: "bg-[#80848e]",
};

/** The verb Discord shows above an activity, e.g. "PLAYING". */
export function activityHeading(activity: LanyardActivity): string {
  switch (activity.type) {
    case 1:
      return "Streaming";
    case 2:
      return "Listening to";
    case 3:
      return "Watching";
    case 5:
      return "Competing in";
    default:
      return "Playing";
  }
}

/**
 * Resolve an activity asset key to a URL. Discord uses three shapes: proxied
 * external images, Spotify ids, and plain app-asset ids.
 */
export function assetUrl(
  activity: LanyardActivity,
  key: "large_image" | "small_image",
): string | null {
  const image = activity.assets?.[key];
  if (!image) return null;

  if (image.startsWith("mp:external/")) {
    return `https://media.discordapp.net/${image.slice(3)}`;
  }
  if (image.startsWith("spotify:")) {
    return `https://i.scdn.co/image/${image.slice("spotify:".length)}`;
  }
  if (!activity.application_id) return null;
  return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${image}.png`;
}

export function avatarUrl(user: LanyardData["discord_user"]): string | null {
  if (!user.avatar) return null;
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
}

/** mm:ss, or h:mm:ss once it runs past an hour. */
export function formatDuration(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

/** The custom status line (type 4) is shown separately from real activities. */
export function splitActivities(activities: LanyardActivity[]) {
  return {
    custom: activities.find((a) => a.type === 4),
    primary: activities.find((a) => a.type !== 4),
  };
}
