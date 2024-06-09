import { appFont } from "@/app/fonts"

interface CompetitionBannerProps {
    onCheckoutDetails?: () => void
    onClose?: () => void
}
const CompetitionBanner: React.FC<CompetitionBannerProps> = (props: CompetitionBannerProps) => {
    return <>
        <div id="sticky-banner" tabIndex={1} className={`fixed top-0 start-0 z-50 flex justify-between w-full p-4 bg-rose-500  ${appFont.className}`}>
            <div className="flex items-center mx-auto">
                <p className="flex items-center text-md font-normal text-white dark:text-gray-400">
                    <span>Join our GIF contest (from June 10th to 17th) and win Livepeer tokens!&nbsp;
                        <a onClick={() => { props?.onCheckoutDetails?.() }} className="inline font-medium underline  underline-offset-2 decoration-600 dark:decoration-500 decoration-solid hover:no-underline">More details</a>
                    </span>
                </p>
            </div>
            <div className="flex items-center">
                <button onClick={() => props.onClose?.()} data-dismiss-target="#sticky-banner" type="button" className="flex-shrink-0 inline-flex justify-center w-7 h-7 items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                    </svg>
                    <span className="sr-only" >Close banner</span>
                </button>
            </div>
        </div>


    </>
}
export default CompetitionBanner