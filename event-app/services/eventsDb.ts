import { MongoClient, ObjectId } from 'mongodb'
import type { Sort } from 'mongodb'

export async function connectDB() {
  const client = await MongoClient.connect(
    `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.dixjhgb.mongodb.net/events?retryWrites=true&w=majority`
  )

  return client
}

interface Document {
  email: string
}

export async function insertDocument<T extends Document>(
  client: MongoClient,
  collection: string,
  document: T
) {
  const db = client.db()

  const result = await db.collection(collection).insertOne(document)

  return result
}

export async function getAllDocuments(
  client: MongoClient,
  collection: string,
  filter: { [key: string]: string } = {},
  sort: Sort
) {
  const db = client.db()
  const document = await db
    .collection(collection)
    .find(filter)
    .sort(sort) // 내림차순
    .toArray()

  return document
}
