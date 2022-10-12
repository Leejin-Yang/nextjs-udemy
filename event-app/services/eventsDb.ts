import { MongoClient } from 'mongodb'
import type { Sort } from 'mongodb'

export async function connectDB() {
  const client = await MongoClient.connect(
    `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.dixjhgb.mongodb.net/events?retryWrites=true&w=majority`
  )

  return client
}

interface Document {
  [key: string]: string
}

export async function insertDocument(
  client: MongoClient,
  collection: string,
  document: Document
) {
  const db = client.db()

  await db.collection(collection).insertOne(document)
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
