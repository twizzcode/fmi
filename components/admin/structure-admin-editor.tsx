"use client"

import type { ReactNode } from "react"
import { useState } from "react"
import Image from "next/image"
import {
  ImageUpIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  Users2,
  UserRound,
  Venus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageCropper } from "@/components/ui/image-cropper"
import {
  saveStructureAction,
  type StructureActionState,
} from "@/app/(admin)/admin-space/pengurus/actions"
import { departmentProfiles } from "@/lib/site-data"

type Gender = "ikhwan" | "akhwat"

type StructureMember = {
  id: string
  name: string
  nickname: string
  position: string
  program: string
  entryYear: string
  gender: Gender
  quote: string
  photoPath: string
  photoPreviewUrl?: string
  pendingPhotoFile?: File | null
  instagram?: string
  linkedin?: string
  github?: string
  website?: string
  tiktok?: string
  youtube?: string
}

type DepartmentEditorState = {
  department: string
  members: StructureMember[]
}

type CabinetEditorState = {
  id: string
  orderLabel: string
  name: string
  theme: string
  logoPath: string
  logoPreviewUrl?: string
  pendingLogoFile?: File | null
  philosophy: string
  isDefault: boolean
  sections: DepartmentEditorState[]
}

const departmentNames = departmentProfiles.map((department) => department.name)
const positionOptions = [
  "Kepala Departemen",
  "Sekretaris Departemen",
  "Staf Ahli",
] as const
const studyProgramOptions = [
  "S1 Matematika",
  "S1 Pendidikan Matematika",
  "D3 Statistika Terapan dan Komputasi",
  "S1 Fisika",
  "S1 Pendidikan Fisika",
  "S1 Kimia",
  "S1 Pendidikan Kimia",
  "S1 Biologi",
  "S1 Pendidikan Biologi",
  "S1 Pendidikan Ilmu Pengetahuan Alam (IPA)",
  "S1 Ilmu Lingkungan",
  "S1 Teknik Informatika",
  "S1 Sistem Informasi",
] as const

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

