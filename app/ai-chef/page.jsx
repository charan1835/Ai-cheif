"use client"
import React, { useState } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { generateRecipe, generateFoodImages } from "../_utils/GlobalApi"

export default function AIChefPage() {
  const { isSignedIn } = useUser()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [error, setError] = useState("")
  const [imagePrompt, setImagePrompt] = useState("")

  if (!isSignedIn) {
    return (
      <div className="px-5 py-16 max-w-2xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-2">AI Chef</h1>
        <p className="text-white/80 mb-6">Sign in to chat with the AI Chef and generate personalized recipes.</p>
        <SignInButton mode="redirect" redirectUrl="/sign-in">
          <button className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold">Sign in</button>
        </SignInButton>
      </div>
    )
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
    const userMsg = { role: 'user', text: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)
    try {
      const res = await generateRecipe(trimmed)
      const aiText = res?.text || "(No response)"
      setMessages(prev => [...prev, { role: 'ai', text: aiText }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Failed to generate. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const generateImage = async () => {
    const prompt = imagePrompt.trim() || [...messages].reverse().find(m => m.role === 'ai')?.text || input.trim()
    if (!prompt) {
      setError('Enter a prompt or generate a recipe first')
      return
    }
    setLoading(true)
    try {
      const res = await generateFoodImages(prompt, { aspectRatio: '16:9', numberOfImages: 1 })
      setImages(res?.images || [])
      setError("")
    } catch (e) {
      setError(typeof e?.message === 'string' ? e.message : 'Failed to generate images')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 py-10 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-orange-200 bg-clip-text text-transparent">AI Chef</h1>
        <p className="text-white/80 mt-1">Ask for recipes, substitutions, or meal plans. Example: "High-protein veg dinner for 2"</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat panel */}
        <div className="lg:col-span-2 rounded-2xl bg-black/90 ring-1 ring-white/50 backdrop-blur flex flex-col h-[70vh]">
          <div className="p-4 overflow-y-auto space-y-3 flex-1">
            {messages.length === 0 && (
              <div className="text-black text-sm">Start the conversation by asking for a recipe idea…</div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-pink-50 ml-auto text-gray-900' : 'bg-black text-gray-900'}`}>
                <div className="font-semibold mb-1">{m.role === 'user' ? 'You' : 'AI Chef'}</div>
                <div className="whitespace-pre-wrap leading-relaxed text-white">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="px-3 py-2 rounded-2xl bg-black text-gray-700 text-sm w-fit">AI Chef is typing…</div>
            )}
          </div>
          <div className="p-3 border-t border-black/60">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage() }}
                placeholder="Describe the recipe you want…"
                className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-black text-white placeholder:text-white/60 focus:outline-none"
              />
              <button onClick={sendMessage} disabled={loading} className="px-4 py-2 rounded-xl bg-black hover:bg-pink-600 text-white font-semibold disabled:opacity-60">Send</button>
              <button onClick={generateImage} disabled={loading || (!input.trim() && !messages.some(m => m.role==='ai'))} className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold disabled:opacity-60">Image</button>
            </div>
          </div>
        </div>

        {/* Image panel */}
        <div className="rounded-2xl bg-black/90 ring-1 ring-white/50 backdrop-blur p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Generated Images</h2>
            <button onClick={() => setImages([])} className="text-xs text-white/60 hover:text-white">Clear</button>
          </div>
          
          <div className="mb-3">
            <input
              value={imagePrompt}
              onChange={e => setImagePrompt(e.target.value)}
              placeholder="Custom image prompt (optional)"
              className="w-full px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none text-sm"
            />
          </div>
          
          {images.length === 0 ? (
            <div className="text-white/60 text-sm">No images yet. Enter a prompt and click Image.</div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {images.map((b64, i) => (
                <img key={i} src={`data:image/png;base64,${b64}`} alt="Generated food" className="w-full rounded-lg shadow" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


