import { useEffect } from "react";

const useMouse = (ref) => {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

      if (ref.current) {
        ref.current.x = mouseX;
        ref.current.y = -mouseY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // clear-up function
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return ref;
}

export default useMouse;