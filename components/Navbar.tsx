"use client";
import { ChevronDown, File, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { poppinsFont } from "@/lib/font";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div className={cn(`shadow-[0_2px_4px_rgba(0,0,0,0.1)] relative z-50 ${isMenuOpen ? "bg-white" : "bg-background"} `)}>
        <div
          className={`${poppinsFont.className} w-[90%] md:w-[85%] mx-auto flex items-center justify-between py-4`}
        >
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <File className="size-6 md:size-8" />
            <Link href="/">
              <h1 className="text-xl md:text-2xl font-semibold">
                Resume<span className="text-primary">Craft</span>
              </h1>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 hover:bg-gray-100 rounded-md"
          >
            {isMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </button>

          {/* Loading State */}
          {!isLoaded && (
            <div className="hidden md:flex items-center justify-center gap-2">
              <Skeleton className="w-[120px] h-[32px] bg-slate-500/20" />
              <Skeleton className="w-[100px] h-[32px] bg-slate-500/20" />
              <Skeleton className="w-[38px] h-[38px] rounded-full bg-slate-500/20" />
            </div>
          )}

          {/* Desktop Navigation */}
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-4">
              <Button
                onClick={() => router.push(`/my-resumes`)}
                variant="outline"
              >
                My Resumes
              </Button>
              <h1 className="text-xl font-semibold">{user?.firstName}</h1>
              <UserButton />
            </div>
          )}

          {!isSignedIn && isLoaded && (
            <div className="hidden md:flex items-center justify-center gap-4">
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

        <div
          className={cn(
            "md:hidden absolute top-full left-0 right-0 border-b shadow-lg transition-all duration-300 ease-in-out",
            isMenuOpen ? "opacity-100 visible bg-white" : "opacity-0 bg-background invisible h-0"
          )}
        >
          <div className="w-[90%] mx-auto py-4 flex flex-col gap-4">
            {isSignedIn ? (
              <>
                <div className="flex items-center gap-2">
                  <UserButton />
                  <h1 className="text-lg font-semibold">{user?.firstName}</h1>
                </div>
                <Button
                  onClick={() => {
                    router.push(`/my-resumes`);
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full justify-start"
                >
                  My Resumes
                </Button>
              </>
            ) : (
              isLoaded && (
                <div className="flex flex-col gap-3">
                  <Button className="w-full justify-center" variant="secondary">
                    <div className="hover:scale-[1.02] active:scale-[0.97] transition duration-300 ease-in-out">
                      <SignInButton>Login</SignInButton>
                    </div>
                  </Button>
                  <div className="hover:scale-[1.02] active:scale-[0.97] transition duration-300 ease-in-out">
                    <Button className="w-full justify-center">
                      <SignUpButton>
                        <h1 className="text-[13px]">Create Free Account</h1>
                      </SignUpButton>
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
