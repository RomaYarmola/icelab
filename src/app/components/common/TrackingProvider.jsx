"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { recordVisit } from "@/utils/tracking";

// Логує перегляд кожної сторінки в sessionStorage (для контексту заявок).
export default function TrackingProvider() {
  const pathname = usePathname();
  useEffect(() => {
    recordVisit(pathname);
  }, [pathname]);
  return null;
}
