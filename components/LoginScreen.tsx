import React from 'react';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import { auth } from '../services/firebase';

export const LoginScreen: React.FC = () => {
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            alert("Could not sign in with Google. Please check the console for more information.");
        }
    };

    const continueAsGuest = async () => {
        try {
            await signInAnonymously(auth);
        } catch (error: any) {
            console.error("Error signing in as guest", error);
            if (error.code === 'auth/admin-restricted-operation') {
                alert("Guest sign-in is not enabled for this project. Please enable Anonymous sign-in in your Firebase console's Authentication settings.");
            } else {
                alert("Could not sign in as a guest. Please check the console for more information.");
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-bkg z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center bg-surface p-8 rounded-themed shadow-themed animate-themed-enter">
                <h1 className="text-4xl font-bold text-text-primary mb-2 font-header">Welcome to Task Master</h1>
                <p className="text-text-secondary mb-8">Your AI-enhanced to-do list. Sign in to continue.</p>
                <div className="space-y-4">
                    <button
                        onClick={signInWithGoogle}
                        className="w-full theme-hover bg-primary hover:bg-primary-focus text-white font-bold py-3 px-6 rounded-themed transition-themed text-lg flex items-center justify-center gap-3"
                    >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.657-3.657-11.303-8.653l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
                            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.687 46.709 30.733 46.709 24c0-1.341-.138-2.65-.389-3.917z" />
                        </svg>
                        Sign in with Google
                    </button>
                    <button
                        onClick={continueAsGuest}
                        className="w-full theme-hover bg-secondary hover:bg-opacity-80 text-text-on-secondary-bkg font-bold py-3 px-6 rounded-themed transition-themed text-lg"
                    >
                        Continue as Guest
                    </button>
                </div>
            </div>
        </div>
    );
};