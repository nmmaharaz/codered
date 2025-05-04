

import SocialLoginReg from '../components/SocialLoginReg'

import backgroundImage from '@/public/assets/login-registerBG.jpg'

import LoginInputs from './components/logInInputs'
import Image from 'next/image'
import loginImage from '@/public/assets/Computer-login-pana.png'

export default function LoginPage() {
    return (
        <div
            className="relative min-h-screen flex items-center justify-center px-4 sm:px-6"
            style={{
                backgroundImage: `url(${backgroundImage.src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60 z-0" />

            {/* Content wrapper */}
            <div className="relative z-10 w-full max-w-6xl bg-white/10 backdrop-blur-md shadow-lg rounded-xl p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

                {/* Left side animation */}
                <div className="hidden md:block relative">
                    <Image src={loginImage} alt='Login Image' width={600} height={600} />
                </div>

                {/* Right side: form */}
                <div className="w-full max-w-md mx-auto">
                    {/* <LoginInputs /> */}
                    <LoginInputs />
                    <div className="divider divider-accent text-white">Social Logins</div>
                    <SocialLoginReg />
                </div>
            </div>
        </div>
    )
}

