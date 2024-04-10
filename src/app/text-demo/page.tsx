'use client'
import dynamic from "next/dynamic";
import styles from '@/styles/home.module.css'
import { useRef } from "react";

const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    const ref = useRef<any>()
    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <Editor
                        imageUrl="https://storage.googleapis.com/livepeer-ai-video-dev/e7d1c27a/c5af4d0b.png"
                        stageRef={ref}
                    />
                </div>
            </section>
        </>
    )
}