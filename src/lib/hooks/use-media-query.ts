/**
 * Hook til at bestemme enhedstype og skærmstørrelse
 */
import { useEffect, useState } from "react";

export default function useMediaQuery() {
  // Gem enhedstype i state
  const [device, setDevice] = useState<"mobile" | "tablet" | "desktop" | null>(
    null,
  );

  // Gem skærmstørrelse i state
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  useEffect(() => {
    // Tjek og opdater enhedstype og skærmstørrelse
    const checkDevice = () => {
      // Sæt enhedstype baseret på skærmbredde
      if (window.matchMedia("(max-width: 640px)").matches) {
        setDevice("mobile");
      } else if (
        window.matchMedia("(min-width: 641px) and (max-width: 1024px)").matches
      ) {
        setDevice("tablet");
      } else {
        setDevice("desktop");
      }
      // Gem skærmstørrelse
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    // Kør første gang
    checkDevice();

    // Lyt efter ændringer i vinduets størrelse
    window.addEventListener("resize", checkDevice);

    // Fjern event listener når komponenten fjernes
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  // Send data tilbage
  return {
    device,                    // Enhedstype
    width: dimensions?.width,  // Bredde
    height: dimensions?.height,// Højde
    isMobile: device === "mobile",   // Er mobil
    isTablet: device === "tablet",   // Er tablet 
    isDesktop: device === "desktop", // Er desktop
  };
}