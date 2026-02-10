import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import AccessCodeEmail from '@/emails/AccessCodeEmail';

const DB_NAME = "portfolio_db"; 
const COLLECTION_NAME = "access_requests";

// Helper for timeout race
const timeout = (ms: number) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Connection timed out')), ms)
);

export async function POST(request: Request) {
  const headers = { 'Content-Type': 'application/json' };

  try {
    // 1. PRE-FLIGHT CHECK
    const apiKey = process.env.RESEND_API_KEY;
    const mongoUri = process.env.MONGODB_URI;

    if (!apiKey || !mongoUri) {
      console.error('[AUTH] Missing environment variables in Production');
      return new Response(
        JSON.stringify({ message: 'Server configuration error: Environment variables missing.' }), 
        { status: 500, headers }
      );
    }

    const resend = new Resend(apiKey);
    const body = await request.json();
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ message: 'Valid email required.' }), { status: 400, headers });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expires_at = new Date(Date.now() + 15 * 60 * 1000);

    // 2. DATABASE ATTEMPT (Aggressive Timeout)
    console.log(`[AUTH] DB Start: ${email}`);
    try {
      // Race against 5 seconds. Vercel Hobby tier limit is 10s.
      // We use 5s to ensure we have time to return a JSON response before Vercel kills us.
      const mongoClient = await Promise.race([
        clientPromise,
        timeout(5000)
      ]) as any;
      
      const db = mongoClient.db(DB_NAME);
      await db.collection(COLLECTION_NAME).insertOne({
        email: email.toLowerCase(),
        code,
        expires_at,
        created_at: new Date(),
        used_at: null,
      });
      console.log(`[AUTH] DB Success`);
    } catch (dbError: any) {
      console.error('[AUTH] DB ERROR:', dbError.message);
      return new Response(
        JSON.stringify({ 
          message: 'Database connection failed. Is IP 0.0.0.0/0 whitelisted in Atlas?',
          error: dbError.message 
        }), 
        { status: 503, headers }
      );
    }

    // 3. EMAIL ATTEMPT
    console.log(`[AUTH] Email Start`);
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Access <noreply@brianmaina.de>', 
      to: email,
      subject: 'Your Access Code - Brian Maina Portfolio',
      react: AccessCodeEmail({ validationCode: code }),
    });

    if (error) {
      console.error('[AUTH] Resend Error:', error);
      return new Response(JSON.stringify({ message: 'Email rejected.', error }), { status: 422, headers });
    }

    console.log(`[AUTH] Success: ${data?.id}`);
    return new Response(JSON.stringify({ message: 'Code sent.' }), { status: 200, headers });

  } catch (error: any) {
    console.error('[AUTH] Global Catch:', error.message);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500, headers });
  }
}