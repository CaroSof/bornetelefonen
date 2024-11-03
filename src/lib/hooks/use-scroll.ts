/**
 * Hook til at registrere scroll position
 * Returnerer true når brugeren har scrollet længere ned end den angivne grænseværdi
 */
import { useCallback, useEffect, useState } from "react";

export default function useScroll(threshold: number) {
  // State til at gemme om der er scrollet forbi grænseværdien
  const [scrolled, setScrolled] = useState(false);

  // Callback der opdaterer scroll status
  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  // Tilføj og fjern scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return scrolled;
}