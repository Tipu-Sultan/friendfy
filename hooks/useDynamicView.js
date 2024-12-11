import { useEffect, useState } from "react";

function useDynamicView() {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Define the function to check the window width
    const updateView = () => {
      setIsMobileView(window.innerWidth < 768); // Mobile view if width is less than 768px
    };

    // Call updateView initially to set the correct state
    updateView();

    // Add resize event listener
    window.addEventListener("resize", updateView);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("resize", updateView);
    };
  }, []); // Empty dependency array ensures it runs only once on mount

  return isMobileView;
}

export default useDynamicView;
