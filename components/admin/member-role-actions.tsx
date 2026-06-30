"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { CheckIcon, MoreHorizontalIcon } from "lucide-react"

import { updateMemberRoleAction } from "@/app/(admin)/admin-space/anggota/actions"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type UserRole } from "@/lib/db/schema"

const editableRoles: Array<{ value: UserRole; label: string }> = [
  { value: "user", label: "User" },
  { value: "staff", label: "Staff" },
  { value: "alumni", label: "Alumni" },
  { value: "admin", label: "Admin" },
]

export function MemberRoleActions({
  userId,
  email,
  role,
}: {
  userId: string
  email: string
  role: UserRole
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isDeveloper = role === "developer"

  function handleChangeRole(nextRole: UserRole) {
    if (isPending || role === nextRole || isDeveloper) return

    startTransition(async () => {
      await updateMemberRoleAction(userId, nextRole)
      router.refresh()
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={`Aksi untuk ${email}`}
          disabled={isPending}
        >
          <MoreHorizontalIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 min-w-56">
        <DropdownMenuLabel>Ubah Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {editableRoles.map((item) => (
          <DropdownMenuItem
            key={item.value}
            disabled={isPending || role === item.value || isDeveloper}
            onSelect={(event) => {
              event.preventDefault()
              handleChangeRole(item.value)
            }}
          >
            <CheckIcon className={role === item.value ? "size-4 opacity-100" : "size-4 opacity-0"} />
            {isPending && role !== item.value ? "Memproses..." : item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
