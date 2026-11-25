"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./hero-video.module.css";

const VIDEOS = {
  desktop: {
    optimized:
      "https://res.cloudinary.com/dznyfk4z6/video/upload/c_limit,w_1920,vc_h264,ac_none,q_auto:good/v1795019457/IMG_8210_desktop_wrqqfv.mp4",

    original:
      "https://res.cloudinary.com/dznyfk4z6/video/upload/v1795019457/IMG_8210_desktop_wrqqfv.mp4",
  },

  mobile: {
    optimized:
      "https://res.cloudinary.com/dznyfk4z6/video/upload/c_limit,w_720,vc_h264,ac_none,q_auto:good/v1795017593/IMG_8210_ptm8mb.mp4",

    original:
      "https://res.cloudinary.com/dznyfk4z6/video/upload/v1795017593/IMG_8210_ptm8mb.mp4",
  },
};

export default function HeroVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;

    if (!video || !wrapper || hasError) {
      return;
    }

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const rect = wrapper.getBoundingClientRect();

    let isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    const updatePlayback = () => {
      const shouldPlay =
        isVisible && !document.hidden && !motionPreference.matches;

      if (!shouldPlay) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // Autoplay may be restricted by the browser.
      });
    };

    const handleLoadedData = () => {
      setIsReady(true);
      updatePlayback();
    };

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              isVisible = entry.isIntersecting;
              updatePlayback();
            },
            {
              threshold: 0,
            },
          )
        : null;

    observer?.observe(wrapper);

    video.addEventListener("loadeddata", handleLoadedData);

    document.addEventListener("visibilitychange", updatePlayback);

    motionPreference.addEventListener("change", updatePlayback);

    const frameId = window.requestAnimationFrame(() => {
      if (video.readyState >= 2) {
        setIsReady(true);
      }

      updatePlayback();
    });

    return () => {
      window.cancelAnimationFrame(frameId);

      observer?.disconnect();

      video.removeEventListener("loadeddata", handleLoadedData);

      document.removeEventListener("visibilitychange", updatePlayback);

      motionPreference.removeEventListener("change", updatePlayback);

      video.pause();
    };
  }, [useOriginal, hasError]);

  const handleVideoError = () => {
    setIsReady(false);

    if (!useOriginal) {
      setUseOriginal(true);
      return;
    }

    setHasError(true);
  };

  const desktopSource = useOriginal
    ? VIDEOS.desktop.original
    : VIDEOS.desktop.optimized;

  const mobileSource = useOriginal
    ? VIDEOS.mobile.original
    : VIDEOS.mobile.optimized;

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden="true">
      <div className={styles.fallback} />

      {!hasError && (
        <video
          key={useOriginal ? "original" : "optimized"}
          ref={videoRef}
          className={`${styles.video} ${isReady ? styles.videoReady : ""}`}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onLoadedData={() => setIsReady(true)}
          onPlaying={() => setIsReady(true)}
          onError={handleVideoError}
          tabIndex={-1}
        >
          <source
            media="(min-width: 651px)"
            src={desktopSource}
            type="video/mp4"
          />

          <source src={mobileSource} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
