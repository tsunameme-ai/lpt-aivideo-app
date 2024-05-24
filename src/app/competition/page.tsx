'use client'
import 'react-toastify/dist/ReactToastify.css'
import styles from '@/styles/home.module.css'
import { usePrivy } from "@privy-io/react-auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useGenerationContext } from "@/context/generation-context"
import { PrimaryButton } from "@/components/buttons"
import { appFont } from '../fonts'

export default function Page() {
    const { authenticated, user, ready, login } = usePrivy()
    const [userId, setUserId] = useState<string | undefined>(undefined)
    const gContext = useGenerationContext()
    const router = useRouter()

    useEffect(() => {
        if (authenticated && user) {
            setUserId(user.id)
        }
        else {
            setUserId(undefined)
        }
    }, [authenticated, user])


    return (
        <section className={`${styles.main} ${appFont.className}`}>
            {
                ready &&
                <div className={styles.centerSection}>
                    <div>
                        GIF Competition
                    </div>
                    {
                        userId ? <>
                            <PrimaryButton onPress={() => {
                                gContext.reset()
                                router.push('/txt2img')
                            }}>Create</PrimaryButton>

                        </>
                            :
                            <PrimaryButton onPress={login}>Login</PrimaryButton>
                    }
                </div >
            }
        </section>
    )
}