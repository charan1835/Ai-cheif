import { auth } from '@clerk/nextjs/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
	try {
		const a = auth();
		return new Response(JSON.stringify({
			userId: a.userId || null,
			sessionId: a.sessionId || null,
			orgId: a.orgId || null,
		}), { status: 200, headers: { 'Content-Type': 'application/json' } });
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
	}
}
