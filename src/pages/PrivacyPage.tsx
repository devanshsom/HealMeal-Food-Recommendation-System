
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const PrivacyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Your Privacy Matters</h2>
            <p className="mb-4">
              HealMeal is committed to protecting the privacy of our users. This Privacy Policy explains how we collect, use, and safeguard your information when you use our service.
            </p>
            <p className="mb-4">
              We collect personal information that you voluntarily provide to us when you use our application, such as your name, email address, and health data. This data is used solely to provide you with personalized meal recommendations.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              The health information you provide is used only to generate personalized meal suggestions tailored to your specific health conditions and dietary restrictions.
            </p>
            <p className="mb-4">
              We do not share your personal information with third parties except as necessary to provide our services or as required by law.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              We implement appropriate security measures to protect against unauthorized access to or unauthorized alteration, disclosure, or destruction of data.
            </p>
            <p className="mb-4">
              However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p>
              If you have any questions about our privacy practices, please contact us at privacy@healmeal.com.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPage;
