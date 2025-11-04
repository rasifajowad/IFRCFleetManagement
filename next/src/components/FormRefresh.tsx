"use client"
import { useEffect, useRef } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'

export default function FormRefresh() {
  const { pending } = useFormStatus()
  const router = useRouter()
  const wasPending = useRef(false)

  useEffect(() => {
    if (wasPending.current && !pending) {
      router.refresh()
    }
    wasPending.current = pending
  }, [pending, router])

  return null
}