function makeUuid() {
  if (
    typeof globalThis !== "undefined" &&
    "crypto" in globalThis &&
    typeof globalThis.crypto?.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function getCabinetYear(cabinet: CabinetEditorState) {
  const match = cabinet.name.match(/\b(20\d{2})\b/)
  return match ? Number(match[1]) : new Date().getFullYear()
}

function makeMemberId(department: string, seed?: string) {
  return `${slugify(department)}-${seed ?? makeUuid()}`
}

function createBlankMember(department: string): StructureMember {
  return {
    id: makeMemberId(department),
    name: "",
    nickname: "",
    position: "",
    program: "",
    entryYear: "",
    gender: "ikhwan",
    quote: "",
    photoPath: "",
    photoPreviewUrl: "",
    pendingPhotoFile: null,
    instagram: "",
    linkedin: "",
    github: "",
    website: "",
    tiktok: "",
    youtube: "",
  }
}

const initialActionState: StructureActionState = {
  error: null,
  success: null,
  payload: null,
}

export function StructureAdminEditor({
  initialCabinets = [],
}: {
  initialCabinets?: CabinetEditorState[]
}) {
  const [selectedCabinetId, setSelectedCabinetId] = useState(
    initialCabinets.find((cabinet) => cabinet.isDefault)?.id ??
      initialCabinets[0]?.id ??
      ""
  )
  const [cabinets, setCabinets] = useState(initialCabinets)
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  const [cabinetLogoError, setCabinetLogoError] = useState("")
  const [pendingMemberDelete, setPendingMemberDelete] = useState<{
    department: string
    memberId: string
    memberName: string
  } | null>(null)
  const [isSavingMember, setIsSavingMember] = useState(false)
  const [isSavingCabinet, setIsSavingCabinet] = useState(false)
  const [activeEditor, setActiveEditor] = useState<{
    department: string
    memberId: string
  } | null>(null)
  const [memberImageCropOpen, setMemberImageCropOpen] = useState(false)
  const [pendingMemberCrop, setPendingMemberCrop] = useState<{
    department: string
    memberId: string
    file: File
  } | null>(null)
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false)
  const [cabinetEditorOpen, setCabinetEditorOpen] = useState(false)
  const [dialogSaveState, setDialogSaveState] = useState(initialActionState)
  const [cabinetDialogSaveState, setCabinetDialogSaveState] = useState(initialActionState)

  const selectedCabinet =
    cabinets.find((cabinet) => cabinet.id === selectedCabinetId) ?? cabinets[0] ?? null

  if (!selectedCabinet) {
    return (
      <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
        <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
            Organisasi
          </p>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            Kelola Pengurus
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Belum ada kabinet yang tersedia. Tambahkan kabinet baru untuk mulai
            mengatur struktur pengurus FMI.
          </p>
          <Button
            type="button"
            className="mt-6 bg-[#3f679c] text-white hover:bg-[#355887]"
            onClick={() => {
              const newCabinet = createNewCabinet(1)
              setCabinets([newCabinet])
              setSelectedCabinetId(newCabinet.id)
            }}
          >
            <PlusIcon className="size-4" />
            Tambah Kabinet
          </Button>
        </section>
      </div>
    )
  }

  const members = selectedCabinet.sections.flatMap((section) => section.members)
  const totalMembers = members.length
  const ikhwanCount = members.filter((member) => member.gender === "ikhwan").length
  const akhwatCount = members.filter((member) => member.gender === "akhwat").length
  const cabinetYear = getCabinetYear(selectedCabinet)
  const entryYearOptions = [
    String(cabinetYear - 1),
    String(cabinetYear - 2),
    String(cabinetYear - 3),
  ]
  const activeMember =
    activeEditor
      ? selectedCabinet.sections
          .find((section) => section.department === activeEditor.department)
          ?.members.find((member) => member.id === activeEditor.memberId) ?? null
      : null

  function updateCabinet(updater: (cabinet: CabinetEditorState) => CabinetEditorState) {
    setCabinets((current) =>
      current.map((cabinet) =>
        cabinet.id === selectedCabinet.id ? updater(cabinet) : cabinet
      )
    )
  }

  function addCabinet() {
    const newCabinet = createNewCabinet(cabinets.length + 1)

    setCabinets((current) => [...current, newCabinet])
    setSelectedCabinetId(newCabinet.id)
  }

  function getCabinetsAfterRemovingSelectedCabinet() {
    const remainingCabinets = cabinets.filter(
      (cabinet) => cabinet.id !== selectedCabinet.id
    )

    return remainingCabinets.map((cabinet, index) => ({
      ...cabinet,
      isDefault: selectedCabinet.isDefault ? index === 0 : cabinet.isDefault,
    }))
  }

  function markCabinetAsDefault(cabinetId: string) {
    setCabinets((current) =>
      current.map((cabinet) => ({
        ...cabinet,
        isDefault: cabinet.id === cabinetId,
      }))
    )
  }

  function updateMember(
    department: string,
    memberId: string,
    field: keyof StructureMember,
    value: string
  ) {
    updateCabinet((cabinet) => ({
      ...cabinet,
      sections: cabinet.sections.map((section) =>
        section.department === department
          ? {
              ...section,
              members: section.members.map((member) =>
                member.id === memberId ? { ...member, [field]: value } : member
              ),
            }
          : section
      ),
    }))
  }

  function addMember(department: string) {
    const newMember = createBlankMember(department)
    updateCabinet((cabinet) => ({
      ...cabinet,
      sections: cabinet.sections.map((section) =>
        section.department === department
          ? {
              ...section,
              members: [...section.members, newMember],
            }
          : section
      ),
    }))
    setActiveEditor({ department, memberId: newMember.id })
  }

  function getCabinetsAfterRemovingMember(department: string, memberId: string) {
    return cabinets.map((cabinet) =>
      cabinet.id === selectedCabinet.id
        ? {
            ...cabinet,
            sections: cabinet.sections.map((section) =>
              section.department === department
                ? {
                    ...section,
                    members: section.members.filter((member) => member.id !== memberId),
                  }
                : section
            ),
          }
        : cabinet
    )
  }

  function openMemberDeleteConfirmation(department: string, member: StructureMember) {
    setPendingMemberDelete({
      department,
      memberId: member.id,
      memberName: member.name || "fungsionaris ini",
    })
  }

  async function updateMemberImage(
    department: string,
    memberId: string,
    file: File | null
  ) {
    if (!file) return
    const currentMember =
      selectedCabinet.sections
        .find((section) => section.department === department)
        ?.members.find((member) => member.id === memberId) ?? null

    if (!currentMember) return

    setPendingMemberCrop({
      department,
      memberId,
      file,
    })
    setMemberImageCropOpen(true)
  }

  async function handleMemberCropComplete(croppedFile: File) {
    if (!pendingMemberCrop) return

    const { department, memberId } = pendingMemberCrop

    setUploadErrors((current) => ({ ...current, [memberId]: "" }))

    const previewUrl = URL.createObjectURL(croppedFile)

    updateCabinet((cabinet) => ({
      ...cabinet,
      sections: cabinet.sections.map((section) =>
        section.department === department
          ? {
              ...section,
              members: section.members.map((member) =>
                member.id === memberId
                  ? {
                      ...member,
                      photoPreviewUrl: previewUrl,
                      pendingPhotoFile: croppedFile,
                    }
                  : member
              ),
            }
          : section
      ),
    }))

    setPendingMemberCrop(null)
    setMemberImageCropOpen(false)
  }

  function getPhotoPreview(member: StructureMember) {
    return normalizeImageSrc(member.photoPreviewUrl || member.photoPath)
  }

  function clearMemberImage(department: string, memberId: string) {
    setUploadErrors((current) => ({ ...current, [memberId]: "" }))
    updateCabinet((cabinet) => ({
      ...cabinet,
      sections: cabinet.sections.map((section) =>
        section.department === department
          ? {
              ...section,
              members: section.members.map((member) =>
                member.id === memberId
                  ? {
                      ...member,
                      photoPath: "",
                      photoPreviewUrl: "",
                      pendingPhotoFile: null,
                    }
                  : member
              ),
            }
          : section
      ),
    }))
  }

  async function updateCabinetLogo(file: File | null) {
    if (!file) return

    setCabinetLogoError("")
    const previewUrl = URL.createObjectURL(file)

    updateCabinet((cabinet) => ({
      ...cabinet,
      logoPreviewUrl: previewUrl,
      pendingLogoFile: file,
    }))
  }

  function clearCabinetLogo() {
    setCabinetLogoError("")
    updateCabinet((cabinet) => ({
      ...cabinet,
      logoPath: "",
      logoPreviewUrl: "",
      pendingLogoFile: null,
    }))
  }

  async function submitStructure(
    mode: "member" | "cabinet",
    nextCabinetsOverride?: CabinetEditorState[]
  ) {
    if (mode === "member") {
      setIsSavingMember(true)
      setDialogSaveState(initialActionState)
    } else {
      setIsSavingCabinet(true)
      setCabinetDialogSaveState(initialActionState)
    }

    const nextCabinets = nextCabinetsOverride ?? cabinets
    const formData = new FormData()
    formData.set("payload", serializeCabinets(nextCabinets))

    for (const cabinet of nextCabinets) {
      if (cabinet.pendingLogoFile) {
        formData.set(`cabinet-logo:${cabinet.id}`, cabinet.pendingLogoFile)
      }

      for (const section of cabinet.sections) {
        for (const member of section.members) {
          if (member.pendingPhotoFile) {
            formData.set(`member-photo:${member.id}`, member.pendingPhotoFile)
          }
        }
      }
    }

    const result = await saveStructureAction(initialActionState, formData)

    if (result.payload) {
      const nextCabinets = deserializeCabinets(result.payload)
      setCabinets(nextCabinets)

      if (!nextCabinets.some((cabinet) => cabinet.id === selectedCabinetId)) {
        setSelectedCabinetId(nextCabinets[0]?.id ?? "")
      }
    }

    if (mode === "member") {
      setDialogSaveState(result)
      if (result.success) {
        setActiveEditor(null)
      }
      setIsSavingMember(false)
    } else {
      setCabinetDialogSaveState(result)
      if (result.success) {
        setCabinetEditorOpen(false)
      }
      setIsSavingCabinet(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 bg-slate-50 p-4 md:p-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
          Organisasi
        </p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Kelola Pengurus
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Pilih kabinet, atur identitas kabinet, lalu isi fungsionaris untuk
              delapan departemen langsung dari panel ini.
            </p>
            {selectedCabinet.isDefault ? (
              <p className="mt-3 inline-flex rounded-full bg-[#dce8f6] px-3 py-1 text-xs font-semibold text-[#27466f]">
                Kabinet default yang ditampilkan
              </p>
            ) : null}
          </div>
          <div className="w-full md:max-w-sm">
            <label className="mb-2 block text-sm font-medium text-slate-900">
              Pilih kabinet
            </label>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 flex-1 justify-between px-3 font-normal text-slate-900"
                  >
                    <span className={selectedCabinet.name ? "" : "text-slate-400"}>
                      {selectedCabinet.orderLabel} ·{" "}
                      {selectedCabinet.name || "Kabinet tanpa nama"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuRadioGroup
                    value={selectedCabinetId}
                    onValueChange={setSelectedCabinetId}
                  >
                    {cabinets.map((cabinet) => (
                      <DropdownMenuRadioItem key={cabinet.id} value={cabinet.id}>
                        {cabinet.orderLabel} ·{" "}
                        {cabinet.name || "Kabinet tanpa nama"}
                        {cabinet.isDefault ? " · Default" : ""}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                type="button"
                className="h-11 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
                onClick={addCabinet}
              >
                <PlusIcon className="size-4" />
                Tambah
              </Button>
            </div>
            <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Pengaturan kabinet
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Jadikan kabinet ini sebagai default, atau hapus jika sudah
                    tidak dipakai lagi.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    type="button"
                    variant={selectedCabinet.isDefault ? "outline" : "default"}
                    className={
                      selectedCabinet.isDefault
                        ? "border-[#3f679c] text-[#3f679c]"
                        : "bg-[#3f679c] text-white hover:bg-[#355887]"
                    }
                    onClick={() => markCabinetAsDefault(selectedCabinet.id)}
                    disabled={selectedCabinet.isDefault}
                  >
                    {selectedCabinet.isDefault ? "Sudah default" : "Jadikan Default"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteAlertOpen(true)}
                  >
                    <Trash2Icon className="size-4" />
                    Hapus Kabinet
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Fungsionaris"
          value={String(totalMembers)}
          description="Jumlah pengurus aktif di kabinet yang sedang dipilih."
          icon={<Users2 className="size-5" />}
        />
        <StatCard
          label="Ikhwan"
          value={String(ikhwanCount)}
          description="Terhitung otomatis dari gender fungsionaris tiap departemen."
          icon={<UserRound className="size-5" />}
        />
        <StatCard
          label="Akhwat"
          value={String(akhwatCount)}
          description="Terhitung otomatis dari gender fungsionaris tiap departemen."
          icon={<Venus className="size-5" />}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Identitas Kabinet</h2>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Ringkasan identitas visual dan filosofi kabinet. Edit detailnya lewat
              modal agar tetap ringkas seperti pengelolaan fungsionaris.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setCabinetEditorOpen(true)}
          >
            <PencilIcon className="size-4" />
            Edit Kabinet
          </Button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(157,178,206,0.22),_transparent_60%),linear-gradient(180deg,#f8fbff_0%,#edf4fb_100%)]">
            <div className="relative aspect-square">
              {getCabinetLogoPreview(selectedCabinet) ? (
                <Image
                  src={getCabinetLogoPreview(selectedCabinet)!}
                  alt={selectedCabinet.name}
                  fill
                  className="object-contain p-10"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
                  Logo kabinet belum diisi
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
                {selectedCabinet.orderLabel || "Kabinet"}
              </p>
              <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                {selectedCabinet.name || "Kabinet tanpa nama"}
              </h3>
              <p className="mt-2 text-base font-medium text-[#45658f]">
                {selectedCabinet.theme || "Tema kabinet belum diisi"}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-sm leading-7 text-slate-600">
                {selectedCabinet.philosophy || "Filosofi kabinet belum diisi."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Departemen</h2>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Isi dan edit detail fungsionaris di setiap departemen. Jumlah ikhwan
            dan akhwat pada bagian atas akan berubah otomatis mengikuti data ini.
          </p>
        </div>

        {selectedCabinet.sections.map((section) => (
          <section
            key={section.department}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#3f679c]">
                  Departemen
                </p>
                <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
                  {section.department}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {section.members.length} fungsionaris di departemen ini.
                </p>
              </div>
              <Button
                type="button"
                className="h-10 bg-[#3f679c] px-4 text-white hover:bg-[#355887]"
                onClick={() => addMember(section.department)}
              >
                <PlusIcon className="size-4" />
                Tambah Fungsionaris
              </Button>
            </div>

            {section.members.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                  Belum ada fungsionaris
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Tambahkan anggota pertama untuk departemen {section.department}.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                          Foto
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                          Nama
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                          Jabatan
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                          Prodi
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                          Angkatan
                        </th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-700">
                          Gender
                        </th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-700">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {section.members.map((member) => (
                        <tr key={member.id} className="align-top">
                          <td className="px-4 py-3">
                            <div className="relative h-16 w-12 overflow-hidden rounded-lg bg-slate-100">
                              {getPhotoPreview(member) ? (
                                <Image
                                  src={getPhotoPreview(member)!}
                                  alt={member.name || "Foto fungsionaris"}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-[10px] text-slate-400">
                                  No foto
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-900">
                            <div className="font-medium">{member.name || "Nama belum diisi"}</div>
                            <div className="mt-1 text-xs text-slate-500">
                              {member.nickname || "Nama panggilan belum diisi"}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {member.position || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {member.program || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {member.entryYear || "-"}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {member.gender === "ikhwan" ? "Ikhwan" : "Akhwat"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setActiveEditor({
                                    department: section.department,
                                    memberId: member.id,
                                  })
                                }
                              >
                                <PencilIcon className="size-4" />
                                Edit
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                aria-label={`Hapus ${member.name || "fungsionaris"}`}
                                onClick={() => openMemberDeleteConfirmation(section.department, member)}
                              >
                                <Trash2Icon className="size-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </section>
        ))}
      </section>

      <Dialog
        open={Boolean(activeEditor && activeMember)}
        onOpenChange={(open) => {
          if (!open) setActiveEditor(null)
        }}
      >
        {activeEditor && activeMember ? (
          <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl p-0 sm:!max-w-5xl">
            <form
              className="bg-white p-6"
              onSubmit={(event) => {
                event.preventDefault()
                void submitStructure("member")
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit Fungsionaris</DialogTitle>
              </DialogHeader>

              <div className="mt-6 grid gap-6 md:grid-cols-[240px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                    <div className="relative aspect-[3/4] w-full bg-slate-100">
                      {getPhotoPreview(activeMember) ? (
                        <Image
                          src={getPhotoPreview(activeMember)!}
                          alt={activeMember.name || "Preview foto fungsionaris"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          Preview tidak tersedia
                        </div>
                      )}
                      {getPhotoPreview(activeMember) ? (
                        <button
                          type="button"
                          onClick={() =>
                            clearMemberImage(activeEditor.department, activeMember.id)
                          }
                          className="absolute top-2 right-2 inline-flex size-7 items-center justify-center rounded-full bg-black/65 text-white transition hover:bg-black/80"
                          aria-label={`Hapus foto ${activeMember.name || "fungsionaris"}`}
                        >
                          <Trash2Icon className="size-4" />
                        </button>
                      ) : null}
                    </div>
                    <div className="border-t border-slate-200 px-3 py-3 text-xs text-slate-600">
                      <p className="truncate font-medium text-slate-800">
                        {activeMember.name || "Fungsionaris baru"}
                      </p>
                      <label className="mt-2 inline-flex cursor-pointer items-center gap-2 font-medium text-[#3f679c]">
                        <ImageUpIcon className="size-4" />
                        {getPhotoPreview(activeMember)
                          ? "Upload ulang"
                          : "Upload gambar"}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={(event) =>
                            updateMemberImage(
                              activeEditor.department,
                              activeMember.id,
                              event.target.files?.[0] ?? null
                            )
                          }
                        />
                      </label>
                      <p className="mt-2 leading-5 text-slate-500">
                        Format: PNG, JPG, WEBP.
                      </p>
                      {uploadErrors[activeMember.id] ? (
                        <p className="mt-2 leading-5 text-red-600">
                          {uploadErrors[activeMember.id]}
                        </p>
                      ) : null}
                    </div>
                  </div>

                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nama">
                      <Input
                        value={activeMember.name}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "name",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="Nama panggilan">
                      <Input
                        value={activeMember.nickname}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "nickname",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Jabatan">
                      <DropdownField
                        value={activeMember.position}
                        placeholder="Pilih jabatan"
                        options={positionOptions}
                        onSelect={(value) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "position",
                            value
                          )
                        }
                      />
                    </Field>
                    <Field label="Program studi">
                      <DropdownField
                        value={activeMember.program}
                        placeholder="Pilih program studi"
                        options={studyProgramOptions}
                        onSelect={(value) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "program",
                            value
                          )
                        }
                      />
                    </Field>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[12rem_minmax(0,1fr)]">
                    <Field label="Angkatan">
                      <DropdownField
                        value={activeMember.entryYear}
                        placeholder="Pilih angkatan"
                        options={entryYearOptions}
                        onSelect={(value) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "entryYear",
                            value
                          )
                        }
                      />
                    </Field>
                    <Field label="Gender">
                      <DropdownField
                        value={activeMember.gender}
                        placeholder="Pilih gender"
                        options={["ikhwan", "akhwat"]}
                        onSelect={(value) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "gender",
                            value
                          )
                        }
                      />
                    </Field>
                  </div>

                  <Field label="Quote / catatan singkat">
                    <Textarea
                      className="min-h-28"
                      value={activeMember.quote}
                      onChange={(event) =>
                        updateMember(
                          activeEditor.department,
                          activeMember.id,
                          "quote",
                          event.target.value
                        )
                      }
                    />
                  </Field>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Instagram">
                      <Input
                        value={activeMember.instagram ?? ""}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "instagram",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="LinkedIn">
                      <Input
                        value={activeMember.linkedin ?? ""}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "linkedin",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="GitHub">
                      <Input
                        value={activeMember.github ?? ""}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "github",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="Website">
                      <Input
                        value={activeMember.website ?? ""}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "website",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="TikTok">
                      <Input
                        value={activeMember.tiktok ?? ""}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "tiktok",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                    <Field label="YouTube">
                      <Input
                        value={activeMember.youtube ?? ""}
                        onChange={(event) =>
                          updateMember(
                            activeEditor.department,
                            activeMember.id,
                            "youtube",
                            event.target.value
                          )
                        }
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveEditor(null)}
                >
                  Batal
                </Button>
                 <SaveMemberButton pending={isSavingMember} />

              </DialogFooter>
              {dialogSaveState.error ? (
                <p className="mt-3 text-sm text-red-600">{dialogSaveState.error}</p>
              ) : null}
              {dialogSaveState.success ? (
                <p className="mt-3 text-sm text-emerald-600">
                  {dialogSaveState.success}
                </p>
              ) : null}
            </form>
          </DialogContent>
        ) : null}
      </Dialog>

      <Dialog open={cabinetEditorOpen} onOpenChange={setCabinetEditorOpen}>
        {cabinetEditorOpen ? (
          <DialogContent className="max-h-[calc(100svh-2rem)] overflow-y-auto rounded-2xl p-0 sm:!max-w-5xl">
            <form
              className="bg-white p-6"
              onSubmit={(event) => {
                event.preventDefault()
                void submitStructure("cabinet")
              }}
            >
              <DialogHeader>
                <DialogTitle>Edit Kabinet</DialogTitle>
              </DialogHeader>

              <div className="mt-6 grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <div className="relative aspect-square bg-slate-100">
                      {getCabinetLogoPreview(selectedCabinet) ? (
                        <Image
                          src={getCabinetLogoPreview(selectedCabinet)!}
                          alt={selectedCabinet.name || "Preview logo kabinet"}
                          fill
                          className="object-contain p-8"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-slate-400">
                          Logo kabinet belum diisi
                        </div>
                      )}
                    </div>
                    <div className="border-t border-slate-200 p-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[#3f679c]">
                        <ImageUpIcon className="size-4" />
                        Upload logo
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          className="sr-only"
                          onChange={(event) =>
                            updateCabinetLogo(event.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={clearCabinetLogo}
                          disabled={!selectedCabinet.logoPath}
                        >
                          Hapus logo
                        </Button>
                      </div>
                      {cabinetLogoError ? (
                        <p className="mt-2 text-xs leading-5 text-red-600">
                          {cabinetLogoError}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nama kabinet">
                      <Input
                        value={selectedCabinet.name}
                        onChange={(event) =>
                          updateCabinet((cabinet) => ({
                            ...cabinet,
                            name: event.target.value,
                          }))
                        }
                      />
                    </Field>
                    <Field label="Urutan kabinet">
                      <Input
                        value={selectedCabinet.orderLabel}
                        onChange={(event) =>
                          updateCabinet((cabinet) => ({
                            ...cabinet,
                            orderLabel: event.target.value,
                          }))
                        }
                      />
                    </Field>
                  </div>

                  <Field label="Tema kabinet">
                    <Input
                      value={selectedCabinet.theme}
                      onChange={(event) =>
                        updateCabinet((cabinet) => ({
                          ...cabinet,
                          theme: event.target.value,
                        }))
                      }
                    />
                  </Field>

                  <Field label="Filosofi kabinet">
                    <Textarea
                      className="min-h-52"
                      value={selectedCabinet.philosophy}
                      onChange={(event) =>
                        updateCabinet((cabinet) => ({
                          ...cabinet,
                          philosophy: event.target.value,
                        }))
                      }
                    />
                  </Field>
                </div>
              </div>

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCabinetEditorOpen(false)}
                >
                  Batal
                </Button>
                 <SaveCabinetButton pending={isSavingCabinet} />

              </DialogFooter>
              {cabinetDialogSaveState.error ? (
                <p className="mt-3 text-sm text-red-600">
                  {cabinetDialogSaveState.error}
                </p>
              ) : null}
              {cabinetDialogSaveState.success ? (
                <p className="mt-3 text-sm text-emerald-600">
                  {cabinetDialogSaveState.success}
                </p>
              ) : null}
            </form>
          </DialogContent>
        ) : null}
      </Dialog>

      <AlertDialog
        open={Boolean(pendingMemberDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingMemberDelete(null)
          }
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus anggota ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingMemberDelete?.memberName ?? "Fungsionaris ini"} akan dihapus dan perubahan langsung disimpan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pendingMemberDelete) {
                  const nextCabinets = getCabinetsAfterRemovingMember(
                    pendingMemberDelete.department,
                    pendingMemberDelete.memberId
                  )
                  setCabinets(nextCabinets)
                  setPendingMemberDelete(null)
                  void submitStructure("member", nextCabinets)
                }
              }}
            >
              Hapus anggota
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus kabinet ini?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCabinet.orderLabel} ·{" "}
              {selectedCabinet.name || "Kabinet tanpa nama"} akan dihapus dan
              perubahan langsung disimpan. Jika kabinet ini sedang menjadi default,
              kabinet berikutnya akan dijadikan default otomatis.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                const nextCabinets = getCabinetsAfterRemovingSelectedCabinet()
                setCabinets(nextCabinets)
                setSelectedCabinetId(nextCabinets[0]?.id ?? "")
                setDeleteAlertOpen(false)
                void submitStructure("cabinet", nextCabinets)
              }}
            >
              Hapus kabinet
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ImageCropper
        dialogOpen={memberImageCropOpen && Boolean(pendingMemberCrop)}
        setDialogOpen={(open) => {
          setMemberImageCropOpen(open)
          if (!open) {
            setPendingMemberCrop(null)
          }
        }}
        selectedFile={pendingMemberCrop?.file ?? null}
        onCropComplete={handleMemberCropComplete}
        aspect={3 / 4}
      />
    </div>
  )
}

function createNewCabinet(nextNumber: number): CabinetEditorState {
  return {
    id: `kabinet-${makeUuid()}`,
    orderLabel: `Kabinet ${String(nextNumber).padStart(2, "0")}`,
    name: "",
    theme: "",
    logoPath: "",
    logoPreviewUrl: "",
    philosophy: "",
    isDefault: false,
    sections: departmentNames.map((department) => ({
      department,
      members: [],
    })),
  }
}

function getCabinetLogoPreview(cabinet: CabinetEditorState) {
  return normalizeImageSrc(cabinet.logoPreviewUrl || cabinet.logoPath)
}

function normalizeImageSrc(value?: string) {
  if (!value) {
    return ""
  }

  if (
    value.startsWith("/") ||
    value.startsWith("blob:") ||
    value.startsWith("data:")
  ) {
    return value
  }

  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? value : ""
  } catch {
    return ""
  }
}

function deserializeCabinets(payload: string): CabinetEditorState[] {
  const parsed = JSON.parse(payload) as Array<{
    id: string
    orderLabel: string
    name: string
    theme: string
    logoPath: string
    logoPreviewUrl?: string
    philosophy: string
    isDefault: boolean
    sections: Array<{
      department: string
      members: Array<{
        id: string
        name: string
        nickname: string
        position: string
        program: string
        entryYear: string
        gender: Gender
        quote: string
        photoPath: string
        photoPreviewUrl?: string
        instagram?: string
        linkedin?: string
        github?: string
        website?: string
        tiktok?: string
        youtube?: string
      }>
    }>
  }>

  return parsed.map((cabinet) => ({
    ...cabinet,
    logoPreviewUrl: cabinet.logoPreviewUrl ?? cabinet.logoPath,
    pendingLogoFile: null,
    sections: cabinet.sections.map((section) => ({
      ...section,
      members: section.members.map((member) => ({
        ...member,
        photoPreviewUrl: member.photoPreviewUrl ?? member.photoPath,
        pendingPhotoFile: null,
      })),
    })),
  }))
}

function serializeCabinets(cabinets: CabinetEditorState[]) {
  return JSON.stringify(
    cabinets.map((cabinet) => ({
      id: cabinet.id,
      orderLabel: cabinet.orderLabel,
      name: cabinet.name,
      theme: cabinet.theme,
      logoPath: cabinet.logoPath,
      philosophy: cabinet.philosophy,
      isDefault: cabinet.isDefault,
      sections: cabinet.sections.map((section) => ({
        department: section.department,
        members: section.members.map((member) => ({
          id: member.id,
          name: member.name,
          nickname: member.nickname,
          position: member.position,
          program: member.program,
          entryYear: member.entryYear,
          gender: member.gender,
          quote: member.quote,
          photoPath: member.photoPath,
          instagram: member.instagram ?? "",
          linkedin: member.linkedin ?? "",
          github: member.github ?? "",
          website: member.website ?? "",
          tiktok: member.tiktok ?? "",
          youtube: member.youtube ?? "",
        })),
      })),
    }))
  )
}

function SaveMemberButton({ pending }: { pending: boolean }) {
  return (
    <Button
      type="submit"
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  )
}

function SaveCabinetButton({ pending }: { pending: boolean }) {
  return (
    <Button
      type="submit"
      className="bg-[#3f679c] text-white hover:bg-[#355887]"
      disabled={pending}
    >
      {pending ? "Menyimpan..." : "Simpan Perubahan"}
    </Button>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-900">{label}</span>
      {children}
    </label>
  )
}

function DropdownField({
  value,
  placeholder,
  options,
  onSelect,
}: {
  value: string
  placeholder: string
  options: readonly string[]
  onSelect: (value: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-between px-3 font-normal text-slate-900"
        >
          <span className={value ? "" : "text-slate-400"}>
            {value || placeholder}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={value} onValueChange={onSelect}>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StatCard({
  label,
  value,
  description,
  icon,
}: {
  label: string
  value: string
  description: string
  icon: ReactNode
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-[#dce8f6] text-[#3f679c]">
          {icon}
        </div>
        <p className="text-4xl font-bold tracking-tight text-[#18365e]">{value}</p>
      </div>
      <h3 className="mt-5 text-base font-semibold text-[#27466f]">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  )
}
