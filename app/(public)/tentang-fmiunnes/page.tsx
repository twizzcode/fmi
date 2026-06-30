import type { Metadata } from "next"
import Image from "next/image";
import { Industries1 } from "@/components/industries1";
import { PageHero } from "@/components/page-hero";
import { Testimonial10 } from "@/components/testimonial10";
import { departmentProfiles, siteStats } from "@/lib/site-data";

const departmentIcons = {
  "Pengurus Harian": "users",
  Syiar: "megaphone",
  Kaderisasi: "shield-check",
  "Dewan Kemakmuran Masjid": "mosque",
  Hujanmed: "camera",
  Annisa: "venus",
  "Dana Sosial": "heart-handshake",
  Pembinaan: "book-open",
} as const;

const departmentDetails = {
  "Pengurus Harian":
    "Pengurus Harian berperan menjaga arah umum organisasi, memastikan koordinasi antardepartemen berjalan rapi, dan membantu setiap program FMI tetap selaras dengan tujuan besar dakwah kampus. Departemen ini juga menjadi titik penghubung utama dalam pengambilan keputusan, ritme kerja harian, dan penguatan kultur organisasi.",
  Syiar:
    "Departemen Syiar fokus pada penyebaran pesan, nilai, dan semangat kebaikan melalui pendekatan yang dekat dengan mahasiswa. Perannya bukan hanya menyampaikan informasi, tetapi juga membangun atmosfer dakwah yang relevan, komunikatif, dan membumi di lingkungan fakultas.",
  Kaderisasi:
    "Kaderisasi bertugas mengelola proses pembinaan awal, penjaringan potensi, dan penguatan karakter anggota agar tumbuh secara bertahap. Departemen ini memastikan setiap anggota memiliki ruang belajar, arah perkembangan, dan pengalaman berproses yang sehat di FMI.",
  "Dewan Kemakmuran Masjid":
    "Dewan Kemakmuran Masjid menghidupkan masjid sebagai pusat ibadah, pembinaan, dan titik temu aktivitas mahasiswa muslim. Fokus utamanya adalah menjaga agar masjid tidak hanya ramai dalam kegiatan ritual, tetapi juga aktif sebagai ruang kebersamaan dan penguatan nilai-nilai Islam.",
  Hujanmed:
    "Hujanmed mengelola wajah media FMI melalui desain, dokumentasi, publikasi, dan pengemasan pesan organisasi. Departemen ini membantu setiap program FMI tampil lebih kuat, lebih terarsip dengan baik, dan lebih mudah menjangkau mahasiswa melalui komunikasi visual yang konsisten.",
  Annisa:
    "Annisa menjadi ruang penguatan muslimah di FMI melalui pembinaan, kebersamaan, dan agenda yang suportif. Departemen ini berupaya menghadirkan lingkungan yang nyaman bagi mahasiswi untuk bertumbuh, berdiskusi, dan mengambil peran dalam gerakan dakwah kampus.",
  "Dana Sosial":
    "Dana Sosial bergerak dalam pengelolaan kepedulian dan dukungan sosial, baik untuk kebutuhan internal maupun aksi kemanusiaan yang lebih luas. Departemen ini menjadi wujud bahwa FMI tidak hanya bergerak dalam gagasan, tetapi juga hadir dalam kepedulian nyata dan kebermanfaatan langsung.",
  Pembinaan:
    "Pembinaan mendampingi proses tumbuh anggota melalui mentoring, penguatan karakter, dan suasana belajar yang terarah. Departemen ini membantu memastikan bahwa perjalanan anggota di FMI tidak berhenti pada partisipasi kegiatan, tetapi benar-benar menjadi proses pembentukan diri yang berkelanjutan.",
} as const;

