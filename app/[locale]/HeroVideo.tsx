"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./hero-video.module.css";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.readyState >= 3) {
      setIsReady(true);
    }

    const playVideo = async () => {
      try {
        await video.play();
      } catch {
        // Autoplay may be delayed by the browser.
        // The video remains hidden until it can actually play.
      }
    };

    void playVideo();
  }, []);

  return (
    <div className={styles.wrapper} aria-hidden="true">
      <div className={styles.fallback} />

      {!hasError && (
        <video
          ref={videoRef}
          className={`${styles.video} ${isReady ? styles.videoReady : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onCanPlay={() => setIsReady(true)}
          onPlaying={() => setIsReady(true)}
          onError={() => setHasError(true)}
          tabIndex={-1}
        >
          <source
            media="(min-width: 651px)"
            src="https://res.cloudinary.com/dznyfk4z6/video/upload/v1795019457/IMG_8210_desktop_wrqqfv.mp4"
            type="video/mp4"
          />

          <source
            src="https://res.cloudinary.com/dznyfk4z6/video/upload/v1795017593/IMG_8210_ptm8mb.mp4"
            type="video/mp4"
          />
        </video>
      )}
    </div>
  );
}
