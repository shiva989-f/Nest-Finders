import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const ImageCarousel = ({ images }) => {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const changeImage = (newIndex) => {
    if (isTransitioning) return; // Prevent rapid clicking

    setIsTransitioning(true);
    setTimeout(() => {
      setIndex(newIndex);
      setIsTransitioning(false);
    }, 150); // Half of the transition duration
  };

  const prevImage = () => {
    const newIndex = index === 0 ? images.length - 1 : index - 1;
    changeImage(newIndex);
  };

  const nextImage = () => {
    const newIndex = index === images.length - 1 ? 0 : index + 1;
    changeImage(newIndex);
  };

  // Auto-play functionality using useEffect
  useEffect(() => {
    if (images.length <= 1) return; // Don't auto-play if only one image

    const interval = setInterval(() => {
      if (!isTransitioning) {
        const newIndex = index === images.length - 1 ? 0 : index + 1;
        changeImage(newIndex);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [index, images.length, isTransitioning]);

  return (
    <div className="relative w-full max-w-2xl aspect-video mx-auto">
      {/* Current Image */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        <img
          src={images[index].imageUrl}
          alt={`Property Image ${index + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>

      {/* Navigation buttons - only show if more than 1 image */}
      {images.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            className="bg-black/40 hover:bg-black/60 flex justify-center items-center p-1 absolute w-10 h-10 rounded-full text-white left-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer disabled:opacity-50"
            onClick={prevImage}
            disabled={isTransitioning}
            aria-label="Previous image"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Next Button */}
          <button
            className="bg-black/40 hover:bg-black/60 flex justify-center items-center p-1 absolute w-10 h-10 rounded-full text-white right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer disabled:opacity-50"
            onClick={nextImage}
            disabled={isTransitioning}
            aria-label="Next image"
          >
            <ArrowRight size={18} />
          </button>

          {/* Indicator dots */}
          <div className="absolute w-full h-2 left-1/2 -translate-x-1/2 bottom-3 flex justify-center items-center gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full shadow transition-all duration-300 cursor-pointer ${
                  idx === index
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/75"
                }`}
                onClick={() => changeImage(idx)}
                disabled={isTransitioning}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
