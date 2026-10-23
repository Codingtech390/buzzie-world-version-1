
"use client";

import { useRef } from "react";

interface HoverVideoPreviewProps {
  title: string;
  src: string;
  className?: string;
}

export default function HoverVideoPreview({
  title,
  src,
  className = "",
}: HoverVideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    const video = videoRef.current;
    if (!video) return;

    void video.play().catch((error: unknown) => {
      console.warn("Video playback could not start:", error);
    });
  };

  const handleMouseLeave = () => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
  };

  return (
    <video
      ref={videoRef}
      src={src}
      controls
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={title}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      Your browser does not support HTML video.
    </video>
  );
}
