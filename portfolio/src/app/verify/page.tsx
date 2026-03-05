import clientPromise from "@/lib/mongodb";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { Resend } from "resend";
import SubscriptionConfirmedEmail from "@/emails/SubscriptionConfirmedEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function VerifyPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ token?: string }> 
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    return <ErrorScreen message="No verification token provided." />;
  }

  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    // 1. First, find the user so we can get their email and nickname for the welcome message
    const user = await db.collection("subscribers").findOne({ verificationToken: token });

    if (!user) {
      return <ErrorScreen message="Invalid or expired verification link." />;
    }

    // 2. Update their status to verified and remove the token
    await db.collection("subscribers").updateOne(
      { _id: user._id },
      { 
        $set: { 
          verified: true, 
          subscribed: true,
          updatedAt: new Date()
        },
        $unset: { verificationToken: "" } 
      }
    );

    // 3. Send the final confirmation welcome email
    await resend.emails.send({
      from: "Brian Maina <hello@brianmaina.de>",
      to: user.email,
      subject: "Welcome to my design newsletter!",
      react: SubscriptionConfirmedEmail({ 
        nickname: user.nickname || "there", 
        userEmail: user.email 
      }),
    });

    // 4. Show the success screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-teal-500 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Email Verified!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for confirming your email. Your subscription is confirmed and a welcome email is on its way.
          </p>
          <Link href="/" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-6 rounded-md transition-colors">
            Return to Portfolio
          </Link>
        </div>
      </div>
    );

  } catch (error) {
    console.error("Verification Error:", error);
    return <ErrorScreen message="A database error occurred. Please try again later." />;
  }
}

function ErrorScreen({ message }: { message: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Verification Failed</h1>
        <p className="text-gray-600 mb-8">{message}</p>
        <Link href="/" className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-6 rounded-md transition-colors">
          Return to Portfolio
        </Link>
      </div>
    </div>
  );
}