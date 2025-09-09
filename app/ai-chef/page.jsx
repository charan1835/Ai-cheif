"use client"
import React, { useEffect, useMemo, useState } from "react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { generateRecipe, getUserChats, saveUserChats, listConversations, createConversation } from "../_utils/GlobalApi"

// Dynamic import to avoid bundling everything immediately
async function ensureDmConversation(email, targetEmail) {
  const res = await fetch('/api/conversations/dm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, targetEmail }),
  })
  const payload = await res.json()
  if (!res.ok) throw new Error(payload?.error || 'Failed to open DM')
  return payload.conversationId
}

export default function AIChefPage() {
  const { isSignedIn, user } = useUser()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [loadError, setLoadError] = useState("")
  const [email, setEmail] = useState("")

  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState("")
  const [convLoading, setConvLoading] = useState(false)

  const clerkEmail = useMemo(() => user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || "", [user])

  useEffect(() => {
    if (clerkEmail) setEmail(clerkEmail)
  }, [clerkEmail])

  // Load conversations when we have an email
  useEffect(() => {
    if (!email) return
    ;(async () => {
      setConvLoading(true)
      try {
        const data = await listConversations(email)
        const list = Array.isArray(data?.conversations) ? data.conversations : []
        setConversations(list)
        // If no active conversation selected, pick latest
        if (!activeConversationId && list.length > 0) {
          setActiveConversationId(String(list[0]._id))
        }
      } catch (e) {
        setLoadError(typeof e?.message === 'string' ? e.message : 'Failed to load conversations')
      } finally {
        setConvLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  // Load messages when active conversation changes
  useEffect(() => {
    if (!email || !activeConversationId) {
      setMessages([])
      return
    }
    ;(async () => {
      try {
        setLoadError("")
        const data = await getUserChats(email, activeConversationId)
        if (Array.isArray(data?.messages)) {
          setMessages(data.messages)
        } else {
          setMessages([])
        }
      } catch (e) {
        setLoadError(typeof e?.message === 'string' ? e.message : 'Failed to load chats')
        setMessages([])
      }
    })()
  }, [email, activeConversationId])

  useEffect(() => {
    if (!email) return
    const params = new URLSearchParams(window.location.search)
    const dm = params.get('dm')
    if (!dm) return
    ;(async () => {
      try {
        const convId = await ensureDmConversation(email, dm)
        setActiveConversationId(String(convId))
        // refresh conversations list
        try {
          const data = await listConversations(email)
          setConversations(Array.isArray(data?.conversations) ? data.conversations : [])
        } catch {}
      } catch (e) {
        setLoadError(typeof e?.message === 'string' ? e.message : 'Failed to open DM')
      }
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  const handleNewChat = async () => {
    if (!email) return
    try {
      const { conversation } = await createConversation(email, 'New chat')
      // Prepend new conversation to list and activate
      setConversations(prev => [{ ...conversation }, ...prev])
      setActiveConversationId(String(conversation._id))
      setMessages([])
      setInput("")
    } catch (e) {
      setLoadError(typeof e?.message === 'string' ? e.message : 'Failed to create conversation')
    }
  }

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || !email) return

    const userMsg = { role: 'user', text: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)
    setError("")

    try {
      // First persist user message; auto-create conversation if needed
      const saveUser = await saveUserChats([userMsg], email, activeConversationId || undefined, trimmed.slice(0, 60))
      const convId = String(saveUser?.conversationId || activeConversationId || "")
      if (convId && convId !== activeConversationId) {
        setActiveConversationId(convId)
        // Refresh conversations list to include/update this chat
        try {
          const data = await listConversations(email)
          setConversations(Array.isArray(data?.conversations) ? data.conversations : [])
        } catch {}
      }

      const res = await generateRecipe(trimmed)
      const aiText = res?.text || "(No response)"
      const aiMsg = { role: 'ai', text: aiText }
      setMessages(prev => [...prev, aiMsg])

      try { await saveUserChats([aiMsg], email, convId || activeConversationId || undefined) } catch {}
    } catch (e) {
      const fail = { role: 'ai', text: 'Failed to generate. Please try again.' }
      setMessages(prev => [...prev, fail])
      try { await saveUserChats([fail], email, activeConversationId || undefined) } catch {}
      setError(typeof e?.message === 'string' ? e.message : 'Failed to generate')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-5 py-10 max-w-6xl mx-auto">
      <div className="mb-3">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-orange-200 bg-clip-text text-transparent">AI Chef</h1>
        <p className="text-white/80 mt-1">Ask for recipes, substitutions, or meal plans. Example: "High-protein veg dinner for 2"</p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {!isSignedIn && (
          <>
            <input
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email to save chats"
              className="w-full md:w-96 px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none text-sm"
            />
            <SignInButton mode="redirect" redirectUrl="/sign-in">
              <button className="px-3 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold">Sign in</button>
            </SignInButton>
          </>
        )}
        {isSignedIn && (
          <div className="text-xs text-white/70">Saving chats as {email}</div>
        )}
      </div>

      {loadError && (
        <div className="mb-4 text-sm text-red-300 bg-white/10 border border-red-400/30 rounded-md px-3 py-2">
          {loadError}
        </div>
      )}

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
              <button onClick={sendMessage} disabled={loading || !email} className="px-4 py-2 rounded-xl bg-black hover:bg-pink-600 text-white font-semibold disabled:opacity-60">Send</button>
            </div>
            {error && <div className="text-xs text-red-300 mt-2">{error}</div>}
          </div>
        </div>

        {/* Conversations sidebar */}
        <div className="rounded-2xl bg-black/90 ring-1 ring-white/50 backdrop-blur p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Conversations</h2>
            <button onClick={handleNewChat} disabled={!email || convLoading} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20 disabled:opacity-60">New Chat</button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-white/60 text-sm">No conversations yet.</div>
            ) : (
              <ul className="space-y-1">
                {conversations.map((c) => (
                  <li key={String(c._id)} className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveConversationId(String(c._id))}
                      className={`flex-1 text-left px-3 py-2 rounded-lg text-sm ${String(c._id) === activeConversationId ? 'bg-white/20 text-white' : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'}`}
                    >
                      {c.title || 'Untitled chat'}
                    </button>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation()
                        if (!email) return
                        const ok = window.confirm('Delete this conversation? This cannot be undone.')
                        if (!ok) return
                        try {
                          const id = String(c._id)
                          const { deleteConversation } = await import('../_utils/GlobalApi')
                          await deleteConversation(email, id)
                          setConversations(prev => prev.filter(x => String(x._id) !== id))
                          if (activeConversationId === id) {
                            setActiveConversationId("")
                            setMessages([])
                          }
                        } catch (err) {
                          alert(typeof err?.message === 'string' ? err.message : 'Failed to delete')
                        }
                      }}
                      className="text-xs px-2 py-1 rounded bg-red-500/80 text-white hover:bg-red-500"
                      aria-label="Delete conversation"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


