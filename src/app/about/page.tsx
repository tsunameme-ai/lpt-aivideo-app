'use client'
import styles from "@/styles/home.module.css"
import { Button, Spacer } from "@nextui-org/react"
import { useRouter } from 'next/navigation'
import { appFont } from "../fonts"

export default function Page() {
    const router = useRouter()
    return (
        <>
            <section className={`flex flex-col items-center justify-center ${appFont.className}`}>
                <div className={styles.centerSection}>
                    <div className="flex justify-center items-center">GIF is one of the most original media on the internet.</div>
                    <Spacer y={5}></Spacer>
                    <div className="flex justify-center items-center"><Button color="primary" onClick={() => router.back()}>Back</Button></div>
                </div>
            </section>
        </>
    )
}