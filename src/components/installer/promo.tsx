import { Button, Spacer } from "@nextui-org/react"
import LandingPromoComponent from '@/components/landing-promo'
import styles from '@/styles/home.module.css'
import { FaAnglesDown } from "react-icons/fa6"

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
        dynamicMSG = <Button size='md' className='w-full font-medium' color='primary' variant="ghost" radius='sm' onPress={props.onInstallRequested} >Install</Button >
    } else {
        dynamicMSG = <><div>Tap below button and choose</div> <div><strong>Add to Home Screen</strong> to install the app</div></>
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
                <Spacer y={1} />
                <FaAnglesDown className="m-auto" />
            </div>
        </section>
    )

}