const departmentModalContent = {
  "Pengurus Harian": {
    detailParagraphs: [
      "Pengurus Harian atau PH adalah bagian inti dalam FMI FMIPA UNNES yang berperan dalam mengarahkan, mengoordinasikan, dan menjaga jalannya kepengurusan secara keseluruhan. PH hadir sebagai pusat koordinasi agar setiap departemen dapat bergerak selaras dengan visi, tujuan, dan arah gerak FMI.",
      "Melalui berbagai kegiatan, Pengurus Harian berfokus pada penyusunan program kerja, evaluasi kepengurusan, penguatan ukhuwah internal, pengelolaan administrasi dan keuangan, serta penjagaan komunikasi antar fungsionaris. PH juga menjadi ruang untuk membahas kendala organisasi, mencari solusi bersama, dan memastikan setiap agenda berjalan dengan baik.",
      "Program kerja Pengurus Harian meliputi Musyawarah Kerja, LPJ TP, dan Musyawarah Akhir. Selain itu, terdapat agenda seperti Syuro PH, Syuro PH+, Birthday For U, Silmi, Apresiasi Staff, PH Jalan-Jalan, Ukhuwah Nexus, Tongkrongan MBA, Akhwat Time, Pengarsipan, Pengelolaan Infaq, Reminder Kas, Dauroh SekBend, Rekapan Bulanan, FMI Timeline, Salam Ukhuwah, GERAM, Pendelegasian, dan Akhwat 911. Melalui program dan agenda tersebut, PH berupaya menjaga keberjalanan organisasi agar tetap tertata, harmonis, dan penuh kebermanfaatan.",
    ],
  },
  Syiar: {
    detailParagraphs: [
      "Departemen Syi'ar adalah departemen di FMI FMIPA UNNES yang berfokus pada penyebaran nilai-nilai Islam di lingkungan fakultas. Departemen ini hadir sebagai wadah dakwah yang mengajak mahasiswa untuk saling mengingatkan dalam kebaikan, mempererat ukhuwah, dan bertumbuh bersama dalam suasana yang positif.",
      "Melalui berbagai kegiatan, Syi'ar berusaha menghadirkan dakwah yang dekat dengan kehidupan mahasiswa, tidak terasa jauh atau kaku, tetapi hadir lewat acara keislaman, konten dakwah, diskusi santai, dan momen kebersamaan yang relevan dengan keseharian mahasiswa FMIPA.",
      "Program dan agenda Departemen Syi'ar meliputi MIPA Ifthar, MIPA Bersholawat, Syuro Internal, Gen Z Series, United in Syi'ar, INTEN, dan ORDAL. Lewat rangkaian program tersebut, Syi'ar berupaya menjadi ruang dakwah yang hangat, kreatif, dan bermanfaat, baik bagi mahasiswa FMIPA maupun masyarakat umum.",
    ],
  },
  Pembinaan: {
    detailParagraphs: [
      "Departemen Pembinaan adalah departemen di FMI FMIPA UNNES yang berfokus pada pembinaan ruhiyah, fikriyah, dan ukhuwah mahasiswa muslim FMIPA. Departemen ini hadir sebagai ruang untuk menjaga semangat kebaikan, memperkuat pemahaman keislaman, serta membangun lingkungan yang saling menguatkan.",
      "Melalui berbagai kegiatan, Pembinaan berusaha membersamai mahasiswa agar tidak hanya aktif secara organisasi, tetapi juga terus bertumbuh secara pribadi dan spiritual. Kegiatannya dikemas dalam bentuk mentoring, kajian, forum diskusi, koordinasi antar LDJ, hingga reminder amalan harian.",
      "Program kerja Departemen Pembinaan meliputi LABAIK atau Lingkaran Kebaikan dan MENTARI atau Mentoring and Friends. Selain itu, terdapat agenda seperti Syuro Internal Pembinaan, Recharge Mentor, Forum PSDM LDJ, dan Reminder Qalbu by FMI. Melalui program-program tersebut, Pembinaan menjadi wadah penjagaan, penguatan, dan pendampingan bagi fungsionaris FMI, LDJ, serta mahasiswa muslim FMIPA.",
    ],
  },
  "Dewan Kemakmuran Masjid": {
    detailParagraphs: [
      "Departemen Kemakmuran Masjid atau DKM adalah departemen di FMI FMIPA UNNES yang berfokus pada pengelolaan, perawatan, dan pemakmuran Mushola Baitul Alim atau MBA. Departemen ini hadir untuk menjaga agar MBA tidak hanya menjadi tempat ibadah, tetapi juga ruang yang nyaman untuk meningkatkan ruhiyah dan mempererat ukhuwah warga muslim FMIPA.",
      "Melalui berbagai kegiatan, DKM berusaha menghidupkan suasana masjid dengan program ibadah, kajian, pengelolaan inventaris, serta ruang aspirasi bagi warga FMIPA. Selain itu, DKM juga berperan dalam menjaga kebersihan dan kenyamanan MBA agar dapat digunakan dengan baik oleh mahasiswa maupun fungsionaris FMI.",
      "Program kerja Departemen Kemakmuran Masjid meliputi Khotmil Qur'an, Dauroh Series, Inventarisasi & Piket MBA, dan Serap Aspirasi. Selain itu, terdapat agenda seperti Syuro Departemen dan Al-Kahfi Time. Melalui program-program tersebut, DKM berupaya menjadi penggerak dalam memakmurkan masjid, memperkuat nilai ibadah, serta menciptakan lingkungan yang nyaman dan bermanfaat bagi warga muslim FMIPA.",
    ],
  },
  Annisa: {
    detailParagraphs: [
      "Departemen Annisa adalah departemen di FMI FMIPA UNNES yang berfokus pada pembinaan, pengembangan, dan pemberdayaan muslimah. Departemen ini hadir sebagai ruang bagi mahasiswi muslimah untuk belajar, berbagi, berkarya, serta saling menguatkan dalam kebaikan.",
      "Melalui berbagai kegiatan, Annisa berusaha menghadirkan wadah yang nyaman untuk meningkatkan keilmuan, kreativitas, keterampilan, dan ukhuwah antar muslimah. Kegiatannya dikemas dalam bentuk kajian, podcast, pelatihan, talkshow kemuslimahan, pengelolaan media dakwah, hingga agenda kebersamaan antar akhwat.",
      "Program kerja Departemen Annisa meliputi Annisa In Creation (AIC), RABBANI atau Ruang Akhwat Berbagi dan Belajar Islami, dan Muslimah Big Event (MBE). Selain itu, terdapat agenda seperti Sesi Internal, Discuss with Annisa, Ruang Online, dan GengZ Series. Melalui program-program tersebut, Annisa berupaya menjadi wadah muslimah untuk terus bertumbuh, menginspirasi, dan berkontribusi dalam lingkungan FMI maupun FMIPA.",
    ],
  },
  Kaderisasi: {
    detailParagraphs: [
      "Departemen Kaderisasi adalah departemen di FMI FMIPA UNNES yang berfokus pada pembentukan, pengembangan, dan penjagaan kader dakwah di lingkungan FMIPA. Departemen ini hadir untuk membersamai mahasiswa muslim agar memiliki semangat berorganisasi, jiwa kepemimpinan, serta kesiapan untuk berkontribusi dalam dakwah kampus.",
      "Melalui berbagai kegiatan, Kaderisasi berusaha membangun alur pembinaan yang terarah, mulai dari pengenalan kepada mahasiswa baru, penguatan karakter kader, hingga pengembangan minat dan bakat. Kegiatan yang dihadirkan tidak hanya berisi materi, tetapi juga pelatihan, forum diskusi, talkshow, mentoring, dan ruang koordinasi antar PSDM LDJ.",
      "Program kerja Departemen Kaderisasi meliputi PKMIT 2, SIMABA atau Silaturahmi Mahasiswa Baru, dan MUTION atau Muslim Scientist in Action. Selain itu, terdapat agenda seperti Forum PSDM dan K-Time atau Kaderisasi Time. Melalui program-program tersebut, Kaderisasi berupaya menjadi wadah pembentukan kader dakwah yang aktif, berkarakter, dan siap memberikan kebermanfaatan bagi FMI, LDJ, maupun mahasiswa muslim FMIPA.",
    ],
  },
  Hujanmed: {
    detailParagraphs: [
      "Departemen Hujanmed atau Humas, Jaringan, dan Media adalah departemen di FMI FMIPA UNNES yang berfokus pada pengelolaan komunikasi, relasi, publikasi, serta media informasi FMI. Departemen ini hadir sebagai penghubung antara FMI dengan pihak internal maupun eksternal, sekaligus menjadi wajah FMI dalam menyampaikan informasi kepada khalayak umum.",
      "Melalui berbagai kegiatan, Hujanmed berperan dalam mengelola media sosial, website, desain, konten dakwah, dokumentasi, serta hubungan dengan alumni dan lembaga lain. Departemen ini juga membantu kebutuhan publikasi dan desain dari departemen lain agar informasi kegiatan FMI dapat tersampaikan dengan menarik, rapi, dan mudah dipahami.",
      "Program kerja Departemen Hujanmed meliputi Linkedeen, Alumni Back to FMI, dan Get to Know FMI. Selain itu, terdapat agenda seperti Manajemen Alumni, Manajemen Sosial Media, Manajemen Website, Manajemen Design dan Konten, Hujanmed Helpcenter, serta Hujanmed Deeptalk. Melalui program-program tersebut, Hujanmed berupaya memperluas jaringan, menjaga komunikasi, dan menguatkan media dakwah FMI secara kreatif dan informatif.",
    ],
  },
  "Dana Sosial": {
    detailParagraphs: [
      "Departemen Dana Sosial atau Dansos adalah departemen di FMI FMIPA UNNES yang berfokus pada pengelolaan dana, kewirausahaan, dan kegiatan sosial. Departemen ini hadir untuk membangun kemandirian organisasi sekaligus menebar kebermanfaatan bagi lingkungan sekitar.",
      "Melalui berbagai kegiatan, Dansos berperan dalam mengembangkan usaha, mengelola kas, membuka donasi, serta mengadakan kegiatan sosial yang membantu sesama. Selain itu, Dansos juga menjadi wadah bagi fungsionaris untuk belajar amanah, kerja sama, tanggung jawab, dan kepedulian sosial.",
      "Program kerja Departemen Dansos meliputi Emblemisasi, Lapak FMIPA, Ngawul, Open Donasi, dan Sharing is Caring. Selain itu, terdapat agenda seperti Forum Ilham, Forum LDJ se-FMIPA, dan Kas Dansos. Melalui program-program tersebut, Dansos berupaya menjadi departemen yang mandiri, peduli, dan bermanfaat bagi FMI maupun masyarakat sekitar.",
    ],
  },
} as const;

