"use client";

import { HeaderLogo } from "./headerlogo";
import { Navigation } from "@/components/navigation";
import { useClerk } from "@clerk/nextjs"; // Import useClerk hook
import { UserButton,ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { WelcomeMsg } from "./welcome-msg";

export const Header = () => {
    const { signOut } = useClerk(); // Access the signOut method

    // Handle sign-out and redirect
    const handleSignOut = async () => {
        await signOut({ redirectUrl: "/" }); // Redirect to home after sign-out
    };

    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto"> 
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />
                        <Navigation />
                    </div>
                    <ClerkLoaded>
                        {/* Use a custom button for sign out */}
                        <button onClick={handleSignOut}>
                            <UserButton /> {/* This will show the User button, but use custom sign-out */}
                        </button>
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-100"/>
                    </ClerkLoading>
                </div>    
                <WelcomeMsg />   
            </div> 
        </header>
    );
};
