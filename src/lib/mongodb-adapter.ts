import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
	throw new Error(
		"Please define the MONGODB_URI environment variable inside .env"
	);
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	const globalWithMongo = global as typeof globalThis & {
		_promises: Promise<MongoClient>[];
	};

	if (!globalWithMongo._promises) {
		globalWithMongo._promises = [];
	}

	if (globalWithMongo._promises.length === 0) {
		client = new MongoClient(uri, options);
		globalWithMongo._promises.push(client.connect());
	}
	clientPromise = globalWithMongo._promises[0];
} else {
	// In production mode, it's best to not use a global variable.
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

export default clientPromise;