export const metadata: Metadata = {
  title: "Tentang FMI UNNES",
  description: "Kenali profil, visi, dan peran Forum Mahasiswa Islam FMIPA UNNES sebagai ruang pembinaan dan dakwah kampus.",
  alternates: {
    canonical: "/tentang-fmiunnes",
  },
}

export default function AboutPage() {
  return (
    <div className="bg-[var(--muted)]">
      <PageHero
        eyebrow="Tentang FMI"
        title="Wadah Dakwah dan Tumbuh Bersama Mahasiswa FMIPA"
        description="Mengenal lebih dekat Forum Mahasiswa Islam FMIPA UNNES sebagai ruang pembinaan, kolaborasi, dan pengembangan diri."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[var(--secondary)]">
              Apa itu FMI?
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Wadah dakwah fakultas yang hadir sebagai ruang bertumbuh, belajar,
              dan berproses bersama.
            </h2>
            <p className="text-base leading-8 text-slate-600 md:text-lg">
              FMI atau Forum Mahasiswa Islam adalah lembaga dakwah tingkat
              fakultas yang hadir sebagai wadah bagi mahasiswa muslim untuk
              bersama-sama mensyiarkan nilai-nilai Islam di lingkungan kampus,
              khususnya di tingkat fakultas. FMI bukan hanya sekadar organisasi,
              tetapi juga ruang bertumbuh, belajar, dan berproses menjadi pribadi
              yang lebih baik, baik secara spiritual, intelektual, maupun sosial.
            </p>
            <p className="text-base leading-8 text-slate-600 md:text-lg">
              Melalui FMI, mahasiswa diajak untuk ikut mengambil peran dalam
              menyebarkan kebaikan, saling mengingatkan, dan menciptakan
              lingkungan kampus yang lebih islami, positif, dan bermanfaat.
            </p>
          </div>

          <div className="flex items-center">
            <div className="w-full">
              <div className="flex justify-center">
                <Image
                  src="/images/logo-fmi-hitam.png"
                  alt="Logo FMI"
                  width={360}
                  height={360}
                  className="h-auto w-56 md:w-64"
                />
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--secondary)]">
                Sekilas FMI
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {siteStats.map((item) => (
                  <div
                    key={item.label}
                    className="border-b border-slate-200 px-2 pb-4 text-center sm:px-4"
                  >
                    <div className="text-3xl font-bold text-slate-900 md:text-4xl">
                      {item.value}
                    </div>
                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Testimonial10
            className="py-16 md:py-20"
            quote="Dan hendaklah di antara kamu ada segolongan orang yang menyeru kepada kebajikan, menyuruh kepada yang makruf, dan mencegah dari yang mungkar. Mereka itulah orang-orang yang beruntung."
            author={{
              name: "QS. Ali 'Imran: 104",
              role: "Landasan dakwah yang mengingatkan bahwa menyeru pada kebaikan adalah tugas bersama.",
            }}
          />
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--primary)]">
              Mentoring
            </p>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Program pendampingan yang membantu mahasiswa baru bertumbuh dalam
              lingkungan yang suportif.
            </h3>
            <div className="mt-8 space-y-4 text-base leading-8 text-slate-600 md:text-lg">
              <p>
                Salah satu program unggulan FMI adalah mentoring. Program ini
                cocok banget untuk teman-teman yang baru masuk dunia perkuliahan
                dan merasa butuh lingkungan yang baik, teman-teman yang saling
                mendukung, serta tempat untuk bertumbuh bersama.
              </p>
              <p>
                Dalam mentoring, teman-teman tidak berjalan sendiri, karena akan
                ada mentor yang mendampingi, membimbing, dan menjadi teman
                diskusi dalam berbagai hal, mulai dari keislaman, kehidupan
                kampus, hingga pengembangan diri.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] md:min-h-[440px]">
              <Image
                src="/images/foto bersama.jpg"
                alt="Kegiatan mentoring FMI"
                fill
                className="object-cover object-[36%_center]"
              />
            </div>

            <div className="grid gap-4">
              <div className="relative min-h-[160px] overflow-hidden rounded-[1.75rem] md:min-h-[212px]">
                <Image
                  src="/images/foto bersama.jpg"
                  alt="Suasana mentoring FMI"
                  fill
                  className="object-cover object-[72%_24%]"
                />
              </div>
              <div className="relative min-h-[160px] overflow-hidden rounded-[1.75rem] md:min-h-[212px]">
                <Image
                  src="/images/foto bersama.jpg"
                  alt="Kebersamaan peserta mentoring FMI"
                  fill
                  className="object-cover object-[68%_78%]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.98fr_1.02fr]">
          <div className="order-2 grid gap-4 md:grid-cols-[0.92fr_1.08fr] lg:order-1">
            <div className="grid gap-4">
              <div className="relative min-h-[160px] overflow-hidden rounded-[1.75rem] md:min-h-[212px]">
                <Image
                  src="/images/foto bersama.jpg"
                  alt="Aktivitas pengembangan soft skills FMI"
                  fill
                  className="object-cover object-[18%_28%]"
                />
              </div>
              <div className="relative min-h-[160px] overflow-hidden rounded-[1.75rem] md:min-h-[212px]">
                <Image
                  src="/images/foto bersama.jpg"
                  alt="Kerja sama tim di FMI"
                  fill
                  className="object-cover object-[52%_82%]"
                />
              </div>
            </div>

            <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem] md:min-h-[440px]">
              <Image
                src="/images/foto bersama.jpg"
                alt="Pengembangan soft skills mahasiswa di FMI"
                fill
                className="object-cover object-[84%_center]"
              />
            </div>
          </div>

          <div className="order-1 max-w-2xl lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--secondary)]">
              Soft Skills
            </p>
            <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              FMI juga menjadi tempat belajar berorganisasi dan mengasah banyak
              kemampuan penting.
            </h3>
            <div className="mt-8 space-y-4 text-base leading-8 text-slate-600 md:text-lg">
              <p>
                Karena FMI adalah organisasi, teman-teman bisa mengembangkan
                berbagai soft skills, seperti komunikasi, kepemimpinan,
                manajemen waktu, public speaking, kerja sama tim, problem
                solving, hingga kemampuan mengelola acara dan kepanitiaan.
              </p>
              <p>
                Semua proses itu menjadi bekal penting, bukan hanya selama
                kuliah, tetapi juga untuk kehidupan setelahnya. Di FMI,
                teman-teman bisa menemukan lingkungan yang insyaAllah baik,
                teman-teman yang saling menguatkan, dan kesempatan untuk terus
                belajar menjadi pribadi yang lebih bermanfaat.
              </p>
              <p>
                Karena sejatinya, dakwah bukan hanya tentang menyampaikan,
                tetapi juga tentang bertumbuh bersama dalam kebaikan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 md:py-24">
        <Industries1
          className="py-0"
          title="Pengenalan Setiap Departemen FMI"
          description="Setiap departemen di FMI memiliki fokus kerja yang berbeda, tetapi semuanya bergerak dalam arah yang sama: menguatkan dakwah, pembinaan, dan kebermanfaatan bagi mahasiswa."
          ctaLabel="Lihat Struktur"
          ctaHref="/struktur"
          industryLabel="Peran"
          industries={departmentProfiles.map((department) => ({
            name: department.name,
            description: department.description,
            detail:
              departmentDetails[
                department.name as keyof typeof departmentDetails
              ],
            detailParagraphs:
              departmentModalContent[
                department.name as keyof typeof departmentModalContent
              ]?.detailParagraphs,
            icon: departmentIcons[department.name as keyof typeof departmentIcons],
          }))}
        />
      </section>
    </div>
  );
}
