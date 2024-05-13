import { Spacer, Image } from "@nextui-org/react"
import styles from '@/styles/home.module.css'
import { appFont } from "@/app/fonts"
import { PrimaryButton } from "../buttons"
import { LuShare, LuAlignJustify } from "react-icons/lu"
import { FaAnglesDown, FaAnglesUp } from "react-icons/fa6"

interface InstallPromoProps {
    hasInstallPrompt: boolean
    isMobile: boolean
    isChrome: boolean
    isFireFox: boolean
    onInstallRequested: () => void
}

export const InstallPromo: React.FC<InstallPromoProps> = (props: InstallPromoProps) => {
    let dynamicMSG
    if (!props.isMobile) {
        if (props.hasInstallPrompt) {
            dynamicMSG = <>
                <Spacer y={4} /><PrimaryButton className="w-1/2" onPress={props.onInstallRequested}>Install</PrimaryButton>
            </>
        } else {
            if (props.isChrome) {
                dynamicMSG = <>
                    <div className='flex justify-center items-center flex-wrap' >
                        The app is already installed. <br /> Go to chrome://apps to open it
                    </div>
                </>
            } else {
                dynamicMSG = <>
                    <div className='flex justify-center items-center flex-wrap' >
                        Please open Google Chrome (not Incognito), Brave  <br />or Microsoft Edge browser to download the app
                    </div>
                </>
            }
        }
    } else {
        dynamicMSG = <div>
            <div className='flex justify-center items-center flex-wrap' >
                <span>For Safari, tap</span>
                &nbsp;
                <LuShare />
                &nbsp;button and choose
                <span><strong>Add to Home Screen</strong> to install</span>
            </div >
            <Spacer y={4} />
            <div className='flex justify-center items-center flex-wrap' >
                <span>For Chrome, tap</span>
                &nbsp;
                <LuShare />
                &nbsp;button and choose
                <span><strong>Add to Home Screen</strong> to install</span>
            </div >
            <Spacer y={4} />
            <div className='flex justify-center items-center flex-wrap' >
                <span>For Firefox, tap</span>
                &nbsp;
                <LuAlignJustify />
                &nbsp;button and choose
                <span><strong>Share</strong> and then <strong>Add to Home Screen</strong> <br /> to install</span>
            </div>
        </div>
    }

    return (

        <div className={`${styles.main} ${appFont.className} w-full min-h-svh bg-gradient-to-b from-50% from-primary to-[#98CDB1]`}>
            <div className={`h-28 w-full flex bg-img bg-repeat-x ${styles.wave}`} />
            <div className={`${styles.centerLanding} text-white`}>
                <div className='font-bold text-background text-5xl'>TSUNAMEME</div>
                <div className='font-semibold text-background text-base'>
                    <p>Making GIF expressions</p>
                    <p>with generative AI</p>
                </div>
                <Spacer y={4} />
                <div className='flex justify-center items-center'>
                    <Image className="w-64" src='https://lpt-aivideo-dst.s3.amazonaws.com/kQu1NZFLKj.gif' alt='bear' />
                </div>
                <Spacer y={4} />

                {dynamicMSG}

                {props.isChrome && props.isMobile && !props.hasInstallPrompt &&
                    <><div><FaAnglesUp className="fixed top-1 right-6 text-[#FF4429]" /></div></>
                }

                {props.isFireFox && props.isMobile && !props.hasInstallPrompt &&
                    <><div><FaAnglesDown className="fixed bottom-2 right-7 text-[#FF4429]" /></div></>
                }
            </div>
        </div >
    )

}