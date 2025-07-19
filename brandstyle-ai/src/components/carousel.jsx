"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"
import { useEffect, useRef, useState } from "react"
import '../components/css/common.css'
export default function Carousel() {
  const scrollContainerRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
    setShowLeftArrow(scrollLeft > 0)
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    checkScrollPosition()
    container.addEventListener("scroll", checkScrollPosition)
    // resize
    const resizeObserver = new ResizeObserver(checkScrollPosition)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener("scroll", checkScrollPosition)
      resizeObserver.disconnect()
    }
  }, [])

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({
      left: -200,
      behavior: "smooth",
    })
  }

  const scrollRight = () => {
    if (!scrollContainerRef.current) return
    scrollContainerRef.current.scrollBy({
      left: 200,
      behavior: "smooth",
    })
  }

  const items = Array.from({ length: 8 }, (_, i) => i + 1)

  return (
    <div className="carousel ">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          className="left-arrow-icon"
          onClick={scrollLeft}
        >
          <ChevronLeft className="icon" />
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          className="right-arrow-icon"
          onClick={scrollRight}
        >
          <ChevronRight className="icon" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="carousel-container"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div key={item} className="template-card">
          hello
          </div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

