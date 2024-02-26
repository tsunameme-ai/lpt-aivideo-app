'use client'
import React from "react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarMenuItem, Link, NavbarMenu, NavbarBrand } from "@nextui-org/react";


const NavigationComponent: React.FC = () => {

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
                    <p><a href="">Groove</a></p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (

                    < NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color="foreground"
                            className="w-full"
                            href={item[1]}
                            size="lg"
                        >
                            {item[0]}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar >
    </>)
};

export default NavigationComponent