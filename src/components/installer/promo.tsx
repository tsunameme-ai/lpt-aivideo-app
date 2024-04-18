import { Spacer } from "@nextui-org/react"
import LandingPromoComponent from '@/components/landing-promo'
import styles from '@/styles/home.module.css'
import { FaAnglesDown } from "react-icons/fa6"
import { appFont } from "@/app/fonts"
import { SecondaryButton } from "../buttons"

interface InstallPromoProps {
    hasInstallPrompt: boolean
    isMobile: boolean
    onInstallRequested: () => void
}

export const InstallPromo: React.FC<InstallPromoProps> = (props: InstallPromoProps) => {
    let dynamicMSG
    if (!props.isMobile)
        dynamicMSG = <p>Please open this page from your mobile phone.</p>
    else if (props.hasInstallPrompt) {
        dynamicMSG = <SecondaryButton onPress={props.onInstallRequested}>Install</SecondaryButton >
    } else {
        dynamicMSG = <><div>Tap below button and choose</div> <div><strong>Add to Home Screen</strong> to install the app</div></>
    }

    return (

        <div className={`${styles.main} ${appFont.className} w-full min-h-svh bg-gradient-to-b from-50% from-primary to-[#98CDB1]`}>
            <div className={`h-20 w-full flex bg-img bg-repeat-x ${styles.wave}`} />
            <div className={`${styles.centerLanding} text-white`}>
                <LandingPromoComponent />
                <Spacer y={4} />
                {dynamicMSG}
                <Spacer y={1} />
                <FaAnglesDown className="m-auto" />
                <Spacer y={1} />
            </div>
        </div>
    )

}