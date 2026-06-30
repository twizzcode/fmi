"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type User = {
  id: string
  name: string
  email: string
  image: string | null
  role: string
}

export function UpdateProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(user.name)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user.image)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("name", name)
      if (imageFile) {
        formData.append("image", imageFile)
      }

      const response = await fetch("/api/admin/profile", {
        method: "PATCH",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      toast.success("Profil berhasil diupdate")
      router.refresh()
    } catch (error) {
      toast.error("Gagal mengupdate profil")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={previewUrl || undefined} />
          <AvatarFallback>
            <UserIcon className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Label htmlFor="image">Foto Profil</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
          <p className="mt-1 text-sm text-slate-500">
            Format: JPG, PNG (Max 2MB)
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nama Lengkap</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="bg-slate-50"
        />
        <p className="text-sm text-slate-500">Email tidak dapat diubah</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          value={user.role}
          disabled
          className="bg-slate-50 capitalize"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  )
}
