'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { GenerationOutputItem } from "@/libs/types"
import { Spacer, Link, Button } from "@nextui-org/react"
import styles from "@/styles/home.module.css"
import React from "react"
import { useGenerationContext } from "@/context/generation-context"
import ErrorComponent from "@/components/error"
import { FaShare } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MediaPlayerComponent from "@/components/media-player"
import { appFont } from "../fonts"
import { share } from "@/libs/share-utils"
import { PrimaryButton, SecondaryButton } from "@/components/buttons"
import { AuthInline, AuthPromo } from "@/components/auth-indicator"
import { claim } from "@/actions/stable-diffusion"
import { usePrivy } from "@privy-io/react-auth"

export default function Page() {
    const router = useRouter()
    const gContext = useGenerationContext()
    const { authenticated, user } = usePrivy()
    const [authStatus, setAuthStatus] = useState<string>('')
    const [i2vOutput] = useState<GenerationOutputItem | undefined>(gContext.i2vOutputs.length > 0 ? gContext.i2vOutputs[gContext.i2vOutputs.length - 1] : undefined)

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
            <section className={`${styles.main} ${appFont.className}`}>
                <div className={styles.centerSection}>
                    <div className='font-medium'>Step 3 of 3: Make it a GIF </div>
                    <Spacer y={4} />
                    <div>
                        {i2vOutput && <div className='flex justify-center'>
                            <MediaPlayerComponent src={i2vOutput.url} className={styles.videoPreview} />
                            <FaShare className={styles.shareIcon} onClick={handleShare} />
                        </div>}

                        {!gContext.overlayImageData && <>
                            <ErrorComponent errorMessage="No Image" />
                            <Link href='/'>Start Over</Link>
                        </>}
                    </div>
                    <Spacer y={4} />
                    <PrimaryButton onPress={handleShare}>Share</PrimaryButton>
                    <Spacer y={4} />
                    <SecondaryButton onPress={() => { router.replace('/') }}>Create New</SecondaryButton>
                    <Spacer y={4} />
                    <SecondaryButton onPress={() => { router.push('/gallery') }}>Gallery</SecondaryButton>
                    <Spacer y={4} />
                    {i2vOutput && (!authenticated || !user) &&
                        <>
                            <Spacer y={4} />
                            <AuthInline
                                onLoginComplete={async (userId: string, accessToken: string) => {
                                    setAuthStatus('success')
                                    const success = await claim(userId, i2vOutput?.id, accessToken, gContext.userSalt)
                                    console.log(success)
                                }}
                                onLoginFailed={() => {
                                    setAuthStatus('failed')
                                    toast.error('Login failed', {
                                        toastId: 'login-failed',
                                        autoClose: 1200,
                                        hideProgressBar: true
                                    })
                                }} />
                        </>}
                    <Spacer y={4} />
                    <Button>Publish</Button>
                </div>
            </section>
        </>
    )
}