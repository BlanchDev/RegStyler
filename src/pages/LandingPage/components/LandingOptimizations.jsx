import optimizations from "../optimizations.json";
import { useEffect, useState } from "react";
import OptimizationHtml from "./OptimizationHtml";

function LandingOptimizations() {
  const [shuffledOptimizations, setShuffledOptimizations] = useState([]);

  useEffect(() => {
    const shuffleOptimizations = () => {
      setShuffledOptimizations(
        [...optimizations].sort(() => Math.random() - 0.5),
      );
    };

    shuffleOptimizations();

    const slider = document.querySelector(".optimization-slider");
    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 45;

    const scrollContent = () => {
      scrollAmount += scrollStep;
      if (scrollAmount >= slider.scrollHeight - slider.clientHeight) {
        scrollAmount = 0;
        shuffleOptimizations();
      }
      slider.scrollTo(0, scrollAmount);
    };

    const intervalId = setInterval(scrollContent, scrollInterval);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='optimization-slider'>
      {shuffledOptimizations.map((optimization) => (
        <OptimizationHtml key={optimization.id} optimization={optimization} />
      ))}
    </div>
  );
}

export default LandingOptimizations;
