import { Resend } from 'resend';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import AccessCodeEmail from '@/emails/AccessCodeEmail';

// Environment variable validation
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  console.warn('[AUTH] Warning: RESEND_API_KEY is not defined in environment variables.');
}

const resend = new Resend(apiKey);
const DB_NAME = "portfolio_db"; 
const COLLECTION_NAME = "access_requests";

export async function POST(request: Request) {
  try {
    // 1. Validate Request Body
    const body = await request.json().catch(() => ({}));
    const { email } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.log('[AUTH] Rejected: Invalid or missing email address.');
      return Response.json({ message: 'A valid email address is required.' }, { status: 400 });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15-minute expiry

    // 2. Database Operation
    // We attempt this first because if we can't save it, we can't verify it later.
    console.log(`[AUTH] [DB] Attempting connection for: ${email}`);
    let db;
    try {
      const mongoClient = await clientPromise;
      db = mongoClient.db(DB_NAME);
      
      await db.collection(COLLECTION_NAME).insertOne({
        email: email.toLowerCase(),
        code,
        expires_at,
        created_at: new Date(),
        used_at: null,
      });
      console.log(`[AUTH] [DB] Code successfully stored.`);
    } catch (dbError: any) {
      console.error('[AUTH] [DB] ERROR:', dbError.message);
      
      // Check if it's a timeout/whitelist issue
      if (dbError.name === 'MongoServerSelectionError' || dbError.message.includes('timeout')) {
        return Response.json({ 
          message: 'Database connection failed. Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas.' 
        }, { status: 503 });
      }
      
      throw dbError; // Fall through to general catch
    }

    // 3. Email Operation
    console.log(`[AUTH] [EMAIL] Attempting to send to: ${email}`);
    const { data, error } = await resend.emails.send({
      // IMPORTANT: If 'brianmaina.de' is not verified in Resend Dashboard, this WILL fail.
      from: 'Portfolio Access <noreply@brianmaina.de>', 
      to: email,
      subject: 'Your Access Code - Brian Maina Portfolio',
      react: AccessCodeEmail({ validationCode: code }),
    });

    if (error) {
      console.error('[AUTH] [EMAIL] API ERROR:', error);
      
      // If the email fails, we should ideally delete the record or mark it as failed, 
      // but for now, we just inform the user.
      return Response.json({ 
        message: 'Email service rejected the request. Check domain verification in Resend.',
        code: error.name
      }, { status: 422 });
    }

    console.log(`[AUTH] [SUCCESS] Email sent! ID: ${data?.id}`);
    return Response.json({ message: 'Access code sent successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error('[AUTH] [CRITICAL] Internal Error:', error.message || error);
    
    return Response.json({ 
      message: 'An internal server error occurred.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    }, { status: 500 });
  }
}