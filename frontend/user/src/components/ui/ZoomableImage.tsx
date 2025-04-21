import React, { useState, useEffect, useRef } from "react";

interface ZoomableImageProps {
  src: string;
  alt?: string;
  zoomScale?: number;
  className?: string;
  enableZoomToggle?: boolean;
}

export default function ZoomableImage({
  src,
  alt = "",
  zoomScale = 2.5,
  className = "",
  enableZoomToggle = false,
}: ZoomableImageProps) {
  const [zoomed, setZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  // Prevent scrolling when zoomed
  useEffect(() => {
    if (zoomed) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [zoomed]);

  // Esc key support
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") resetZoom();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const resetZoom = () => {
    setZoomed(false);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!zoomed) return;
    setDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!zoomed || !dragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    startPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Touch support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!zoomed) return;
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!zoomed) return;
    const touch = e.touches[0];
    const dx = touch.clientX - startPos.current.x;
    const dy = touch.clientY - startPos.current.y;
    setPosition((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));
    startPos.current = { x: touch.clientX, y: touch.clientY };
  };

  return (
    <div
      className={`relative overflow-hidden ${zoomed ? "cursor-grab" : "cursor-zoom-in"} ${className}`}
      onClick={() => !zoomed && setZoomed(true)}
      onDoubleClick={resetZoom}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setDragging(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="select-none pointer-events-none transition-transform duration-300 rounded max-h-[90vh] max-w-full object-contain"
        style={{
          transform: zoomed
            ? `scale(${zoomScale}) translate(${position.x}px, ${position.y}px)`
            : "scale(1)",
          transition: dragging ? "none" : "transform 0.3s ease",
        }}
      />

      {/* Instruction Text */}
      {zoomed && (
        <div className="absolute top-4 left-4 text-xs text-white bg-black/70 px-2 py-1 rounded z-10">
          Drag to pan, double-click or press Esc to exit
        </div>
      )}

      {/* Optional zoom toggle */}
      {enableZoomToggle && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomed ? resetZoom() : setZoomed(true);
          }}
          className="absolute top-4 right-4 z-10 text-white bg-black/60 px-3 py-1 rounded hover:bg-black/80 text-sm"
        >
          {zoomed ? "Reset Zoom" : "Zoom In"}
        </button>
      )}
    </div>
  );
}
