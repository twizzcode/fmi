import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_48%,#eef4ff_100%)] px-6 py-16 md:px-10">
      <div className="mx-auto flex min-h-[calc(100svh-9rem)] w-full max-w-5xl items-center justify-center">
        <Card className="relative w-full max-w-md overflow-hidden border border-slate-200 bg-white shadow-[0_24px_80px_rgba(148,163,184,0.18)]">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[#3f679c]" />
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(63,103,156,0.16),_transparent_68%)]" />
          <CardContent className="relative p-8 md:p-10">
            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
