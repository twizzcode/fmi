"use server"

import { randomUUID } from "node:crypto"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

import { auth, getSessionUserRole } from "@/lib/auth"
import { db, schema } from "@/lib/db"
import { uploadImageToStorage } from "@/lib/supabase/storage"

export type TestimonialSubmissionActionState = {
  error: string | null
  success: string | null
}

type ParsedTestimonialFields =
  | TestimonialSubmissionActionState
  | {
      name: string
      designation: string
      quote: string
      image: FormDataEntryValue | null
    }

export async function submitTestimonialAction(
  _previousState: TestimonialSubmissionActionState,
  formData: FormData
): Promise<TestimonialSubmissionActionState> {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({
    headers: requestHeaders,
  })

  if (!session) {
    return { error: "Anda harus login untuk mengajukan testimoni.", success: null }
  }

  const parsed = parseTestimonialFields(formData)
  if (isTestimonialSubmissionActionState(parsed)) return parsed

  if (!(parsed.image instanceof File) || parsed.image.size === 0) {
    return {
      error: "Foto wajib diunggah.",
      success: null,
    }
  }

  try {
    const imagePath = await uploadImageToStorage({
      file: parsed.image,
      folder: "testimonials",
    })

    await db.insert(schema.testimonials).values({
      id: randomUUID(),
      userId: session.user.id,
      name: parsed.name,
      designation: parsed.designation,
      quote: parsed.quote,
      imagePath,
      status: "pending",
    })

    revalidatePath("/tambah-konten")
    revalidatePath("/testimoni")

    return {
      error: null,
      success: "Testimoni berhasil diajukan dan menunggu persetujuan admin.",
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Gagal mengajukan testimoni.",
      success: null,
    }
  }
}

function parseTestimonialFields(formData: FormData): ParsedTestimonialFields {
  const name = formData.get("name")
  const designation = formData.get("designation")
  const quote = formData.get("quote")
  const image = formData.get("image")

  if (typeof name !== "string" || !name.trim()) {
    return { error: "Nama wajib diisi.", success: null }
  }

  if (typeof designation !== "string" || !designation.trim()) {
    return { error: "Jabatan wajib diisi.", success: null }
  }

  if (typeof quote !== "string" || !quote.trim()) {
    return { error: "Testimoni wajib diisi.", success: null }
  }

  return {
    name: name.trim(),
    designation: designation.trim(),
    quote: quote.trim(),
    image,
  }
}

function isTestimonialSubmissionActionState(
  value: ParsedTestimonialFields
): value is TestimonialSubmissionActionState {
  return "error" in value
}
