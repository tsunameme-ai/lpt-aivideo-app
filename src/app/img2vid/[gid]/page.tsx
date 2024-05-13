'use client'
import { useState } from "react"
import { useParams, useRouter } from 'next/navigation'
import { GenerationOutputItem } from "@/libs/types"
import { Spacer, Link } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import { FaShare } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MediaPlayerComponent from "@/components/media-player"
import { share } from "@/libs/share-utils"
import { PrimaryButton, SecondaryButton } from "@/components/buttons"
import { AuthInline } from "@/components/auth-indicator"
import { claim } from "@/actions"
import { appFont } from "@/app/fonts"

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const params = useParams()
    const { gid } = params
    const [i2vOutput] = useState<GenerationOutputItem | undefined>(gContext.i2vOutputs.find((item) => { return item.id === `${gid}:0` }) ?? undefined)

    const handleShare = () => {
        if (!i2vOutput) {
            return
        }
        share({
            url: i2vOutput.url,
            toastTitle: "GIF link is copied. Send it!"
        }, 'copy-success')
    }

    return (
        <>
            <ToastContainer />
            {gContext.isReady && <section className={`${styles.main} ${appFont.className}`}>
                <div className={styles.centerSection}>
                    <div className='font-medium'>Step 3 of 3: Make it a GIF </div>
                    <Spacer y={4} />
                    <div>
                        {i2vOutput ? <div className='flex justify-center'>
                            <MediaPlayerComponent src={i2vOutput.url} className={styles.videoPreview} />
                            <FaShare className={styles.shareIcon} onClick={handleShare} />
                        </div> : <>
                            <ErrorComponent errorMessage="No Image" />
                            <Link href='/'>Start Over</Link>
                        </>}
                    </div>
                    <Spacer y={4} />
                    <PrimaryButton onPress={handleShare}>Share</PrimaryButton>

                    {i2vOutput &&
                        <>
                            <AuthInline
                                onLoginComplete={async (userId: string, accessToken: string) => {
                                    console.log(`????onLoginComplete ${userId} ${i2vOutput.id}`)
                                    const result = await claim(userId, i2vOutput?.id, accessToken, gContext.userSalt)
                                    console.log(result)
                                }}
                                onLoginFailed={() => {
                                    toast.error('Login failed', {
                                        toastId: 'login-failed',
                                        autoClose: 1200,
                                        hideProgressBar: true
                                    })
                                }} />
                        </>}
                    <Spacer y={4} />
                    <SecondaryButton onPress={() => {
                        gContext.reset()
                        router.replace('/txt2img')
                    }}>Create new</SecondaryButton>
                    <Spacer y={4} />
                    <SecondaryButton onPress={() => { router.push('/gallery') }}>Gallery</SecondaryButton>
                    <Spacer y={4} />
                </div>
            </section>}
        </>
    )
}