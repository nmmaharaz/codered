'use client'

import Navbar from "@/app/components/(SharedNav)/Navbar/Navbar"
import { usePathname } from "next/navigation"

export default function LayoutWrapper({ children }) {

    const pathname = usePathname()
    const hideNavbar = pathname === '/login' || pathname === '/register'
    return (
        <>
            {!hideNavbar && <Navbar />}
            <div className="bg-slate-950 text-white bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
                {children}
            </div>
        </>
    )
}