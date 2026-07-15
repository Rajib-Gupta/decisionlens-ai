import { Db, MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let clientPromise: Promise<MongoClient> | undefined;

export async function getDb(): Promise<Db> {
  if (!uri)
    throw new Error(
      "Persistence is not configured. Add MONGODB_URI to enable saved workspaces.",
    );
  if (!clientPromise) clientPromise = new MongoClient(uri).connect();
  return (await clientPromise).db();
}
