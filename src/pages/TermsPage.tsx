
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              By accessing or using the HealMeal application, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Not Medical Advice</h2>
            <p className="mb-4">
              The content provided through HealMeal, including meal suggestions and nutritional information, is for informational purposes only and is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p className="mb-4">
              Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary needs.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">User Responsibilities</h2>
            <p className="mb-4">
              You are responsible for providing accurate information about your health conditions, allergies, and dietary preferences. HealMeal's meal suggestions are based on the information you provide.
            </p>
            <p className="mb-4">
              You acknowledge that following any dietary suggestions is done at your own risk and discretion.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of any significant changes by updating the date at the top of these terms.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsPage;
