"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { MediaGalleryItem } from "@/lib/publicContent"

interface MediaGalleryProps {
  title: string
  viewAllLabel: string
  images: MediaGalleryItem[]
}

export function MediaGallery({ title, viewAllLabel, images }: MediaGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const openLightbox = (id: number) => setSelectedImage(id)
  const closeLightbox = () => setSelectedImage(null)
  
  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return
    const currentIndex = images.findIndex((img) => img.id === selectedImage)
    if (direction === "prev") {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
      setSelectedImage(images[newIndex].id)
    } else {
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
      setSelectedImage(images[newIndex].id)
    }
  }

  const selectedImageData = images.find((img) => img.id === selectedImage)

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--theme-title-text,var(--primary))]">
            {title}
          </h2>
          <Button variant="outline" className="border-primary text-primary hover:bg-secondary/50">
            {viewAllLabel}
          </Button>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <button
              key={image.id}
              onClick={() => openLightbox(image.id)}
              className={`${image.colorClass} aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity relative group`}
            >
              {image.imageUrl && (
                <img src={image.imageUrl} alt={image.title} className="h-full w-full object-cover" />
              )}
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
              <div className={`${selectedImageData.colorClass} aspect-video overflow-hidden rounded-lg`}>
                {selectedImageData.imageUrl && (
                  <img src={selectedImageData.imageUrl} alt={selectedImageData.title} className="h-full w-full object-contain" />
                )}
              </div>
              <p className="text-white text-center mt-4 text-lg">{selectedImageData.title}</p>
              {selectedImageData.description && (
                <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-white/75">{selectedImageData.description}</p>
              )}
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
