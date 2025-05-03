"use client";
import { SignIn, useUser } from "@clerk/nextjs";
import Image from "next/image";
import traffic1 from "@/assets/traffic1.jpg"; 

const SignInPage = () => {
  const { isSignedIn, user } = useUser();
  const backgroundImage = "https://images.unsplash.com/photo-1592817469774-1576c74cf6a3?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <div className="relative flex items-center justify-center h-screen">
      <div className="absolute inset-0">
        <img 
          src={backgroundImage}
          alt="Traffic Image"
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center bg-white bg-opacity-80 p-8 rounded-lg shadow-lg">
        <SignIn
          path="/login"
          routing="path"
          signUpUrl="/sign-up" />
      </div>
    </div>
  );
};

export default SignInPage;
