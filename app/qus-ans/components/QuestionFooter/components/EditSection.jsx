'use client'
import { Edit } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from 'react-hook-form'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

export default function EditSection({ id, card }) {
    const { data: session } = useSession()
    const [blogContent, setBlogContent] = useState('')
    const fetchBlogContent = async () => {
        try {
            const { data } = await axios(`/api/single-qus/${id}/edit`)
            setBlogContent(data?.content || '')
            return data
        } catch (error) {
            return null
        }
    }
    useEffect(() => {
        fetchBlogContent()
    }, [id])
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm()

    useEffect(() => {
        if (blogContent) {
            setValue('content', blogContent)
        }
    }, [blogContent, setValue])
    const onSubmit = async (data) => {

        try {
            const res = await axios.patch(`/api/single-qus/${id}/edit`, { content: data.content })
            toast.success('Post updated sucessfully')
            await fetchBlogContent()
        } catch (error) {
            console.error('Post edit failed')
            toast.error('Post edit failed')
        }
    }
    return (
        <>
            <Dialog>
                {(card?.email === session?.user?.email) && <DialogTrigger asChild>
                    <div className="flex items-center space-x-4 hover:bg-gray-100 p-2 cursor-pointer rounded-md">
                        <Edit className="w-4 h-4" />
                        <span className='text-sm'>Edit</span>
                    </div>
                </DialogTrigger>}

                <DialogContent className="sm:max-w-[600px] lg:max-w-[800px] xl:max-w-[900px]">
                    <DialogHeader>
                        <DialogTitle>Edit your post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="text-white md:p-6 rounded-lg shadow-lg space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                // placeholder="Type your message here."
                                className="w-full h-40 text-black"
                                {...register('content', { required: 'Content is required' })}
                            />
                            {errors.content && (
                                <p className="text-red-500 text-sm">{errors.content.message}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
