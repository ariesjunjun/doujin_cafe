"use client";

import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-10 right-6 z-50 
        w-12 h-12 rounded-full 
        flex items-center justify-center
        bg-primary text-white text-xl 
        border border-white 
        shadow-xl hover:bg-text transition
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      aria-label="ページの上部に戻る"
    >
      ▲
    </button>
  );
}
