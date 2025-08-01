"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface PromotionalItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  linkUrl?: string;
  buttonText?: string;
  backgroundColor?: string;
  textColor?: string;
  isActive: boolean;
}

const PromotionalBanner = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Sample promotional data - you can modify this manually
  const [promotionalItems] = useState<PromotionalItem[]>([
    {
      id: "1",
      title: "🎵 New Release: Tangkhul Songs Collection",
      description:
        "Discover authentic traditional melodies preserved for generations",
      imageUrl: "/placeholder.svg",
      linkUrl: "/lyrics",
      buttonText: "Explore Now",
      backgroundColor: "bg-gradient-to-r from-blue-600 to-purple-600",
      textColor: "text-white",
      isActive: false,
    },
    {
      id: "2",
      title: "🎤 Submit Your Lyrics & Win Prizes!",
      description: "Help preserve our cultural heritage by contributing lyrics",
      imageUrl: "/placeholder.svg",
      linkUrl: "/contribute",
      buttonText: "Contribute",
      backgroundColor: "bg-gradient-to-r from-green-500 to-teal-600",
      textColor: "text-white",
      isActive: false,
    },
  ]);

  // Carousel state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Handle client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isMounted || !isAutoPlaying) {
      setProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === promotionalItems.length - 1 ? 0 : prevIndex + 1
      );
      setProgress(0); // Reset progress when changing slide
    }, 5000); // Change slide every 5 seconds

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 100 / 500; // 5000ms / 10ms intervals = 500 steps
      });
    }, 10);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [isMounted, isAutoPlaying, promotionalItems.length, currentIndex]);

  // Get the current promotional item
  const activeItem = promotionalItems[currentIndex];

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === promotionalItems.length - 1 ? 0 : prevIndex + 1
    );
    setProgress(0); // Reset progress
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? promotionalItems.length - 1 : prevIndex - 1
    );
    setProgress(0); // Reset progress
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0); // Reset progress
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setProgress(0); // Reset progress
  };

  if (!activeItem || !isMounted) {
    // Show a simple placeholder during server-side rendering and initial hydration
    return (
      <section className="w-full bg-gray-50 dark:bg-gray-900 py-6 border-y border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 p-6 md:p-8 animate-pulse">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="h-8 bg-white/20 rounded mb-2"></div>
                <div className="h-6 bg-white/20 rounded mb-4"></div>
                <div className="h-10 w-32 bg-white/20 rounded"></div>
              </div>
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900 py-6 border-y border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div
          className={`relative overflow-hidden rounded-xl shadow-lg ${activeItem.backgroundColor} p-6 md:p-8 transition-all duration-500 ease-in-out`}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:scale-110"
            aria-label="Previous promotion"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white transition-all duration-300 hover:scale-110"
            aria-label="Next promotion"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Content Section */}
            <div className="flex-1 text-center md:text-left">
              <h2
                className={`text-2xl md:text-3xl font-bold mb-2 ${activeItem.textColor}`}
              >
                {activeItem.title}
              </h2>
              <p className={`text-lg mb-4 ${activeItem.textColor} opacity-90`}>
                {activeItem.description}
              </p>

              {/* Call to Action Button */}
              {activeItem.linkUrl && activeItem.buttonText && (
                <Link href={activeItem.linkUrl} prefetch={true}>
                  <button className="inline-flex items-center px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 transform">
                    {activeItem.buttonText}
                    <svg
                      className="ml-2 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </Link>
              )}
            </div>

            {/* Image Section */}
            {activeItem.imageUrl && (
              <div className="flex-shrink-0">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-4 border-white/20 shadow-xl">
                  <Image
                    src={activeItem.imageUrl}
                    alt={activeItem.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 128px, 160px"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
            {promotionalItems.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white scale-110"
                    : "bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div
              className="h-full bg-white/60 transition-all duration-100 ease-linear"
              style={{
                width: `${isAutoPlaying ? progress : 0}%`,
              }}
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-4 right-4 flex space-x-1 opacity-60">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-white rounded-full animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>

        {/* Promotional Banner Indicator */}
        <div className="text-center mt-2 flex items-center justify-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-medium">
            Featured Promotion
          </span>
          <span className="text-xs text-gray-400">
            {currentIndex + 1} / {promotionalItems.length}
          </span>
          <button
            onClick={toggleAutoPlay}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ml-2"
            aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
          >
            {isAutoPlaying ? "⏸️" : "▶️"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;
