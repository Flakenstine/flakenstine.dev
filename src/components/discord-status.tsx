"use client";

import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DiscordStatus {
  success: boolean;
  data: {
    discord_user: {
      id: string;
      username: string;
      discriminator: string;
      avatar: string;
    };
    discord_status: "online" | "idle" | "dnd" | "offline";
    activities: Array<{
      name: string;
      type: number;
      url?: string;
      timestamps?: {
        start?: number;
        end?: number;
      };
      application_id?: string;
      details?: string;
      state?: string;
      emoji?: {
        name: string;
        id?: string;
        animated?: boolean;
      };
      party?: {
        id: string;
      };
      assets?: {
        large_image?: string;
        large_text?: string;
        small_image?: string;
        small_text?: string;
      };
      sync_id?: string;
      session_id?: string;
      flags?: number;
    }>;
    spotify?: {
      track_id: string;
      timestamps: {
        start: number;
        end: number;
      };
      song: string;
      artist: string;
      album_art_url: string;
      album: string;
    };
    listening_to_spotify: boolean;
    kv: Record<string, string>;
  };
}

interface DiscordStatusProps {
  userId: string;
  className?: string;
}

export function DiscordStatus({ userId, className = "" }: DiscordStatusProps) {
  const [status, setStatus] = useState<DiscordStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const raw: unknown = await response.json();
        const data = raw as DiscordStatus;
        console.log("Discord status data:", data); // Debug log
        console.log("Discord status success:", data.success);
        console.log("Discord status value:", data.data?.discord_status);
        setStatus(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch Discord status:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch status");
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    void fetchStatus();

    // Set up polling every 30 seconds
    const interval = setInterval(() => {
      void fetchStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const getStatusColor = (discordStatus: string) => {
    switch (discordStatus) {
      case "online":
        return "bg-green-500";
      case "idle":
        return "bg-yellow-500";
      case "dnd":
        return "bg-red-500";
      case "offline":
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (discordStatus: string) => {
    switch (discordStatus) {
      case "online":
        return "Online";
      case "idle":
        return "Away";
      case "dnd":
        return "Do Not Disturb";
      case "offline":
      default:
        return "Offline";
    }
  };

  const getStatusInfo = () => {
    if (loading) {
      return {
        status: "Loading...",
        details: "Fetching Discord status",
        color: "bg-gray-400",
        animate: "animate-pulse"
      };
    }

    if (error || !status?.success) {
      return {
        status: "Unavailable",
        details: error ? `Error: ${error}` : "Discord status unavailable",
        color: "bg-gray-500",
        animate: ""
      };
    }

    const discordStatus = status.data.discord_status;
    const activities = status.data.activities || [];
    const isListeningToSpotify = status.data.listening_to_spotify;
    
    const statusText = getStatusText(discordStatus);
    let details = `Discord Status: ${statusText}`;
    
    // Add activity information
    if (activities.length > 0) {
      const activity = activities[0];
      if (activity?.name && activity?.details) {
        details += `\nCurrently: ${activity.name} - ${activity.details}`;
      } else if (activity?.name) {
        details += `\nCurrently: ${activity.name}`;
      }
    }
    
    // Add Spotify info
    if (isListeningToSpotify && status.data.spotify) {
      const spotify = status.data.spotify;
      details += `\n🎵 Listening to: ${spotify.song} by ${spotify.artist}`;
    }

    return {
      status: statusText,
      details: details,
      color: getStatusColor(discordStatus),
      animate: discordStatus === "online" ? "animate-pulse" : ""
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`relative ${className}`}>
            <div
              className={`w-3 h-3 rounded-full ${statusInfo.color} ${statusInfo.animate}`}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-center">
            <p className="font-semibold">{statusInfo.status}</p>
            <p className="text-xs text-gray-300 whitespace-pre-line">
              {statusInfo.details}
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
