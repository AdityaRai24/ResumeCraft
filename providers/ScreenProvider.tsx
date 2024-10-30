"use client";
import { useState, useEffect } from "react";

export default function ScreenProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div>
      {isMobile ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">
              Best Experience on Larger Screens
            </h2>
            <p>
              For the best experience, please open this website on a laptop or
              PC.
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
