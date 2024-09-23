import React from "react";
import { cn } from "../lib/utils";
import { useEffect, useState } from "react";

export default function WallpaperComponent() {
  const [gradient, setGradient] = useState("");

  const getRandomGradient = () => {
    const gradients = [
      "bg-gradient-to-bl from-fuchsia-500 to-cyan-500",
      "bg-gradient-to-bl from-fuchsia-600 via-violet-600 to-pink-600",
      "bg-gradient-to-bl from-indigo-500 via-violet-600 to-blue-500",
      "bg-gradient-to-tl from-teal-400 to-yellow-200",
      "bg-gradient-to-tl from-teal-400 via-violet-600 to-yellow-200",
      "bg-gradient-to-bl from-amber-500 via-fuchsia-400 to-pink-500",
    ];

    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  useEffect(() => {
    console.log(gradient);
    if (gradient != "") return;

    const randomGradient = getRandomGradient();
    setGradient(randomGradient);
  }, [gradient, setGradient]);

  return (
    <div className={cn("absolute inset-0 -z-10 h-full w-full", gradient)} />
  );
}
