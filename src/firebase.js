import { initializeApp, getApps } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.API_KEY,
    authDomain: import.meta.env.AUTH_DOMAIN,
    projectId: import.meta.env.PROJECT_ID,
    storageBucket: import.meta.env.STORAGE_BUCKET,
    messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
    appId: import.meta.env.APP_ID,
};

// Initialize Firebase only if it hasn't been initialized yet
let app;
if (typeof window !== 'undefined') {
    const apps = getApps();
    if (apps.length === 0) {
        app = initializeApp(firebaseConfig);
    } else {
        app = apps[0]; // Use the already initialized app
    }
}

export default app;
