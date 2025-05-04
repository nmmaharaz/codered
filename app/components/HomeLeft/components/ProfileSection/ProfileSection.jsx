'use client'

import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import profilePic from "@/public/assets/profile-pic.png"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfileSection() {
    const { data: session } = useSession()
    return (
        <>
            {session?.user && <div className='flex flex-col pt-10 px-3.5 gap-2.5 border-t-2 border-red-800'>
                <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full overflow-hidden mx-auto">
                        <Image
                            src={session?.user?.image || profilePic}
                            width={90}
                            height={90}
                            alt="Profile image"
                        />
                    </div>
                    <h1>{session?.user?.name}</h1>
                </div>

                <Button className="bg-gradient-to-br from-green-400 to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-green-200 dark:focus:ring-green-800">
                    <Link href={'/profile'} className="w-full">
                        Profile
                    </Link>
                </Button>
                <Button
                    onClick={() => signOut()}
                    className="btn cursor-pointer bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800">Log Out</Button>

            </div>}
        </>

    )
}
