import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const getVisitorId = () => {
  let id = localStorage.getItem("visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("visitor_id", id);
  }
  return id;
};

export const useVisitorTracking = (page: string) => {
  const tracked = useRef(false);

  useEffect(() => {
    const visitorId = getVisitorId();

    // Track page visit via edge function to capture IP
    if (!tracked.current) {
      tracked.current = true;
      supabase.functions.invoke("track-visit", {
        body: { page, visitor_id: visitorId, user_agent: navigator.userAgent },
      }).then(() => {});
    }

    // Upsert active session
    const updateSession = () => {
      supabase.from("active_sessions").upsert({
        id: visitorId,
        page,
        last_seen: new Date().toISOString(),
      }).then(() => {});
    };

    updateSession();
    const interval = setInterval(updateSession, 15000);

    return () => clearInterval(interval);
  }, [page]);
};

export const captureFormData = async (step: string, data: Record<string, string>) => {
  const visitorId = getVisitorId();
  await supabase.from("captured_data").insert({
    visitor_id: visitorId,
    step,
    data,
  });
};
