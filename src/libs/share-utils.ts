
import { toast } from 'react-toastify'
export async function share(shareData: { url: string, toastTitle: string }, toastId: string) {
    if (navigator.share) {
        try {
            await navigator.share({
                text: shareData.url
            });
            return
        } catch (error: any) {
            if (error.toString().includes('AbortError')) {
                return
            }
        }
    }
    navigator.clipboard.writeText(shareData.url)
    toast.success(shareData.toastTitle, {
        toastId: toastId,
        autoClose: 1200,
        hideProgressBar: true
    })
}
