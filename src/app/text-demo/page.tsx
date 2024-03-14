import dynamic from "next/dynamic";
import styles from '@/styles/home.module.css'
import EditorWrapper from "./wrapper";

dynamic(() => import("@/components/editor"), {
    ssr: false,
});

export default function Page() {
    return (
        <>
            <section className={styles.main}>
                <div className={styles.centerSection}>
                    <EditorWrapper />
                </div>
            </section>
        </>
    )
}