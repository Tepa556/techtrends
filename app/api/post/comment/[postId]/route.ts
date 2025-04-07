import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = `${process.env.MONGODB_URL}`;
const jwtSecret = `${process.env.JWT_SECRET}`;

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  const params = await context.params;
  const postId = params.postId;

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Token not provided' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  let currentUserEmail;

  try {
    const decoded = jwt.verify(token, jwtSecret) as { email: string };
    currentUserEmail = decoded.email;
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { text } = await req.json();
  if (!text || text.trim() === '') {
    return NextResponse.json({ error: 'Comment text cannot be empty' }, { status: 400 });
  }

  try {
    const client = new MongoClient(uri);
    await client.connect();
    const database = client.db('local');
    const postsCollection = database.collection('posts');
    const usersCollection = database.collection('users');

    // Find the user by email
    const user = await usersCollection.findOne({ email: currentUserEmail });
    if (!user) {
      await client.close();
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the post
    const post = await postsCollection.findOne({ _id: new ObjectId(postId) });
    if (!post) {
      await client.close();
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Create a new comment
    const newComment = {
      _id: new ObjectId().toString(),
      text,
      author: user.username,
      authorAvatar: user.avatar || '/user-avatar/default-avatar.jpg',
      createdAt: new Date().toISOString(),
    };

    // Ensure that `comments` exists and is an array before pushing
    if (!Array.isArray(post.comments)) {
      await postsCollection.updateOne(
        { _id: new ObjectId(postId) },
        { $set: { comments: [] } }
      );
    }

    // Push the new comment into the comments array
    await postsCollection.updateOne(
      { _id: new ObjectId(postId) },
      {
        $push: {
          comments: newComment
        } as any
      }
    );

    await client.close();
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
