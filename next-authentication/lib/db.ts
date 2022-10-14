import { MongoClient } from 'mongodb'

export async function connectToDatabase() {
  const client = await MongoClient.connect(
    `mongodb+srv://admin:${process.env.DB_PASSWORD}@cluster0.q0ufhdp.mongodb.net/auth?retryWrites=true&w=majority`
  )

  return client
}
