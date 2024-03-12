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
                    <Editor width={512} height={768} />
                </div>
            </section>
        </>
    )
}