import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";

export const POST: APIRoute = async ({ request }) => {
  const { token } = await request.json();

  if (!token) {
    return new Response(JSON.stringify({ error: "Missing auth token" }), {
      status: 401,
    });
  }

  try {
    const decodedToken = await getAuth(app).verifyIdToken(token);
    return new Response(JSON.stringify({ user: decodedToken }), {
      status: 200,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401,
    });
  }
};
