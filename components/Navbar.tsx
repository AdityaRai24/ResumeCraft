"use client";
import { ChevronDown, Crown, File, Laugh, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { poppinsFont } from "@/lib/font";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import Image from "next/image";
import { redirect } from "next/navigation";

const Navbar = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isPremiumMember = useQuery(api.premiumUsers.isPremiumMember, {
    userId: user?.id ? user?.id : "randomuserid",
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          `shadow-[0_2px_4px_rgba(0,0,0,0.1)] relative z-50 ${isMenuOpen ? "bg-white" : "bg-background"} `
        )}
      >
        <div
          className={`${poppinsFont.className} w-[90%] md:w-[85%] mx-auto flex items-center justify-between py-4`}
        >
          <div className="flex items-center gap-2">
            <Image src={"/favicon.svg"} width={32} height={32} alt="Icon" />
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
            <div className="flex items-center gap-4">
              <Skeleton className="w-[130px] h-[40px] bg-slate-500/20" />
              <Skeleton className="w-[130px] h-[40px] bg-slate-500/20" />
              <Skeleton className="w-[160px] h-[40px] bg-slate-500/20" />
            </div>
          )}
          {!isLoaded && (
            <div className="hidden md:flex items-center justify-center gap-2">
              <Skeleton className="w-[80px] h-[40px] bg-slate-500/20" />
              <Skeleton className="w-[38px] h-[38px] rounded-full bg-slate-500/20" />
            </div>
          )}

          <div className=" hidden md:flex items-center justify-center gap-6">
            {isSignedIn && isLoaded && (
              <>
                {/* <p
                  onClick={() => {
                    router.push(`/policies`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  Policies
                </p> */}
                <p
                  onClick={() => {
                    router.push(`/build-resume/templates`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  Dashboard
                </p>
                <p
                  onClick={() => {
                    router.push(`/my-resumes`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  My Resumes
                </p>{" "}
                <p
                  onClick={() => {
                    router.push(`/resume-analysis`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  Analyze Resume
                </p>{" "}
                {isPremiumMember === undefined && (
                  <Skeleton className="w-[160px] h-[40px] bg-slate-500/20" />
                )}
                {isPremiumMember === true && (
                  <Button
                    onClick={() =>
                      toast.success("You are already a premium member !!")
                    }
                    variant={"outline"}
                    className="flex gap-2 border-gray-800"
                  >
                    <Laugh /> Premium Member
                  </Button>
                )}
                {isPremiumMember === false && (
                  <Button
                    onClick={() => {
                      router.push(`/get-premium`);
                    }}
                    variant={"outline"}
                    className="flex gap-2 cursor-pointer border-gray-800"
                  >
                    <Crown /> Buy Premium
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          {isSignedIn && (
            <div className="hidden md:flex items-center gap-4">
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
            isMenuOpen
              ? "opacity-100 visible bg-white"
              : "opacity-0 bg-background invisible h-0"
          )}
        >
          <div className="w-[90%] mx-auto py-4 flex flex-col gap-4">
            {isSignedIn ? (
              <>
                {/* <p
                  onClick={() => {
                    router.push(`/policies`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  Policies
                </p> */}
                <div className="flex items-center gap-2">
                  <UserButton />
                  <h1 className="text-lg font-semibold">{user?.firstName}</h1>
                </div>
                <p
                  onClick={() => {
                    router.push(`/build-resume/templates`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  Dashboard
                </p>
                <p
                  onClick={() => {
                    router.push(`/my-resumes`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  My Resumes
                </p>{" "}
                <p
                  onClick={() => {
                    router.push(`/resume-analysis`);
                    setIsMenuOpen(false);
                  }}
                  className="text-gray-600 cursor-pointer"
                >
                  Analyze Resume
                </p>{" "}
                {isPremiumMember ? (
                  <Button
                    onClick={() =>
                      toast.success("You are already a premium member !!")
                    }
                    variant={"outline"}
                    className="flex gap-2 border-gray-800"
                  >
                    <Laugh /> Premium Member
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      router.push(`/get-premium`);
                    }}
                    variant={"outline"}
                    className="flex gap-2 border-gray-800"
                  >
                    <Crown /> Upgrade
                  </Button>
                )}
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
