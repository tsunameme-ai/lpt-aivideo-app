import { Analytics } from "@/libs/analytics"
import { useEffect, useState } from "react"
import { InstallPromo } from "./promo"

export enum DisplayMode {
    STANDALONE = 'standalone',
    BROWSER = 'browser',
    TWA = 'twa'
}

interface InstallerProps {
    installPromtEvent?: Event
    onDisplayModeChange: (mode: DisplayMode) => void
}
export const Installer: React.FC<InstallerProps> = (props: InstallerProps) => {

    const [installPromtEvent, setInstallPromtEvent] = useState<Event | undefined>(undefined)
    const [displayMode, setDisplayMode] = useState<DisplayMode>()

    const handleBeforeInstallPromptEvt = (evt: Event) => {
        evt.preventDefault()
        console.log(`'beforeinstallprompt' event was fired.`)
        setInstallPromtEvent(evt)

    }
    const handleAppInstalledEvt = () => {
        Analytics.trackEvent({ 'event': 'app-installed' })
    }
    const handleInstallRequest = async () => {
        if (installPromtEvent) {
            (installPromtEvent as any).prompt()
            const { outcome } = await (installPromtEvent as any).userChoice
            Analytics.trackEvent({ 'event': 'app-install-promopt', 'value': outcome })
            setInstallPromtEvent(undefined)
        }
    }
    const getPWADisplayMode = () => {
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (document.referrer.startsWith('android-app://')) {
            return DisplayMode.TWA
        } else if ((navigator as any).standalone || isStandalone) {
            return DisplayMode.STANDALONE
        }
        return DisplayMode.BROWSER
    }

    const handleDisplayModeChangeEvt = (evt: Event) => {
        if ((evt as any).matches) {
            setDisplayMode(DisplayMode.STANDALONE)
            props.onDisplayModeChange(DisplayMode.STANDALONE)
        }
    }

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPromptEvt)
        window.addEventListener('appinstalled', handleAppInstalledEvt);
        window.matchMedia('(display-mode: standalone)').addEventListener('change', handleDisplayModeChangeEvt)
        const displayMode = getPWADisplayMode()
        setDisplayMode(displayMode)
        props.onDisplayModeChange(displayMode)
        return () => {
            setInstallPromtEvent(undefined)
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPromptEvt)
            window.removeEventListener('appinstalled', handleAppInstalledEvt)
            window.matchMedia('(display-mode: standalone)').removeEventListener('change', handleDisplayModeChangeEvt)
        }
    }, [])

    return (<>
        {
            displayMode === DisplayMode.BROWSER &&
            < InstallPromo hasInstallPrompt={installPromtEvent !== undefined} onInstallRequested={handleInstallRequest} />
        }
    </>)
}