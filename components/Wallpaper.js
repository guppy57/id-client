import React from "react";
import Image from "next/image";

export default function WallpaperComponent() {
  return (
    <div>
      <Image
        className="absolute inset-0 h-full w-full object-cover"
        src="https://res.cloudinary.com/dlazo25rt/image/upload/v1700092790/kreative-id/space_lha0iq.jpg"
        alt="Space image Wallpaper for Kreative ID"
        fill="fill"
      />
    </div>
  );
}
