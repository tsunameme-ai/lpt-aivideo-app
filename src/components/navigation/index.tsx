'use client'
import React from "react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarMenuItem, Link, NavbarMenu } from "@nextui-org/react";


const NavigationComponent: React.FC = () => {

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuItems = [
        "Create",
        "Gallery",
        "About Us"
    ];

    return (<>
        <Navbar onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            className="w-full"
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    </>)
};

export default NavigationComponent