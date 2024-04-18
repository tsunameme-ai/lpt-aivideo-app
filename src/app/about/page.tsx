'use client'
import styles from "@/styles/home.module.css"
import { Spacer } from "@nextui-org/react"
import { useRouter } from 'next/navigation'
import { appFont } from "../fonts"
import { PrimaryButton } from "@/components/buttons"

export default function Page() {
    const router = useRouter()
    return (
        <>
            <section className={`items-center justify-center ${appFont.className}`}>
                <div className={styles.centerSection}>
                    <div className="flex justify-center items-center">
                        We love GIFs. For the longest time, we wish we could make jaw-dropping GIFs like professional visual artists.
                        <br /><br />
                        Then generative AI came, and everything changed. Now, anyone with good taste and creativity can produce stunning videos with just a few lines of text.
                        We realized that if this could be done for videos, it could certainly be done for GIFs.
                        <br /><br />
                        Thus, Tsunameme was born. If you share our love for GIFs, you are in for a treat.
                        <br /><br />
                        This project is generously supported by Livepeer, a decentralized GPU network that makes video processing
                        much more affordable than traditional cloud services.
                        <br /><br />
                        Got questions or ideas? Drop us a line anytime!
                    </div>
                    <Spacer y={5} />
                    <div className="flex justify-center items-center"><PrimaryButton className='font-medium' onPress={() => router.push('/')}>Get Started</PrimaryButton></div>
                </div>
            </section>
        </>
    )
}