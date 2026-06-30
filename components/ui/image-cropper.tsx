import Image from "next/image"
import React, { type SyntheticEvent } from "react"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop"
import { CropIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"

import "react-image-crop/dist/ReactCrop.css"

interface ImageCropperProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  selectedFile: File | null
  onCropComplete: (croppedFile: File) => void
  aspect?: number
  triggerButton?: React.ReactNode
}

export function ImageCropper({
  dialogOpen,
  setDialogOpen,
  selectedFile,
  onCropComplete,
  aspect = 1,
  triggerButton,
}: ImageCropperProps) {
  const imgRef = React.useRef<HTMLImageElement | null>(null)
  const [crop, setCrop] = React.useState<Crop>()
  const [completedCrop, setCompletedCrop] = React.useState<PixelCrop>()
  const preview = React.useMemo(
    () => (selectedFile ? URL.createObjectURL(selectedFile) : ""),
    [selectedFile]
  )

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget
      setCrop(centerAspectCrop(width, height, aspect))
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY

    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      )
    }

    return canvas.toDataURL("image/jpeg", 0.95)
  }

  async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    return new File([blob], fileName, { type: "image/jpeg" })
  }

  async function onCrop() {
    if (imgRef.current && completedCrop && completedCrop.width && completedCrop.height) {
      try {
        const croppedImageUrl = getCroppedImg(imgRef.current, completedCrop)
        const croppedFile = await dataUrlToFile(
          croppedImageUrl,
          selectedFile?.name || "cropped-image.jpg"
        )
        onCropComplete(croppedFile)
        setDialogOpen(false)
      } catch (error) {
        console.error("Crop error:", error)
      }
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="w-[min(92vw,56rem)] max-w-[56rem] rounded-2xl p-0">
        <VisuallyHidden>
          <DialogTitle>Potong Gambar</DialogTitle>
        </VisuallyHidden>
        <div className="bg-white p-6">
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-900">Potong Gambar</p>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Atur area crop dulu sebelum foto dipakai.
            </p>
          </div>
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <div className="flex items-center justify-center p-3 sm:p-4">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="mx-auto w-fit max-w-full"
              >
                {preview ? (
                  <img
                    ref={imgRef}
                    alt="Crop preview"
                    src={preview}
                    onLoad={onImageLoad}
                    className="block max-h-[min(52svh,32rem)] max-w-full object-contain"
                  />
                ) : (
                  <div className="flex h-[320px] w-full min-w-[260px] items-center justify-center text-sm text-slate-400">
                    Preview tidak tersedia
                  </div>
                )}
              </ReactCrop>
            </div>
            <div className="border-t border-slate-200 px-3 py-3 text-xs text-slate-600">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {selectedFile?.name || "Gambar baru"}
                  </p>
                  <p className="mt-1 leading-5 text-slate-500">
                    Sesuaikan crop, lalu lanjut pakai foto ini.
                  </p>
                </div>
                {preview ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image
                      src={preview}
                      alt={selectedFile?.name || "Preview gambar"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="reset" variant="outline">
                <Trash2Icon className="mr-2 size-4" />
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#3f679c] text-white hover:bg-[#355887]"
              onClick={onCrop}
            >
              <CropIcon className="mr-2 size-4" />
              Pakai Foto Ini
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  )
}
