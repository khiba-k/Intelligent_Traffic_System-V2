"use client";
import { SignIn, useUser } from "@clerk/nextjs";

const SignInPage = () => {
  const { isSignedIn, user } = useUser();

  return (
    <div>
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/sign-up" />
    </div>
  );
};

export default SignInPage;
