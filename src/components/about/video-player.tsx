"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Pause, Play, Video } from "lucide-react";

export default function VideoPlayer({
  poster,
  src,
  badge = "工厂实拍",
  title = "走进特澳生产基地",
}: {
  poster: string;
  src: string;
  badge?: string;
  title?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
      setStarted(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="metadata"
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
      />

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={started ? "继续播放工厂视频" : "播放工厂视频"}
          className="group absolute inset-0 h-full w-full cursor-pointer text-left"
        >
          {!started && (
            <Image
              src={poster}
              alt="特澳工厂"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 45vw"
              priority
            />
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-ink/50 px-3.5 py-2 text-white/85 backdrop-blur-md">
            <Video size={15} strokeWidth={2} />
            <span className="text-micro font-medium uppercase tracking-[0.14em]">{badge}</span>
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-[0_18px_48px_rgba(232,120,26,0.36)] transition-transform duration-300 group-hover:scale-105 lg:h-20 lg:w-20">
              {started ? <Pause size={28} strokeWidth={2.5} /> : <Play size={28} className="ml-1" strokeWidth={2.5} />}
            </span>
          </span>
          <span className="absolute inset-x-5 bottom-5 lg:inset-x-7 lg:bottom-7">
            <span className="block max-w-[420px] text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-white lg:text-[30px]">
              {title}
            </span>
          </span>
        </button>
      )}

      {playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label="暂停工厂视频"
          className="absolute bottom-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-ink/60 text-white backdrop-blur transition-colors hover:bg-ink/80"
        >
          <Pause size={18} />
        </button>
      )}
    </div>
  );
}
