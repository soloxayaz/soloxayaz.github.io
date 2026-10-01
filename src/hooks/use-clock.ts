import { useEffect, useState } from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function timeOfDayFromHour(hour: number): TimeOfDay {
  if (hour < 5) return "night";
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  if (hour < 22) return "evening";
  return "night";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// One shared session start so the header, hero and footer always agree.
let sessionStart = 0;
function getSessionStart() {
  if (!sessionStart) sessionStart = Date.now();
  return sessionStart;
}

export function useClock() {
  const [now, setNow] = useState(() => new Date());
  const [start] = useState(getSessionStart);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const seconds = Math.floor((now.getTime() - start) / 1000);
  const hour = now.getHours();

  return {
    mounted,
    now,
    hour,
    tod: timeOfDayFromHour(hour),
    time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    day: now.toLocaleDateString([], { weekday: "long" }).toLowerCase(),
    session: `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`,
  };
}
