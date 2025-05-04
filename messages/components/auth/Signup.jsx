"use client"
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

const Signup = () => {

    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);
    const router = useRouter();

    const cloudinaryUrl = process.env.NEXT_PUBLIC_CLOUDINARY_URL;
    const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET;
    const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    const handleSubmit = async (e) => {
        e.preventDefault();
        setPicLoading(true);
        if (!name || !email || !password || !confirmPassword) {
            alert("Please Fill All Fields");
            setPicLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords Do Not Match");
            setPicLoading(false);
            return;
        }
        // Add your signup logic here
        // use axios to send a post request to the backend with the user data
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_CHAT_EXPRESS_SERVER}/api/user`, {
                name,
                email,
                password,
                pic,
            });

            // localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            alert("Signup Successful");
            router.push("/messages/chats");
        }
        catch (error) {
            alert("Error Occurred While Signing Up");
            setPicLoading(false);
        }

    }

    const postDetails = (pics) => {
        setPicLoading(true);
        if (pics === undefined) {
            alert("Please Select an Image");
            setPicLoading(false);
            return;
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", cloudinaryPreset);
            data.append("cloud_name", cloudinaryCloudName);
            fetch(cloudinaryUrl, {
                method: "POST",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    setPicLoading(false);
                });
        } else {
            alert("Please Select an Image of Type JPEG or PNG");
            setPicLoading(false);
            return;
        }
        alert("Image Uploaded Successfully");
    }

    return (
        <div>
            <form className='flex flex-col items-center justify-center' onSubmit={handleSubmit}>
                <div className="form-control w-full max-w-xs mb-4">
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input type="text" placeholder="Your Name" className="input input-bordered w-full max-w-xs" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-control w-full max-w-xs mb-4">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input type="email" placeholder="Your Email" className="input input-bordered w-full max-w-xs" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-control w-full max-w-xs mb-4 relative">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <div className='flex items-center'>
                        <input type={show ? "text" : "password"} placeholder="Password" className="input input-bordered w-full max-w-xs" onChange={(e) => setPassword(e.target.value)} />
                        <span
                            className='absolute right-2 cursor-pointer font-semibold btn btn-sm'
                            onClick={() => setShow(!show)}
                        >{show ? "Hide" : "Show"}</span>
                    </div>
                </div>
                <div className="form-control w-full max-w-xs mb-4 relative">
                    <label className="label">
                        <span className="label-text">Confirm Password</span>
                    </label>
                    <div className='flex items-center'>
                        <input type={show ? "text" : "password"} placeholder="Confirm Password" className="input input-bordered w-full max-w-xs" onChange={(e) => setConfirmPassword(e.target.value)} />
                        <span
                            className='absolute right-2 cursor-pointer font-semibold btn btn-sm'
                            onClick={() => setShow(!show)}
                        >{show ? "Hide" : "Show"}</span>
                    </div>
                </div>
                <div className="form-control w-full max-w-xs mb-4">
                    <label className="label">
                        <span className="label-text">Upload your Picture</span>
                    </label>
                    <input type="file" accept='image/*' className="input input-bordered w-full max-w-xs font-bold" onChange={(e) => postDetails(e.target.files[0])} />
                </div>
                <button type='submit' className='btn bg-sky-500 w-full max-w-xs outline-0 text-white hover:bg-sky-600'>{picLoading ? "Loading..." : "Sign Up"}</button>
            </form>
        </div>
    )
}

export default Signup