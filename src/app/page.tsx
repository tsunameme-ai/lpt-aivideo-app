'use client'
import { useRouter } from 'next/navigation'
import { useGenerationContext } from '@/context/generation-context'
import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'
import { fetchAssetsByUser } from '@/actions/stable-diffusion'

export default function Home() {
  const { authenticated, user, ready } = usePrivy()
  const router = useRouter()
  const gContext = useGenerationContext()
  const [hasRedirected, setRedirected] = useState<boolean>(false)
  useEffect(() => {
    if (gContext.i2vOutputs.length > 0) {
      gotoPage('/gallery')
    }
  }, [])
  const redirect = async () => {
    if (hasRedirected) {
      return
    }
    if (ready) {
      if (authenticated && user) {
        const data = await fetchAssetsByUser(user.id, 1)
        gotoPage(data.items?.length > 0 ? '/gallery' : '/welcome')
      }
      else {
        gotoPage('/welcome')
      }
    }
  }
  const gotoPage = (path: string) => {
    setRedirected(true)
    router.replace(path)
  }
  useEffect(() => {
    redirect()
  }, [ready])

  return (
    <>
      <div className='w-full h-svh flex items-center justify-center'>
        <div className='font-bold text-primary text-5xl'>TSUNAMEME</div>
      </div>
    </>
  )
}