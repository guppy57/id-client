import React from "react";
import Image from "next/image";

export default function WallpaperComponent() {
  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-r from-fuchsia-500 to-cyan-500",
      "bg-gradient-to-r from-blue-600 to-violet-600",
      "bg-gradient-to-bl from-fuchsia-600 via-violet-600 to-pink-600",
      "bg-gradient-to-bl from-amber-200 to-yellow-500",
      "bg-gradient-to-tl from-red-500 to-orange-500",
      "bg-gradient-to-r from-indigo-500 via-violet-600 to-blue-500",
      "bg-gradient-to-r from-teal-400 to-yellow-200",
      "bg-gradient-to-tl from-teal-400 via-violet-600 to-yellow-200",
      "bg-gradient-to-bl from-amber-500 via-fuchsia-400 to-pink-500",
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  return (
    <div className={"absolute inset-0 h-full w-full " + getRandomGradient()} />
  );
}
