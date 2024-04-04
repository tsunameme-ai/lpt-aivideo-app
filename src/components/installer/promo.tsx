import { Button } from "@nextui-org/react"

interface InstallPromoProps {
    hasInstallPrompt: boolean
    onInstallRequested: () => void
}

export const InstallPromo: React.FC<InstallPromoProps> = (props: InstallPromoProps) => {
    return (
        <>
            <div className="container aspect-square max-w-sm mx-auto" style={{ border: '1px solid #f00' }}>
                <p>Promo content</p>
                {
                    props.hasInstallPrompt ?
                        <Button color="primary" onPress={props.onInstallRequested}>Install</Button>
                        :
                        <p>To install the app, add this website to your home screen.</p>
                }

            </div>
        </>
    )

}