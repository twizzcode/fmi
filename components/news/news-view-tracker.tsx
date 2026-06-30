"use client"

import { useEffect } from "react"

export function NewsViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    const storageKey = `news-viewed:${articleId}`

    if (typeof window === "undefined") {
      return
    }

    if (window.sessionStorage.getItem(storageKey) === "1") {
      return
    }

    window.sessionStorage.setItem(storageKey, "1")

    const url = `/api/news/${articleId}`
    const body = JSON.stringify({ action: "increment-view" })

    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" })
      navigator.sendBeacon(url, blob)
      return
    }

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: true,
    }).catch(() => undefined)
  }, [articleId])

  return null
}
