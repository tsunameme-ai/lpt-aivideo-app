'use client'
import React, { useEffect, useState } from "react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarMenuItem, Link, NavbarMenu, NavbarBrand } from "@nextui-org/react";
import { useGenerationContext } from "@/context/generation-context";
import { AuthIndicator } from "../auth-indicator"
import { appFont } from "@/app/fonts";
import { usePathname } from "next/navigation";

const NavigationComponent: React.FC = () => {

    const pathname = usePathname()
    const gContext = useGenerationContext()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [menuItems, setMenuItems] = useState<string[][]>([
        ['Create', '/txt2img'],
        ['Gallery', '/gallery'],
        ['About', '/about']
    ])
    useEffect(() => {
        if (process.env.NEXT_PUBLIC_DEBUG === 'browser') {
            const items = [
                ['Create', '/txt2img'],
                ['Gallery', '/gallery'],
                ['About', '/about'],
                ['dev-editor', '/text-demo'],
                ['dev-home', '/']
            ]
            setMenuItems(items)
        }
    }, [])

    return (<>
        {pathname != '/' &&
            <header className='py-1'>
                <Navbar className="text-primary" onMenuOpenChange={setIsMenuOpen}>
                    <NavbarContent>
                        <NavbarMenuToggle
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                            className="sm:hidden"
                        />
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

                        < NavbarMenuItem key={`authentication`}>
                            <AuthIndicator />
                        </NavbarMenuItem>
                    </NavbarMenu>
                </Navbar >
            </header>
        }
    </>)
};

export default NavigationComponent