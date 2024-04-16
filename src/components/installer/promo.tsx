import { Button, Spacer } from "@nextui-org/react"
import LandingPromoComponent from '@/components/landing-promo'
import styles from '@/styles/home.module.css'
import { FaAnglesDown } from "react-icons/fa6"
import { appFont } from "@/app/fonts"
import { useRef, useEffect } from "react"

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
    const divRef = useRef(null);

    useEffect(() => {
        const setHeight = () => {
            div.style.height = `${window.innerHeight}px`;
        };
        const div: any = divRef.current;
        if (div) {
            setHeight()
            window.addEventListener('resize', setHeight)
        }
        return () => window.removeEventListener('resize', setHeight)
    }, []);

    return (
        <div ref={divRef} className={`${styles.main} ${appFont.className} flex bg-gradient-to-b from-primary to-[#98CDB1] w-full h-full`} >
            <div className={`${styles.centerLanding} text-white`}>
                <LandingPromoComponent />
                <Spacer y={6} />
                {dynamicMSG}
                <Spacer y={1} />
                <FaAnglesDown className="m-auto" />
            </div>
        </div>
    )

}