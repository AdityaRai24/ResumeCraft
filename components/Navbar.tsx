"use client";
import { ChevronDown, File } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {  poppinsFont } from "@/lib/font";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from 'nextjs-toploader/app';

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const router = useRouter();

  return (
    <div className="shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <div
        className={`${poppinsFont.className} w-[85%] mx-auto flex items-center justify-between py-4`}
      >
        <div className="flex items-center gap-2">
          <File size={32} />
          <Link href="/">
            {" "}
            <h1 className="text-2xl font-semibold ">
              Resume<span className="text-primary">Craft</span>
            </h1>
          </Link>
        </div>

        {!isLoaded && <div className="flex items-center justify-center gap-2">
            <Skeleton className="w-[120px] h-[32px] bg-slate-500/20"/>
            <Skeleton className="w-[100px] h-[32px] bg-slate-500/20"/>
            <Skeleton className="w-[38px] h-[38px] rounded-full bg-slate-500/20 "/>
          </div>}
        {isSignedIn && (
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push(`/my-resumes`)}
              variant="outline"
            >
              {" "}
              My Resumes
            </Button>

            <h1 className="text-xl font-semibold">{user?.firstName}</h1>
            <UserButton />
          </div>
        )}

        {!isSignedIn && isLoaded && (
          <div className="flex items-center justify-center gap-4">
            <Button className="cursor-pointer" variant="ghost">
              <div className="hover:scale-[1.02] active:scale-[0.97] transition duration-300 ease-in-out">
                <SignInButton>Login</SignInButton>
              </div>
            </Button>
            <div className="hover:scale-[1.02] active:scale-[0.97] transition duration-300 ease-in-out">
              <Button className="cursor-pointer">
                <SignUpButton>
                  <h1 className="text-[13px]">Create Free Account</h1>
                </SignUpButton>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
