// portfolio/src/app/api/verify-code/route.ts

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    // Get the access code from environment variable
    const correctCode = process.env.ACCESS_CODE;

    // Validate that the environment variable is set
    if (!correctCode) {
      console.error("ACCESS_CODE environment variable not set");
      return Response.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    // Compare the provided code with the correct code
    if (code === correctCode) {
      return Response.json(
        { success: true, message: "Access granted" },
        { status: 200 }
      );
    } else {
      return Response.json(
        { success: false, message: "Incorrect code. Please try again." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    return Response.json(
      { success: false, message: "An error occurred. Please try again later." },
      { status: 500 }
    );
  }
}