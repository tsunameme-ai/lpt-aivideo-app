import { Button, Spacer } from "@nextui-org/react"
import LandingPromoComponent from '@/components/landing-promo'
import styles from '@/styles/home.module.css'

interface InstallPromoProps {
    hasInstallPrompt: boolean
    isMobile: boolean
    onInstallRequested: () => void
}

export const InstallPromo: React.FC<InstallPromoProps> = (props: InstallPromoProps) => {
    return (

        <section className={styles.main}>
            <Spacer y={8} />
            <h1>Tsunameme</h1>
            <Spacer y={8} />
            <div className={styles.centerLanding}>
                <LandingPromoComponent />
                <Spacer y={8} />
                {
                    props.isMobile && props.hasInstallPrompt ?
                        <Button color="primary" onPress={props.onInstallRequested}>Install</Button>
                        :
                        <p>Please install the app first. You can do that by using "Add to Home Screen".</p>
                }

            </div>
        </section>
    )

}