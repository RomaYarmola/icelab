"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { onFirstInteraction } from "@/app/components/common/onFirstInteraction";

// Те саме, що й LazyRequestModal, але для триступеневої модалки замовлення:
// до кліку по «Замовити» її код у первинному бандлі не потрібен.
const MultiStepModal = dynamic(() => import("./MultiStepModal"), {
  ssr: false,
});

export default function LazyMultiStepModal({ isOpen, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => onFirstInteraction(() => import("./MultiStepModal")), []);

  useEffect(() => {
    if (isOpen) setMounted(true);
  }, [isOpen]);

  if (!mounted) return null;

  return <MultiStepModal isOpen={isOpen} {...props} />;
}
