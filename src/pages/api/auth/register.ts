// src/pages/api/auth/register.ts
import type { APIRoute } from "astro";
import { getAuth } from "firebase-admin/auth";
import { app } from "../../../firebase/server";
export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const auth = getAuth(app);

  /* Get form data */
  const { name, email, password } = await request.json();

  if (!email || !password || !name) {
    return new Response("Missing form data", { status: 400 });
  }

  /* Create user */
  try {
    await auth.createUser({
      email,
      password,
      displayName: name,
    });

    console.log("Criando usuário com os seguintes dados:");
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Name:", name);
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return new Response("Email already in use.", { status: 400 });
    } else if (error.code === "auth/weak-password") {
      return new Response("Password is too weak.", { status: 400 });
    } else {
      return new Response("Something went wrong.", { status: 500 }); // Or log the error
    }
  }
  return redirect("/login");
};
