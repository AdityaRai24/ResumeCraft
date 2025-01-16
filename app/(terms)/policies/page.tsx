import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";

const PoliciesPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            ResumeCraft Policies
          </h1>

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-2">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
              <TabsTrigger value="terms">Terms</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="cancellation">Cancellation</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">About ResumeCraft</h2>
                <div className="space-y-4">
                  <p>
                    ResumeCraft is your premier destination for creating
                    ATS-friendly resumes that help you stand out in today&apos;s
                    competitive job market. Our platform offers both free and
                    premium templates designed to maximize your chances of
                    getting through Applicant Tracking Systems and catching the
                    recruiter&apos;s eye.
                  </p>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Our Templates
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Free Templates: Access to basic ATS-friendly templates
                      </li>
                      <li>
                        Premium Templates: Enhanced designs with advanced ATS
                        optimization features
                      </li>
                      <li>
                        One-time Payment: Lifetime access to all premium
                        templates
                      </li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
                <div className="space-y-4">
                  <p>
                    We&apos;re here to help you create the perfect resume. Get
                    in touch with our support team:
                  </p>
                  <div className="space-y-2">
                    <p>📧 Email: support@resumecraft.com</p>
                    <p>💬 Response Time: Within 24 hours</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="shipping" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Shipping & Delivery</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Digital Delivery
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>
                        Instant access to all templates upon account creation
                      </li>
                      <li>
                        Premium features activated immediately after payment
                      </li>
                      <li>No physical products or shipping involved</li>
                      <li>24/7 access to your resume templates and designs</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Terms and Conditions
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Usage Terms</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Templates are for personal use only</li>
                      <li>Premium access is linked to a single account</li>
                      <li>Resumes created are owned by the user</li>
                      <li>Templates may not be resold or redistributed</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Account Terms
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Users must maintain accurate account information</li>
                      <li>Accounts found to be misused may be terminated</li>
                      <li>One premium subscription per user</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Privacy Policy</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Data Collection
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Basic account information (name, email)</li>
                      <li>Resume content you create</li>
                      <li>Payment information (processed securely)</li>
                      <li>Usage statistics for service improvement</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Data Protection
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Industry-standard encryption</li>
                      <li>Secure data storage</li>
                      <li>No sharing with third parties</li>
                      <li>Regular security audits</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="cancellation" className="mt-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  Cancellation & Refund Policy
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Premium Purchase
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Premium access is a one-time payment</li>
                      <li>Provides lifetime access to premium templates</li>
                      <li>Non-refundable after purchase</li>
                      <li>Cannot be transferred to another account</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Account Cancellation
                    </h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Free accounts can be cancelled anytime</li>
                      <li>Premium access remains non-refundable</li>
                      <li>Data handling per privacy policy</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default PoliciesPage;
