'use client'
import React, { useEffect, useState } from "react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarMenuItem, Link, NavbarMenu, NavbarBrand, Button, Switch, Divider } from "@nextui-org/react";
import { useGenerationContext } from "@/context/generation-context";
import { AuthIndicator } from "../auth-indicator"
import { appFont } from "@/app/fonts";
import { FaAngleLeft } from "react-icons/fa6";
import { useRouter, usePathname } from "next/navigation";
import AdvancedIndicator from "../advanced-indicator";


enum NavIcon {
    BACK = 'back',
    TOGGLE = 'toggle',
    NONE = 'none'
}

const NavigationComponent: React.FC = () => {
    const pathname = usePathname()
    const router = useRouter()
    const gContext = useGenerationContext()
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<string[][]>([
        ['Create', '/txt2img'],
        ['Gallery', '/gallery'],
        ['About', '/about']
    ])

    const selectNavIcon = (path: string): NavIcon => {
        if (['/img2vid', '/caption'].includes(path)) {
            return NavIcon.BACK
        }
        if ('/' === path) {
            return NavIcon.NONE
        }
        return NavIcon.TOGGLE
    }
    const [navIcon, setNavIcon] = useState<NavIcon>(selectNavIcon(pathname))

    useEffect(() => {
        setNavIcon(selectNavIcon(pathname))
    }, [pathname]);


    const renderIcon = () => {
        switch (navIcon) {
            case NavIcon.BACK:
                return <Button isIconOnly variant='light' style={{ minWidth: 0, width: '24px' }}
                    onPress={() => { router.back() }} color='primary'
                    radius="none">
                    <FaAngleLeft size={26} />
                </Button>
            case NavIcon.TOGGLE:
                return <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
            default:
                return <></>
        }
    }

    return (<>

        {pathname != '/' &&
            <header className='py-1'>
                <Navbar className="text-primary" onMenuOpenChange={setIsMenuOpen}>
                    <NavbarContent>
                        {renderIcon()}
                        <NavbarBrand className={`${appFont.className} font-semibold`}>
                            TSUNAMEME
                        </NavbarBrand>
                    </NavbarContent>
                    <NavbarMenu>
                        {menuItems.map((item, index) => (
                            < NavbarMenuItem key={`${item}-${index}`}>
                                <Link
                                    onPress={() => {
                                        if (menuItems[index][1] === '/txt2img') {
                                            gContext.reset()
                                        }
                                    }}
                                    color="foreground"
                                    className={`${appFont.className} font-medium w-full leading-10`}
                                    href={item[1]}
                                    size="lg"
                                >
                                    {item[0]}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                        <NavbarMenuItem key={`authentication`}>
                            <AuthIndicator />
                        </NavbarMenuItem>
                        {process.env.NEXT_PUBLIC_DEBUG === 'browser' &&
                            <>
                                <Divider className="my-4" />
                                <NavbarMenuItem key='dev-editor'>
                                    <Link color="foreground" className={`${appFont.className} font-medium w-full leading-10`} href='/text-demo' size="lg">dev-editor</Link>
                                </NavbarMenuItem>
                                <NavbarMenuItem key='dev-home'>
                                    <Link color="foreground" className={`${appFont.className} font-medium w-full leading-10`} href='/' size="lg">dev-home</Link>
                                </NavbarMenuItem>

                                <NavbarMenuItem>
                                    <AdvancedIndicator />
                                </NavbarMenuItem>
                            </>
                        }
                    </NavbarMenu>
                </Navbar >
            </header>
        }
    </>)
};

export default NavigationComponent