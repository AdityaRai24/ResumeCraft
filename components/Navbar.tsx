"use client";
import { File } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { geologicaFont } from "@/lib/font";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const router = useRouter()

  return (
    <div
      className={`${geologicaFont.className} w-[80%] mx-auto flex items-center justify-between my-6`}
    >
      <div className="flex items-center gap-2">
        <File size={40} />
       <Link href="/"> <h1 className="text-3xl font-semibold ">
          Resume<span className="text-primary">Craft</span>
        </h1></Link>
      </div>

      {!isLoaded && <h1>Loading...</h1>}
      {isSignedIn && (
        <div className="flex items-center gap-4">

          <Button onClick={()=>router.push(`/my-resumes`)} variant="outline"> My Resumes</Button>

          <h1 className="text-xl font-semibold">{user?.firstName}</h1>
          <UserButton />
        </div>
      )}

      {!isSignedIn && isLoaded && (
        <div className="flex items-center justify-center gap-4">
          <Button className="cursor-pointer" variant="outline">
            <div className="hover:scale-[1.1] active:scale-[0.97] transition duration-300 ease-in-out">
              <SignInButton>Login</SignInButton>
            </div>
          </Button>
          <div className="hover:scale-[1.1] active:scale-[0.97] transition duration-300 ease-in-out">
            <Button className="cursor-pointer">
              <SignUpButton>Signup</SignUpButton>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
