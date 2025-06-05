
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const Index = () => {
  const { userProfile, isProfileComplete } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-heal-50 to-calm-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="headline mb-6">
              Meals Designed to <span className="text-primary">Heal</span> and{" "}
              <span className="text-secondary">Nourish</span>
            </h1>
            <p className="subheadline mb-8">
              Personalized meal suggestions for individuals with chronic health
              conditions, tailored to your specific needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isProfileComplete ? (
                <Link to="/meals">
                  <Button size="lg" className="w-full sm:w-auto">
                    View Your Meal Suggestions
                  </Button>
                </Link>
              ) : (
                <Link to="/profile">
                  <Button size="lg" className="w-full sm:w-auto">
                    Create Your Profile
                  </Button>
                </Link>
              )}
              <Link to="/tracker">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Track Your Meals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            How HealMeal Helps You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-heal-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-heal-600"
                >
                  <path d="M3 7V5c0-1.1.9-2 2-2h2"></path>
                  <path d="M17 3h2c1.1 0 2 .9 2 2v2"></path>
                  <path d="M21 17v2c0 1.1-.9 2-2 2h-2"></path>
                  <path d="M7 21H5c-1.1 0-2-.9-2-2v-2"></path>
                  <rect x="7" y="7" width="10" height="10" rx="1"></rect>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Personalized Recommendations
              </h3>
              <p className="text-muted-foreground">
                Receive meal suggestions tailored to your specific health
                conditions, allergies, and dietary preferences.
              </p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-heal-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-heal-600"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Nutrition-Aware Planning
              </h3>
              <p className="text-muted-foreground">
                Each meal is designed with nutritional balance in mind to support
                your healing journey and overall wellbeing.
              </p>
            </Card>

            <Card className="p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-heal-100 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-heal-600"
                >
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6"></line>
                  <line x1="8" x2="8" y1="2" y2="6"></line>
                  <line x1="3" x2="21" y1="10" y2="10"></line>
                  <path d="m9 16 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Easy Meal Tracking
              </h3>
              <p className="text-muted-foreground">
                Keep track of your meals and monitor how your diet affects your
                health over time with our simple tracking tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Profile Status */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6">Your HealMeal Profile</h2>
            
            {isProfileComplete ? (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <Badge variant="default" className="bg-heal-500">
                    Profile Complete
                  </Badge>
                </div>
                <p className="mb-4">
                  Welcome back, <span className="font-semibold">{userProfile?.name}</span>! 
                  Your personalized meal suggestions are ready.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link to="/profile">
                    <Button variant="outline">Update Profile</Button>
                  </Link>
                  <Link to="/meals">
                    <Button>View Meal Suggestions</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-center mb-4">
                  <Badge variant="outline">Profile Incomplete</Badge>
                </div>
                <p className="mb-4">
                  Complete your profile to get personalized meal suggestions tailored to your health needs.
                </p>
                <Link to="/profile">
                  <Button>Create Your Profile</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
