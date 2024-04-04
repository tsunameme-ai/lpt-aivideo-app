'use client'
import React from "react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarMenuItem, Link, NavbarMenu, NavbarBrand } from "@nextui-org/react";
import { useGenerationContext } from "@/context/generation-context";


const NavigationComponent: React.FC = () => {

    const gContext = useGenerationContext()
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
        ['Create', '/txt2img'],
        ['Gallery', '/gallery'],
        ['About', '/about']
    ];

    return (<>
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <p className="font-bold text-inherit">Tsunameme</p>
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
                            className="w-full"
                            href={item[1]}
                            size="lg"
                        >
                            <div className="text-2xl leading-10">{item[0]}</div>
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar >
    </>)
};

export default NavigationComponent