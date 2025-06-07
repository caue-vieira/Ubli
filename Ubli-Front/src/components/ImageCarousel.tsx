import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageCarouselProps {
  images: (string | undefined)[];
  className?: string;
  autoRotate?: boolean;
  rotateInterval?: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images: rawImages,
  className = "",
  autoRotate = true,
  rotateInterval = 5000,
}) => {
  // Filtra imagens inválidas e undefined
  const images = rawImages.filter((img): img is string => Boolean(img));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isHovered, setIsHovered] = useState(false);

  // Não renderizar se não houver imagens válidas
  if (images.length === 0) {
    return null;
  }

  const nextImage = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Auto-rotação das imagens
  useEffect(() => {
    if (!autoRotate || images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      nextImage();
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, images.length, isHovered, rotateInterval]);

  // Variantes de animação
  const variants = {
    enter: (direction: "left" | "right") => ({
      x: direction === "right" ? "100%" : "-100%",
      opacity: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? "-100%" : "100%",
      opacity: 0.5,
      transition: { duration: 0.3 },
    }),
  };

  return (
    <div
      className={`relative w-full h-40 mb-3 rounded-lg overflow-hidden bg-gray-100 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence custom={direction} initial={false}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0"
        >
          <img
            src={images[currentIndex]}
            alt={`Imagem ${currentIndex + 1} do local`}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Controles do carrossel (apenas se houver mais de uma imagem) */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-all z-10"
            aria-label="Imagem anterior"
          >
            &lt;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-1 rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-all z-10"
            aria-label="Próxima imagem"
          >
            &gt;
          </button>

          {/* Indicadores */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setDirection(index > currentIndex ? "right" : "left");
                  setCurrentIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === index ? "bg-white w-4" : "bg-white/50"
                }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>

          {/* Contador de imagens */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}

      {/* Fallback para imagens com erro */}
      {images.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-gray-500">
          Nenhuma imagem disponível
        </div>
      )}
    </div>
  );
};

export default React.memo(ImageCarousel);
