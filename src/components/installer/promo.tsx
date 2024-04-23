import { Spacer, Image } from "@nextui-org/react"
import styles from '@/styles/home.module.css'
import { appFont } from "@/app/fonts"
import { SecondaryButton } from "../buttons"
import { LuShare, LuAlignJustify } from "react-icons/lu"
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6"

interface InstallPromoProps {
    hasInstallPrompt: boolean
    isMobile: boolean
    isChrome: boolean
    isSafari: boolean
    isBrave: boolean
    isFireFox: boolean
    onInstallRequested: () => void
}

export const InstallPromo: React.FC<InstallPromoProps> = (props: InstallPromoProps) => {
    let dynamicMSG
    if (!props.isMobile)
        dynamicMSG = <p>Please open this page from your mobile phone</p>
    else if (props.hasInstallPrompt) {
        dynamicMSG = <SecondaryButton onPress={props.onInstallRequested}>Install</SecondaryButton >
    } else if (props.isFireFox) {
        dynamicMSG = <>
            <div className='flex items-center' >
                <span>Please tap the</span>
                &nbsp;
                <LuAlignJustify />
                &nbsp;
                <span>button on your browser</span>
            </div>
            <div> and choose <strong>Add to Home Screen</strong> to install the app on your phone</div>
        </>
    } else {
        dynamicMSG = <>
            <div className='flex items-center' >
                <span>Please tap the</span>
                &nbsp;
                <LuShare />
                &nbsp;
                <span>button on your browser</span>
            </div>
            <div> and choose <strong>Add to Home Screen</strong> to install the app on your phone</div>
            <div>{props.isChrome.toString()} {props.isSafari.toString()} {props.isFireFox.toString()} {props.isBrave.toString()} <br />{navigator.userAgent}</div>
        </>
    }

    return (

        <div className={`${styles.main} ${appFont.className} w-full min-h-svh bg-gradient-to-b from-50% from-primary to-[#98CDB1]`}>
            <div className={`h-20 w-full flex bg-img bg-repeat-x ${styles.wave}`} />
            <div className={`${styles.centerLanding} text-white`}>
                <div className='font-bold text-background text-5xl'>TSUNAMEME</div>
                <Spacer y={4} />
                <div className='font-semibold text-background text-base'>
                    <p>Making GIF expressions</p>
                    <p>with generative AI</p>
                </div>
                <Spacer y={4} />
                <div className='flex justify-center items-center'>
                    <Image className="w-64" src='https://lpt-aivideo-dst.s3.amazonaws.com/bSO9pFGHzV.gif' alt='dog' />
                </div>
                <Spacer y={4} />

                {dynamicMSG}

                {props.isSafari && props.isMobile &&
                    <><Spacer y={8} /><div><FaAnglesDown className="m-auto text-[#FF4429]" /></div></>
                }

                {props.isChrome && props.isMobile &&
                    <><div><FaAnglesUp className="fixed top-1 right-1 text-[#FF4429]" /></div></>
                }

                {props.isFireFox && props.isMobile &&
                    <><div><FaAnglesDown className="fixed bottom-2 right-5 text-[#FF4429]" /></div></>
                }
            </div>
        </div >
    )

}