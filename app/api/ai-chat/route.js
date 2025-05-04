import axios from "axios"
import { NextResponse } from "next/server"


export async function POST(req) {
    const { messages } = await req.json()
    try {
        const contents = messages.map((msg) => ({
            role: msg.role === 'system' ? 'user' : msg.role,
            parts: [{ text: msg.content }],
        }))


        const res = await axios.post('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
            {
                contents,
            },
            {
                params: {
                    key: process.env.GEMINI_API_KEY,
                },
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        const aiResponse = res.data.candidates[0].content.parts[0].text
        return NextResponse.json({
            choices: [
                {
                    message: {
                        role: 'assistant',
                        content: aiResponse,
                    }
                }
            ]
        })
    } catch (error) {
        console.error('Error fetching AI response:', error.response?.data || error.message)
        return NextResponse.json({ error: 'Failed to fetch AI response' }, { status: 500 })
    }
}