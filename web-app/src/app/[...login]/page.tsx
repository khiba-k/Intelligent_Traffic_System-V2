"use client";
import { SignIn, useUser } from "@clerk/nextjs";

const SignInPage = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
