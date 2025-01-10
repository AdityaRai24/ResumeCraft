"use client";
import React, { useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const page = () => {
 

  return (
    <div>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <button onClick={handlePayment} disabled={isProcessing}>
        {isProcessing ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default page;
