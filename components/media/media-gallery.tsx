"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const galleryImages = [
  {
    id: 1,
    title: "MG Awareness Month Walk 2024",
    color: "bg-gradient-to-br from-teal-400 to-teal-600",
  },
  {
    id: 2,
    title: "Annual Conference 2024",
    color: "bg-gradient-to-br from-blue-400 to-blue-600",
  },
  {
    id: 3,
    title: "Community Support Meeting",
    color: "bg-gradient-to-br from-green-400 to-green-600",
  },
  {
    id: 4,
    title: "Volunteer Recognition Event",
    color: "bg-gradient-to-br from-purple-400 to-purple-600",
  },
  {
    id: 5,
    title: "Medical Symposium 2024",
    color: "bg-gradient-to-br from-orange-400 to-orange-600",
  },
  {
    id: 6,
    title: "Patient Advocacy Workshop",
    color: "bg-gradient-to-br from-pink-400 to-pink-600",
  },
  {
    id: 7,
    title: "World MG Day Celebration",
    color: "bg-gradient-to-br from-cyan-400 to-cyan-600",
  },
  {
    id: 8,
    title: "Research Partnership Signing",
    color: "bg-gradient-to-br from-indigo-400 to-indigo-600",
  },
]

export function MediaGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (id: number) => setSelectedImage(id)
  const closeLightbox = () => setSelectedImage(null)
  
  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return
    const currentIndex = galleryImages.findIndex((img) => img.id === selectedImage)
    if (direction === "prev") {
      const newIndex = currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
      setSelectedImage(galleryImages[newIndex].id)
    } else {
      const newIndex = currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
      setSelectedImage(galleryImages[newIndex].id)
    }
  }

  const selectedImageData = galleryImages.find((img) => img.id === selectedImage)

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-600">
            Photo Gallery
          </h2>
          <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
            View All Photos
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {galleryImages.map((image) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image.id)}
              className={`${image.color} aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end p-3">
                <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedImage !== null && selectedImageData && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Close lightbox"
            >
              <X size={32} />
            </button>

            <button
              onClick={() => navigateImage("prev")}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={40} />
            </button>

            <div className="max-w-4xl w-full">
              <div className={`${selectedImageData.color} aspect-video rounded-lg`} />
              <p className="text-white text-center mt-4 text-lg">{selectedImageData.title}</p>
            </div>

            <button
              onClick={() => navigateImage("next")}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={40} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
