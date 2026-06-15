import { useEffect, useState } from "react";

function getWindowSize() {
  if (typeof window === "undefined") {
    return {
      width: 0,
      height: 0,
    };
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

export default function useWindowSize() {
  const [windowSize, setWindowSize] = useState(getWindowSize);

  useEffect(
    () => {
      function handleResize() {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      handleResize();

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    },

    // The empty dependency array attaches one resize listener when the Hook mounts.
    // Without it, the effect would run after every render and repeatedly replace the listener.
    []
  );

  return windowSize;
}
