"use client";
import { File } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  return (
    <div className="w-[80%] mx-auto flex items-center justify-between my-6">
      <div className="flex items-center gap-2">
        <File size={40}/>
        <h1 className="text-3xl font-semibold ">
         Resume<span className="text-primary">Craft</span>
        </h1>
      </div>

      {!isLoaded && (
          <h1>Loading...</h1>
      )}
      {isSignedIn && (
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">{user?.firstName}</h1>
            <UserButton />
          </div>
      )}

      {!isSignedIn && isLoaded && (
        <div className="flex items-center justify-center gap-4">
          <Button className="cursor-pointer" variant="outline">
            <SignInButton>Login</SignInButton>
          </Button>
          <Button className="cursor-pointer">
            <SignUpButton>Signup</SignUpButton>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
