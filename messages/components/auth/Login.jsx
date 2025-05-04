"use client";

import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from "next/navigation";

const Login = () => {

    const [show, setShow] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!email || !password) {
            alert("Please Fill All Fields");
            setLoading(false);
            return;
        }

        try {
            const { data } = await axios.post(`https://katha-koi.onrender.com/api/user/login`, {
                email,
                password,
            });

            // localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            alert("Login Successful");
            router.push("/messages/chats");
        }
        catch (error) {
            alert("Error Occurred While Login");
            setLoading(false);
        }
    }

    const handelSetGustUserCredentials = () => {
        setEmail("guest@example.com");
        setPassword("12345678");
    }

    return (
        <div>
            <form className='flex flex-col items-center justify-center' onSubmit={handleSubmit}>
                <div className="form-control w-full max-w-xs mb-4">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input type="email" placeholder="Your Email" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)} value={email} />
                </div>
                <div className="form-control w-full max-w-xs mb-4 relative">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <div className='flex items-center'>
                        <input type={show ? "text" : "password"} placeholder="Password" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)} value={password} />
                        <span
                            className='absolute right-2 cursor-pointer font-semibold btn btn-sm'
                            onClick={() => setShow(!show)}
                        >{show ? "Hide" : "Show"}</span>
                    </div>
                </div>
                <button type='submit' className='btn bg-sky-500 w-full max-w-xs outline-0 text-white hover:bg-sky-600'>{loading ? "Loading..." : "Login"}</button>
                {/* <button type='button' onClick={handelSetGustUserCredentials} className='btn bg-amber-500 outline-0 text-white w-full max-w-xs hover:bg-amber-600 mt-2'>Use Gust Credentials</button> */}
            </form>
        </div>
    )
}

export default Login