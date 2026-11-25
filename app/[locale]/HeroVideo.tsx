"use client";

import { useEffect, useRef } from "react";

import styles from "./hero-video.module.css";

const MOBILE_QUERY = "(max-width: 650px)";

const CLOUDINARY_BASE = "https://res.cloudinary.com/dznyfk4z6/video/upload";

const VIDEO_ASSET = "v1795019457/IMG_8210_desktop_wrqqfv";

const MEDIA = {
  desktop: {
    video:
      `${CLOUDINARY_BASE}/` +
      "c_fill,g_center,w_1280,h_720/" +
      "fps_24/vc_h264/ac_none/q_auto:good/" +
      `${VIDEO_ASSET}.mp4`,

    poster:
      `${CLOUDINARY_BASE}/` +
      "so_0/c_fill,g_center,w_1280,h_720/" +
      "q_auto:good/" +
      `${VIDEO_ASSET}.webp`,
  },

  mobile: {
    video:
      `${CLOUDINARY_BASE}/` +
      "c_fill,g_auto,w_540,h_960/" +
      "fps_24/vc_h264/ac_none/q_auto:eco/" +
      `${VIDEO_ASSET}.mp4`,

    poster:
      `${CLOUDINARY_BASE}/` +
      "so_0/c_fill,g_auto,w_540,h_960/" +
      "q_auto:good/" +
      `${VIDEO_ASSET}.webp`,
  },
};

const MAX_START_DELAY = 3000;

export default function HeroVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const posterRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    const poster = posterRef.current;

    if (!wrapper || !video || !poster) {
      return;
    }

    const isMobile = window.matchMedia(MOBILE_QUERY).matches;

    const media = isMobile ? MEDIA.mobile : MEDIA.desktop;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const rect = wrapper.getBoundingClientRect();

    let isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    let isDisposed = false;
    let canStart = false;
    let hasLoadedVideo = false;
    let hasFailed = false;

    let posterReady = poster.complete;
    let fontsReady = !("fonts" in document);

    let pageReady = document.readyState === "complete";

    let startScheduled = false;

    let firstFrame = 0;
    let secondFrame = 0;

    const hideVideo = () => {
      wrapper.classList.remove(styles.videoVisible);
    };

    const showVideo = () => {
      if (
        !isDisposed &&
        isVisible &&
        !document.hidden &&
        !reducedMotion.matches &&
        !hasFailed
      ) {
        wrapper.classList.add(styles.videoVisible);
      }
    };

    const updatePlayback = () => {
      if (isDisposed) {
        return;
      }

      if (
        !canStart ||
        !isVisible ||
        document.hidden ||
        reducedMotion.matches ||
        hasFailed
      ) {
        video.pause();

        if (reducedMotion.matches) {
          hideVideo();
        }

        return;
      }

      if (!hasLoadedVideo) {
        hasLoadedVideo = true;

        video.src = media.video;

        video.load();
      }

      void video.play().catch(() => {
        // Keep the poster visible when
        // autoplay is unavailable.
      });
    };

    const allowVideoStart = () => {
      if (isDisposed || canStart) {
        return;
      }

      canStart = true;

      window.clearTimeout(startTimer);

      window.cancelAnimationFrame(firstFrame);

      window.cancelAnimationFrame(secondFrame);

      updatePlayback();
    };

    const scheduleVideoStart = () => {
      if (
        isDisposed ||
        canStart ||
        startScheduled ||
        !posterReady ||
        !fontsReady ||
        !pageReady
      ) {
        return;
      }

      startScheduled = true;

      // Give the browser a rendering opportunity
      // before starting the video request.

      firstFrame = window.requestAnimationFrame(() => {
        secondFrame = window.requestAnimationFrame(() => {
          allowVideoStart();
        });
      });
    };

    const handlePosterReady = () => {
      posterReady = true;

      scheduleVideoStart();
    };

    const handlePageReady = () => {
      pageReady = true;

      scheduleVideoStart();
    };

    const handleVideoPlaying = () => {
      showVideo();
    };

    const handleVideoError = () => {
      hasFailed = true;

      video.pause();

      hideVideo();
    };

    const handleMotionChange = () => {
      updatePlayback();
    };

    const handleFontsReady = () => {
      if (isDisposed) {
        return;
      }

      fontsReady = true;

      scheduleVideoStart();
    };

    const startTimer = window.setTimeout(allowVideoStart, MAX_START_DELAY);

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

    poster.addEventListener("load", handlePosterReady);

    poster.addEventListener("error", handlePosterReady);

    video.addEventListener("playing", handleVideoPlaying);

    video.addEventListener("error", handleVideoError);

    window.addEventListener("load", handlePageReady);

    document.addEventListener("visibilitychange", updatePlayback);

    reducedMotion.addEventListener("change", handleMotionChange);

    if ("fonts" in document) {
      void document.fonts.ready.then(handleFontsReady, handleFontsReady);
    }

    scheduleVideoStart();

    return () => {
      isDisposed = true;

      observer?.disconnect();

      window.clearTimeout(startTimer);

      window.cancelAnimationFrame(firstFrame);

      window.cancelAnimationFrame(secondFrame);

      poster.removeEventListener("load", handlePosterReady);

      poster.removeEventListener("error", handlePosterReady);

      video.removeEventListener("playing", handleVideoPlaying);

      video.removeEventListener("error", handleVideoError);

      window.removeEventListener("load", handlePageReady);

      document.removeEventListener("visibilitychange", updatePlayback);

      reducedMotion.removeEventListener("change", handleMotionChange);

      video.pause();

      video.removeAttribute("src");

      video.load();

      hideVideo();
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden="true">
      <div className={styles.fallback} />

      <picture className={styles.poster}>
        <source
          media={MOBILE_QUERY}
          srcSet={MEDIA.mobile.poster}
          type="image/webp"
        />

        <img
          ref={posterRef}
          src={MEDIA.desktop.poster}
          alt=""
          width={1280}
          height={720}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={styles.posterImage}
        />
      </picture>

      <video
        ref={videoRef}
        className={styles.video}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
        tabIndex={-1}
      />
    </div>
  );
}
