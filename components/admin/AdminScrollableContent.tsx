
"use client";

import type { ReactNode, WheelEvent } from "react";

interface AdminScrollableContentProps {
  children: ReactNode;
}

export default function AdminScrollableContent({
  children,
}: AdminScrollableContentProps) {
  const handleWheel = (event: WheelEvent<HTMLElement>) => {
    const element = event.currentTarget;

    if (element.scrollHeight <= element.clientHeight) {
      return;
    }

    event.preventDefault();
    element.scrollTop += event.deltaY;
  };

  return (
    <div
      onWheel={handleWheel}
      className="h-full min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-y-contain"
    >
      {children}
    </div>
  );
}
