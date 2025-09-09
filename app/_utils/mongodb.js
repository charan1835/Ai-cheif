import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodrecipe';

if (!uri) {
	console.error('MONGODB_URI is not set');
}

let cached = global._mongoCached;
if (!cached) {
	cached = global._mongoCached = { client: null, db: null };
}

export async function connectToDatabase() {
	if (cached.db) {
		return { client: cached.client, db: cached.db };
	}
	const client = new MongoClient(uri, { maxPoolSize: 10 });
	await client.connect();
	const db = client.db(dbName);
	cached.client = client;
	cached.db = db;
	return { client, db };
}

export async function getDb() {
	const { db } = await connectToDatabase();
	return db;
}
