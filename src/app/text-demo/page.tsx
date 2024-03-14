import dynamic from "next/dynamic";
import styles from '@/styles/home.module.css'

const Editor = dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <Editor imageUrl="https://pub-3626123a908346a7a8be8d9295f44e26.r2.dev/generations/0-5c5efe4b-ec74-4311-9ced-76cc38d80835.png" />
                </div>
            </section>
        </>
    )
}