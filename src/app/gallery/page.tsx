'use client'
import styles from "@/styles/home.module.css"
import { Button, Spacer } from "@nextui-org/react"
import { useRouter } from 'next/navigation'

export default function Page() {
    const router = useRouter()
    return (
        <>
            <section className='flex flex-col items-center justify-center'>
                <div className={styles.centerSection}>
                    <div className="flex justify-center items-center">GALLERY page is still under contruction </div>
                    <Spacer y={5}></Spacer>
                    <div className="flex justify-center items-center"><Button color="primary" onClick={() => router.back()}>Back</Button></div>
                </div>
            </section>
        </>
    )
}