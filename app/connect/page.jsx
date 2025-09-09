"use client"
import React, { useEffect, useMemo, useState } from 'react'
import { useUser, SignInButton } from '@clerk/nextjs'
import { requestFriend, acceptFriend, listFriends, listPending } from '../_utils/GlobalApi'

export default function ConnectPage() {
	const { isSignedIn, user } = useUser()
	const [email, setEmail] = useState('')
	const [toEmail, setToEmail] = useState('')
	const [friends, setFriends] = useState([])
	const [pending, setPending] = useState([])
	const [status, setStatus] = useState('')

	const clerkEmail = useMemo(() => user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '', [user])

	useEffect(() => { if (clerkEmail) setEmail(clerkEmail) }, [clerkEmail])

	useEffect(() => {
		if (!email) return
		;(async () => {
			try {
				const f = await listFriends(email)
				setFriends(f.friends || [])
				const p = await listPending(email)
				setPending(p.pending || [])
			} catch (e) {
				setStatus(typeof e?.message === 'string' ? e.message : 'Failed to load')
			}
		})()
	}, [email])

	const handleSendRequest = async () => {
		setStatus('')
		try {
			await requestFriend(email, toEmail)
			setStatus('Request sent')
			setToEmail('')
			const p = await listPending(email)
			setPending(p.pending || [])
		} catch (e) {
			setStatus(typeof e?.message === 'string' ? e.message : 'Failed to send request')
		}
	}

	const handleAccept = async (fromEmail) => {
		setStatus('')
		try {
			await acceptFriend(email, fromEmail)
			const f = await listFriends(email)
			setFriends(f.friends || [])
			const p = await listPending(email)
			setPending(p.pending || [])
			setStatus('Friend added')
		} catch (e) {
			setStatus(typeof e?.message === 'string' ? e.message : 'Failed to accept')
		}
	}

	if (!isSignedIn && !email) {
		return (
			<div className="px-5 py-16 max-w-2xl mx-auto text-white">
				<h1 className="text-3xl font-bold mb-2">Connect</h1>
				<p className="text-white/80 mb-6">Sign in to add friends and chat.</p>
				<SignInButton mode="redirect" redirectUrl="/sign-in">
					<button className="px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold">Sign in</button>
				</SignInButton>
			</div>
		)
	}

	return (
		<div className="px-5 py-10 max-w-4xl mx-auto">
			<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 via-rose-300 to-orange-200 bg-clip-text text-transparent">Connect</h1>
			<p className="text-white/80 mt-1 mb-6">Add friends by email and accept pending requests.</p>

			{status && (
				<div className="mb-4 text-sm text-white bg-white/10 border border-white/20 rounded-md px-3 py-2">{status}</div>
			)}

			<div className="grid md:grid-cols-2 gap-6">
				{/* Add friend by email */}
				<div className="rounded-2xl bg-black/90 ring-1 ring-white/50 backdrop-blur p-4">
					<h2 className="text-sm font-semibold text-white mb-3">Add Friend</h2>
					<div className="flex gap-2">
						<input value={toEmail} onChange={e => setToEmail(e.target.value)} placeholder="friend@example.com" className="flex-1 px-3 py-2 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/50 focus:outline-none text-sm" />
						<button onClick={handleSendRequest} disabled={!toEmail} className="px-3 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold disabled:opacity-60">Send</button>
					</div>
				</div>

				{/* Pending requests */}
				<div className="rounded-2xl bg-black/90 ring-1 ring-white/50 backdrop-blur p-4">
					<h2 className="text-sm font-semibold text-white mb-3">Pending Requests</h2>
					{pending.length === 0 ? (
						<div className="text-white/60 text-sm">No pending requests.</div>
					) : (
						<ul className="space-y-2">
							{pending.map((p) => (
								<li key={p} className="flex items-center justify-between">
									<div className="text-white/80 text-sm">{p}</div>
									<div className="flex gap-2">
										<button onClick={() => handleAccept(p)} className="px-2 py-1 rounded bg-emerald-600 text-white text-xs">Accept</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>

				{/* Friends list */}
				<div className="rounded-2xl bg-black/90 ring-1 ring-white/50 backdrop-blur p-4 md:col-span-2">
					<h2 className="text-sm font-semibold text-white mb-3">Friends</h2>
					{friends.length === 0 ? (
						<div className="text-white/60 text-sm">No friends yet.</div>
					) : (
						<ul className="grid sm:grid-cols-2 gap-2">
							{friends.map((f) => (
								<li key={f} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
									<div className="text-white/80 text-sm">{f}</div>
									<a href={`/ai-chef?dm=${encodeURIComponent(f)}`} className="text-xs px-2 py-1 rounded bg-white/10 text-white hover:bg-white/20">Start Chat</a>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	)
}
