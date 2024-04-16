import { THEME_COLOR_LIGHT } from "@/libs/ui"
import { Viewport } from "next"

export const viewport: Viewport = {
    themeColor: THEME_COLOR_LIGHT
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>{children}</>
    )
}