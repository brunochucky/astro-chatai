import type { ServiceAccount } from "firebase-admin";
import { initializeApp, cert, getApps } from "firebase-admin/app";

const activeApps = getApps();

const getServiceAccount = (): ServiceAccount | undefined => {
  try {
    if (
      !import.meta.env.FIREBASE_PROJECT_ID ||
      !import.meta.env.FIREBASE_PRIVATE_KEY ||
      !import.meta.env.FIREBASE_CLIENT_EMAIL
    ) {
      throw new Error(
        "Missing Firebase service account environment variables."
      );
    }

    return {
      type: "service_account",
      project_id: import.meta.env.FIREBASE_PROJECT_ID,
      private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: import.meta.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
      client_id: import.meta.env.FIREBASE_CLIENT_ID,
      auth_uri: import.meta.env.FIREBASE_AUTH_URI,
      token_uri: import.meta.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
      client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
    } as ServiceAccount;
  } catch (error) {
    console.error("Failed to load Firebase service account:", error);
    return undefined;
  }
};

const initApp = () => {
  if (import.meta.env.PROD) {
    console.info("PROD environment detected. Using default service account.");
    return initializeApp();
  }

  console.info("Loading service account from environment variables.");
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      "Failed to initialize Firebase: Service account is invalid."
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
};

export const app = activeApps.length === 0 ? initApp() : activeApps[0];
