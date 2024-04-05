import { Button, Spacer } from "@nextui-org/react"
import LandingPromoComponent from '@/components/landing-promo'
import styles from '@/styles/home.module.css'

interface InstallPromoProps {
    hasInstallPrompt: boolean
    isMobile: boolean
    onInstallRequested: () => void
}

export const InstallPromo: React.FC<InstallPromoProps> = (props: InstallPromoProps) => {
    //console.log(props.isMobile)
    let dynamicMSG
    if (!props.isMobile)
        dynamicMSG = <p>Please open this page from your mobile phone.</p>
    else if (props.hasInstallPrompt) {
        dynamicMSG = < Button size='lg' className={styles.startBtn} onPress={props.onInstallRequested} > Install</Button >
    } else {
        dynamicMSG = <><p>Please open from the below navigation bar</p><p>Use <strong>Add to Home Screen</strong> to install the app</p></>
    }

    return (

        <section className={styles.main}>
            <Spacer y={8} />
            <h1>Tsunameme</h1>
            <Spacer y={8} />
            <div className={styles.centerLanding}>
                <LandingPromoComponent />
                <Spacer y={6} />
                {dynamicMSG}
            </div>
        </section>
    )

}