'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { Delete } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export default function DeleteSection({ id }) {
    const router = useRouter()
    const handleDelete = async (id) => {
        const resDelete = await axios.delete(`/api/single-qus/${id}`)
        toast.success('Question deleted sucessfully')
        router.refresh()

    }
    return (
        <>
            <DropdownMenuItem
                // onClick={handleDelete}
                onClick={() => handleDelete(id)}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 cursor-pointer">
                <Delete

                    className="w-4 h-4" />
                <span>Delete</span>
            </DropdownMenuItem>
        </>
    )
}
