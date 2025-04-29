"use client";
import Logo from "@/assets/TKT_logo.png";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import Link from "next/link";
const Header = () => {
    return (
        <header className="shadow-md bg-slate-100 h-20">
            <div className="container mx-auto px-4 py-1 h-full flex items-center">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        {/* Logo can go here */}
                        <Image src={Logo} alt="Logo" width={50} height={50} className="mr-2 h-[100%]" />

                    </div>

                    <nav className="hidden md:flex items-center space-x-6">

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-gray-700 hover:text-amber-500 transition-colors">
                                    Contact Us <span className="ml-1">▼</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link href="/contact/email" className="w-full">
                                        Email Us
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/contact/phone" className="w-full">
                                        Call Us
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Link href="/contact/locations" className="w-full">
                                        Our Locations
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    )
}

export default Header
