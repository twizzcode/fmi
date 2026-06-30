"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function ImageAdjustDialog({
  open,
  title,
  description,
  previewUrl,
  objectPositionX,
  objectPositionY,
  zoom,
  aspectClassName = "aspect-square",
  onChangeX,
  onChangeY,
  onChangeZoom,
  onConfirm,
  onCancel,
  confirmLabel = "Pakai Gambar Ini",
}: {
  open: boolean
  title: string
  description: string
  previewUrl: string
  objectPositionX: number
  objectPositionY: number
  zoom: number
  aspectClassName?: string
  onChangeX: (value: number) => void
  onChangeY: (value: number) => void
  onChangeZoom: (value: number) => void
  onConfirm: () => void
  onCancel: () => void
  confirmLabel?: string
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onCancel()
        }
      }}
    >
      {open ? (
        <DialogContent className="sm:!max-w-3xl rounded-2xl p-0">
          <div className="bg-white p-6">
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
            </DialogHeader>

            <div className="mt-6 grid gap-6 md:grid-cols-[280px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className={`relative overflow-hidden bg-slate-100 ${aspectClassName}`}>
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt={title}
                      className="h-full w-full object-cover"
                      style={{
                        objectPosition: `${objectPositionX}% ${objectPositionY}%`,
                        transform: `scale(${zoom})`,
                      }}
                    />
                  ) : null}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">
                    {description}
                  </p>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-900">
                    Posisi horizontal: {objectPositionX}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={objectPositionX}
                    onChange={(event) => onChangeX(Number(event.target.value))}
                    className="w-full"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-900">
                    Posisi vertikal: {objectPositionY}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={objectPositionY}
                    onChange={(event) => onChangeY(Number(event.target.value))}
                    className="w-full"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-900">
                    Zoom: {zoom.toFixed(2)}x
                  </span>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={zoom}
                    onChange={(event) => onChangeZoom(Number(event.target.value))}
                    className="w-full"
                  />
                </label>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onCancel}>
                Batal
              </Button>
              <Button
                type="button"
                className="bg-[#3f679c] text-white hover:bg-[#355887]"
                onClick={onConfirm}
              >
                {confirmLabel}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
