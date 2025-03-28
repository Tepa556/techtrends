import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = `${process.env.MONGODB_URL}`;

export async function GET() {
    const client = new MongoClient(uri);
    try {
        // Connect to the client
        await client.connect();

        // Access the database and collection
        const database = client.db('local');
        const collection = database.collection('posts');

        // Fetch data from the collection
        const posts = await collection.find({}).toArray();

        // Return response using NextResponse
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        return NextResponse.json(
            { error: 'Error connecting to MongoDB' },
            { status: 500 }
        );
    } finally {
        // Close the connection
        await client.close();
    }
}
