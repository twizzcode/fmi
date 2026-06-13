"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const redirectTo = useMemo(
    () => searchParams.get("redirectTo") || "/",
    [searchParams]
  )

  const submitLabel = mode === "sign-in" ? "Masuk" : "Buat akun"
  const switchLabel =
    mode === "sign-in" ? "Belum punya akun?" : "Sudah punya akun?"
  const switchAction = mode === "sign-in" ? "Daftar" : "Masuk"

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setIsPending(true)

    try {
      if (mode === "sign-up") {
        const { error } = await authClient.signUp.email({
          name: name.trim(),
          email,
          password,
          callbackURL: redirectTo,
        })

        if (error) {
          setErrorMessage(error.message || "Gagal membuat akun.")
          return
        }
      } else {
        const { error } = await authClient.signIn.email({
          email,
          password,
          callbackURL: redirectTo,
        })

        if (error) {
          setErrorMessage(error.message || "Email atau password salah.")
          return
        }
      }

      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      )
    } finally {
      setIsPending(false)
    }
  }

  async function handleGoogleSignIn() {
    setErrorMessage(null)
    setIsPending(true)

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      })

      if (error) {
        setErrorMessage(error.message || "Gagal masuk dengan Google.")
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan."
      )
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex flex-col items-center gap-2 font-medium">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-[#3f679c]/10 text-[#3f679c]">
                <GalleryVerticalEndIcon className="size-6" />
              </div>
              <span className="sr-only">FMI FMIPA UNNES</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              {mode === "sign-in" ? "Masuk ke FMI" : "Buat akun FMI"}
            </h1>
            <FieldDescription className="text-slate-500">
              {switchLabel}{" "}
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "sign-in" ? "sign-up" : "sign-in")
                  setErrorMessage(null)
                }}
                className="font-medium text-[#3f679c] underline underline-offset-4"
              >
                {switchAction}
              </button>
            </FieldDescription>
          </div>
          {mode === "sign-up" ? (
            <Field>
              <FieldLabel htmlFor="name">Nama</FieldLabel>
              <Input
                id="name"
                placeholder="Nama lengkap"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Field>
          ) : null}
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="nama@kampus.ac.id"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              required
            />
          </Field>
          <FieldError>{errorMessage}</FieldError>
          <Field>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#3f679c] text-white hover:bg-[#355887]"
            >
              {isPending ? "Memproses..." : submitLabel}
            </Button>
          </Field>
          <FieldSeparator>Atau</FieldSeparator>
          <Field>
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isPending}
              className="border-slate-200 bg-white text-slate-700 hover:border-[#3f679c]/30 hover:bg-blue-50 hover:text-[#3f679c]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  fill="currentColor"
                />
              </svg>
              <span>Lanjut dengan Google</span>
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center text-slate-500">
        Dengan melanjutkan, Anda menyetujui kebijakan penggunaan layanan FMI.
      </FieldDescription>
    </div>
  )
}
