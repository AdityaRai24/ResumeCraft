"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  FileText,
  Download,
  Check,
  Timer,
  Shield,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { poppinsFont } from "@/lib/font";
import { useUser } from "@clerk/nextjs";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const benefits = [
  {
    icon: <FileText className="text-primary" size={24} />,
    title: "Premium Templates",
    description: "Access our entire collection of professional templates",
  },
  {
    icon: <Download className="text-primary" size={24} />,
    title: "Unlimited Downloads",
    description: "Download as many resumes as you need, whenever you need",
  },
  {
    icon: <Star className="text-primary" size={24} />,
    title: "Lifetime Access",
    description: "One-time payment for permanent premium features",
  },
  {
    icon: <Timer className="text-primary" size={24} />,
    title: "Instant Access",
    description: "Start creating professional resumes immediately",
  },
];

export default function PremiumPaymentPage() {
  const AMOUNT = 99;
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useUser();
  const premiumUser = useMutation(api.premiumUsers.makeUserPremium);
  const router = useRouter();

  if (!user || !user.id) {
    return null;
  }

  const checkPayment = async () => {
    try {
      const res = await premiumUser({ userId: user.id });
      if (res.success) {
        toast.success("Welcome to Premium!");
        router.push("/build-resume/templates");
      }
    } catch (error: any) {
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
        description: "Premium Membership",
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
      toast.error("Error while processing payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Navbar />
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className={`${poppinsFont.className} min-h-screen bg-gray-50/50`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 py-12"
        >
          {/* Header Section */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-center mb-16 space-y-4"
          >
            <motion.div
              variants={item}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-2"
            >
              <Sparkles size={20} />
              <span className="font-medium">Limited Time Offer</span>
            </motion.div>
            <motion.h1
              variants={item}
              className="text-4xl md:text-5xl font-bold bg-linear-to-r from-primary to-primary/60 text-transparent bg-clip-text"
            >
              Upgrade to Premium
            </motion.h1>
            <motion.p
              variants={item}
              className="text-gray-600 text-lg max-w-2xl mx-auto"
            >
              Take your resume to the next level with our premium features
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Benefits Section */}
            <motion.div
              variants={container}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <div className="grid gap-2">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex gap-4 cursor-pointer bg-white p-6 rounded-xl shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="bg-primary/10 p-3 rounded-lg h-fit">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Pricing Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="sticky top-6 overflow-hidden bg-white border-2 border-primary/20 shadow-xl shadow-primary/10">
                <div className="absolute top-4 right-4">
                  <span className="bg-green-100 text-green-600 px-4 py-1 rounded-full text-sm font-medium">
                    BEST VALUE
                  </span>
                </div>
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Lifetime Premium</h2>
                    <p className="text-gray-600">
                      One-time payment, forever access
                    </p>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">₹{AMOUNT}</span>
                    <span className="text-gray-600 line-through">₹499</span>
                    <span className="text-green-600 font-medium">80% OFF</span>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full h-12 text-lg font-medium group"
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        Upgrade Now
                        <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <div className="pt-6 border-t">
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="flex -space-x-2">
                          {["/visa.png", "/mastercard.png", "/upi.png"].map(
                            (src, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                              >
                                <Image
                                  src={src}
                                  alt="Payment method"
                                  width={40}
                                  height={40}
                                  className="rounded-md bg-white"
                                />
                              </motion.div>
                            )
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          Secured by{" "}
                          <Image
                            src="/razorpay.png"
                            alt="Razorpay"
                            width={60}
                            height={20}
                            className="inline"
                          />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Shield size={16} className="text-primary" />
                        100% secure payment
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
