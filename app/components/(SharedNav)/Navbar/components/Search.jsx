'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import axios from 'axios'

export default function SearchInputs() {

    // Normal search states
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')

    // AI search states
    const [isAiSearchOpen, setIsAiSearchOpen] = useState(false)
    const [aiInput, setAiInput] = useState('')
    const [chatHistory, setChatHistory] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const dropdownRef = useRef(null)


    // Update URL when searchTerm changes 
    // For Normal search 
    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (searchTerm) {
            params.set('search', searchTerm)
        } else {
            params.delete('search')
        }
        router.push(`${pathName}?${params.toString()}`)
    }, [router, searchParams, searchTerm, pathName])


    // For Normal search 
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
    }

    // For AI search

    // Close the AI search
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsAiSearchOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)

    }, [])

    // Handle AI input change
    const handleAiInputChange = (value) => {
        setAiInput(value)
    }

    // Handle AI chat submission
    const handleAiSubmit = async () => {
        if (!aiInput.trim()) return

        const userMessage = { role: 'user', content: aiInput }
        setChatHistory((prev) => [...prev, userMessage])
        setAiInput('')
        setIsLoading(true)

        try {
            const res = await axios.post('/api/ai-chat', {
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    ...chatHistory,
                    userMessage
                ]
            })
            const aiMessage = { role: 'assistant', content: res.data.choices[0].message.content }
            setChatHistory((prev) => [...prev, aiMessage])

        } catch (error) {
            console.error('Error fetching AI response:', error)
            const errorMessage = { role: 'assistant', content: 'Sorry, I couldn’t respond. Please try again.' }
            setChatHistory((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    // Handle Enter key for AI input
    const handleAiKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleAiSubmit()
        }
    }




    return (
        <div className='relative'>
            {/* Single input for normal search */}
            <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
                onClick={() => setIsAiSearchOpen(true)}
                className="input input-bordered w-32 md:w-sm lg:w-[500px] text-black bg-white" />
            {/* Dual inputs for AI search */}
            {isAiSearchOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
                >
                    <Command>
                        <CommandInput
                            placeholder="Ask AI anything..."
                            value={aiInput}
                            onValueChange={handleAiInputChange}
                            onKeyDown={handleAiKeyPress}
                            className="w-full"
                        />
                        <CommandList className="max-h-60 overflow-y-auto">
                            {isLoading && (
                                <CommandEmpty>
                                    <div className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin h-5 w-5 text-gray-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            />
                                        </svg>
                                    </div>
                                </CommandEmpty>
                            )}
                            {chatHistory.length === 0 && !isLoading && (
                                <CommandEmpty>Start typing to chat with AI...</CommandEmpty>
                            )}
                            {chatHistory.length > 0 && (
                                <CommandGroup>
                                    {chatHistory.map((message, index) => (
                                        <CommandItem
                                            key={index}
                                            className={`flex justify-${message.role === 'user' ? 'end' : 'start'
                                                }`}
                                        >
                                            <div
                                                className={`p-2 rounded-lg ${message.role === 'user'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-black'
                                                    }`}
                                            >
                                                {message.content}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                    <button
                        onClick={handleAiSubmit}
                        className="w-full p-2 bg-primary text-white rounded-b-lg hover:bg-primary-dark"
                        disabled={isLoading}
                    >
                        Send
                    </button>
                </div>
            )}
        </div>
    )
}
