"use client";
import React, { useState } from "react";
import {
  Star,
  FileText,
  Download,
  Check,
  FastForward,
  Timer,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { montserratFont, poppinsFont, ralewayFont } from "@/lib/font";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PremiumPaymentPage() {
  const AMOUNT = 100;
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();

  const premiumUser = useMutation(api.premiumUsers.makeUserPremium);
  const router = useRouter();

  if (!user || !user.id) {
    return;
  }

  const checkPayment = async () => {
    try {
      const res = await premiumUser({ userId: user.id });
      if (res.success) {
        toast.success("You are now a premium member");
        router.push("/build-resume/templates");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.data);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/createOrder", { method: "POST" });
      const data = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: AMOUNT * 100,
        currency: "INR",
        name: "Resume Craft",
        description: "Purchase Premium Plan",
        order_id: data.orderId,
        handler: function (response: any) {
          checkPayment();
        },
        prefill: {
          name: user?.firstName + " " + user?.lastName,
          email: user?.primaryEmailAddress,
        },
        theme: {
          color: "#e11d48",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className={`${poppinsFont.className} h-[90vh] p-6 space-y-6`}>
        <div className="flex flex-col items-center gap-2 my-16">
          <h1 className="font-semibold  text-4xl">
            Unlock Premium with a One-Time Purchase
          </h1>
          <p className="text-gray-600">Create your Job Winning Resume !!</p>
        </div>

        <div className="flex items-center max-w-[80%] mx-auto justify-center gap-16 ">
          <div className="w-[40%]">
            <div className="bg-gray-50 shadow-sm shadow-primary/20 px-4 py-8 rounded-lg  mb-6">
              <ul className="space-y-6">
                <li className="flex items-center gap-2">
                  <FileText className="text-green-600" size={20} />
                  <span>Access to All Premium Templates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Download className="text-green-600" size={20} />
                  <span>Unlimited Downloads</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="text-green-600" size={20} />
                  <span>Lifetime Premium Membership</span>
                </li>
                <li className="flex items-center gap-2">
                  <Timer className="text-green-600" size={20} />
                  <span>Instant Access</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-1/2">
            <Card className="cursor-pointer border-2 border-primary shadow-md shadow-primary/20 rounded-2xl overflow-hidden">
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-normal">Lifetime Premium</h2>
                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                    BEST DEAL
                  </span>
                </div>

                <div className={` flex items-baseline gap-2`}>
                  <span className="text-3xl font-bold">₹99</span>
                  <span className="text-gray-600">one-time payment</span>
                </div>
              </div>
            </Card>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full mt-4 disabled:opacity-20 font-semibold py-6 px-6 rounded-lg transition-colors"
            >
              {isProcessing ? "Processing Payment..." : "Upgrade"}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <img src="/visa.png" alt="Visa" className="h-8" />
                <img src="/mastercard.png" alt="Mastercard" className="h-8" />
                <img src="/upi.png" alt="Google Pay" className="h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2  !mt-12 justify-center">
          <span className="text-sm text-gray-600">
            Secured by{" "}
            <img src="/razorpay.png" className="h-4" alt="Razorpay" />
          </span>
        </div>
      </div>
    </>
  );
}
