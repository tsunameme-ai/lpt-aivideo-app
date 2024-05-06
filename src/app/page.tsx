'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { usePrivy } from '@privy-io/react-auth'

export default function Home() {
    const { authenticated, user, ready } = usePrivy()
    const router = useRouter()
    const [hasRedirected, setRedirected] = useState<boolean>(false)
    const redirect = async () => {
        if (hasRedirected) {
            return
        }
        if (ready) {
            if (authenticated && user) {
                gotoPage('/gallery')
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