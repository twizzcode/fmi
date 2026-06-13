import { connection } from "next/server"

import { AnimatedTestimonials } from "@/components/ui/animated-testimonials"
import { getTestimonialsWithImageUrls } from "@/lib/testimonials"

const fallbackTestimonials = [
  {
    quote:
      "FMI jadi tempat yang bikin saya merasa tidak sendiri. Di sini saya belajar menjaga semangat ibadah, bertumbuh dalam diskusi, dan punya teman seperjalanan yang saling menguatkan.",
    name: "Aulia Rahmah",
    designation: "Mahasiswi FMIPA dan anggota pembinaan",
    src: "/images/foto bersama.jpg",
  },
  {
    quote:
      "Lewat FMI, saya menemukan ruang yang sehat untuk belajar organisasi sekaligus memperbaiki diri. Kegiatannya hangat, orang-orangnya terbuka, dan prosesnya terasa bertahap.",
    name: "Fadhil Maulana",
    designation: "Mahasiswa FMIPA dan pengurus departemen",
    src: "/images/foto bersama.jpg",
  },
  {
    quote:
      "Yang paling saya rasakan dari FMI adalah ukhuwahnya. Ada banyak ruang untuk bertanya, belajar, dan bergerak bersama tanpa merasa dihakimi.",
    name: "Nanda Prasetyo",
    designation: "Mahasiswa baru FMIPA",
    src: "/images/foto bersama.jpg",
  },
]

export default async function AnimatedTestimonialsDemo() {
  await connection()

  const testimonialsFromDb = await getTestimonialsWithImageUrls().catch(
    () => []
  )

  const testimonialsFromDbWithImages = testimonialsFromDb
    .filter((item) => item.imageUrl)
    .map((item) => ({
      quote: item.quote,
      name: item.name,
      designation: item.designation,
      src: item.imageUrl ?? "/images/foto bersama.jpg",
    }))

  const testimonials =
    testimonialsFromDbWithImages.length > 0
      ? testimonialsFromDbWithImages
      : fallbackTestimonials

  return <AnimatedTestimonials testimonials={testimonials} autoplay />
}
