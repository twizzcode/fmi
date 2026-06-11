import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export default function AnimatedTestimonialsDemo() {
  const testimonials = [
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
  ];
  return <AnimatedTestimonials testimonials={testimonials} autoplay />;
}
