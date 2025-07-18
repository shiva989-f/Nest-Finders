import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";

const ImageCarousel = () => {
  const [index, setIndex] = useState(0);
  const images = [
    { imageUrl: "/images/2.webp" },
    { imageUrl: "/images/logo.png" },
    { imageUrl: "/images/modern_house.webp" },
    { imageUrl: "/images/page_not_found.jpg" },
  ];

  const prevImage = () => {
    setIndex(index === 0 ? images.length - 1 : index - 1);
  };

  const nextImage = () => {
    setIndex(index === images.length - 1 ? 0 : index + 1);
  };

  // Auto-play functionality using useEffect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full max-w-2xl aspect-video mx-auto">
      <img
        src={images[index].imageUrl}
        alt="Property Images"
        className="w-full h-full object-cover rounded-lg"
      />

      {/* Previous Button */}
      <button
        className="bg-black/40 hover:bg-black/60 flex justify-center items-center p-1 absolute w-10 h-10 rounded-full text-white left-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
        onClick={prevImage}
        aria-label="Previous image"
      >
        <ArrowLeft />
      </button>

      {/* Next Button */}
      <button
        className="bg-black/40 hover:bg-black/60 flex justify-center items-center p-1 absolute w-10 h-10 rounded-full text-white right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
        onClick={nextImage}
        aria-label="Next image"
      >
        <ArrowRight />
      </button>

      {/* Indicator dots */}
      <div className="absolute w-full h-2 left-1/2 -translate-x-1/2 bottom-3 flex justify-center items-center gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-1.5 h-1.5 rounded-full shadow transition-colors cursor-pointer ${
              idx === index ? "bg-blue-600" : "bg-gray-400"
            }`}
            onClick={() => setIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
