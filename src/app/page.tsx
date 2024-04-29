'use client'
import { useRouter } from 'next/navigation'
import { useGenerationContext } from '@/context/generation-context'
import { useEffect } from 'react'

export default function Home() {
  const { authenticated, user, ready } = usePrivy()
  const router = useRouter()
  const gContext = useGenerationContext()
  useEffect(() => {
    if (gContext.i2vOutputs.length > 0) {
      router.replace('/gallery')
    }
  }, [])
  useEffect(() => {
    if (ready) {
      if (authenticated && user) {
        //fetch user gens
      }
      else {

      }
      router.replace('/welcome')
    }
  }, [ready])

  return (
    <></>
  )
}