
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { HealthCondition } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const healthConditions: { id: HealthCondition; label: string }[] = [
  { id: "diabetes", label: "Diabetes" },
  { id: "hypertension", label: "Hypertension (High Blood Pressure)" },
  { id: "celiac_disease", label: "Celiac Disease" },
  { id: "crohns_disease", label: "Crohn's Disease" },
  { id: "ulcerative_colitis", label: "Ulcerative Colitis" },
  { id: "ibs", label: "Irritable Bowel Syndrome (IBS)" },
  { id: "cancer", label: "Cancer" },
  { id: "hypothyroidism", label: "Hypothyroidism" },
  { id: "hyperthyroidism", label: "Hyperthyroidism" },
  { id: "arthritis", label: "Arthritis" },
  { id: "lupus", label: "Lupus" },
  { id: "multiple_sclerosis", label: "Multiple Sclerosis" },
  { id: "parkinsons", label: "Parkinson's Disease" },
  { id: "alzheimers", label: "Alzheimer's Disease" },
  { id: "heart_disease", label: "Heart Disease" },
  { id: "kidney_disease", label: "Kidney Disease" },
  { id: "liver_disease", label: "Liver Disease" },
  { id: "high_cholesterol", label: "High Cholesterol" },
  { id: "none", label: "None of the above" },
];

const commonAllergies = [
  "Dairy",
  "Eggs",
  "Peanuts",
  "Tree nuts",
  "Soy",
  "Wheat",
  "Fish",
  "Shellfish",
  "Gluten",
];

const ProfilePage = () => {
  const { userProfile, setUserProfile, loading: profileLoading } = useUser();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    age: 0,
    height: 0,
    weight: 0,
    gender: "other" as "male" | "female" | "other",
    conditions: [] as HealthCondition[],
    allergies: [] as string[],
    dietaryPreferences: [] as string[],
  });

  const [otherAllergy, setOtherAllergy] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (userProfile) {
      setFormData({
        ...userProfile,
        // Ensure id is set correctly
        id: userProfile.id || (user ? user.id : ""),
      });
    } else if (user) {
      // If no profile but user exists, set the ID
      setFormData(prev => ({
        ...prev,
        id: user.id
      }));
    }
  }, [userProfile, authLoading, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // For numerical values, convert to number
    if (name === "age" || name === "height" || name === "weight") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData({
      ...formData,
      gender: value as "male" | "female" | "other",
    });
  };

  const handleConditionChange = (condition: HealthCondition, checked: boolean) => {
    setFormData({
      ...formData,
      conditions: checked
        ? [...formData.conditions, condition]
        : formData.conditions.filter((c) => c !== condition),
    });
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFormData({
      ...formData,
      allergies: checked
        ? [...formData.allergies, allergy]
        : formData.allergies.filter((a) => a !== allergy),
    });
  };

  const handleAddOtherAllergy = () => {
    if (otherAllergy.trim() !== "" && !formData.allergies.includes(otherAllergy.trim())) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, otherAllergy.trim()],
      });
      setOtherAllergy("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Ensure the user ID is set
    if (!formData.id && user) {
      formData.id = user.id;
    }

    // Basic validation
    if (!formData.name) {
      toast({
        title: "Missing information",
        description: "Please enter your name.",
        variant: "destructive",
      });
      setFormError("Please enter your name");
      return;
    }

    if (formData.age <= 0) {
      toast({
        title: "Invalid age",
        description: "Please enter a valid age.",
        variant: "destructive",
      });
      setFormError("Please enter a valid age");
      return;
    }

    if (formData.height <= 0) {
      toast({
        title: "Invalid height",
        description: "Please enter a valid height.",
        variant: "destructive",
      });
      setFormError("Please enter a valid height");
      return;
    }

    if (formData.weight <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight.",
        variant: "destructive",
      });
      setFormError("Please enter a valid weight");
      return;
    }

    // If "none" is selected, clear other conditions
    let conditions = formData.conditions;
    
    // Ensure conditions is properly typed as HealthCondition[]
    if (formData.conditions.includes("none" as HealthCondition)) {
      conditions = ["none"] as HealthCondition[];
    }

    setLoading(true);
    
    try {
      console.log("Saving profile with data:", {
        ...formData,
        conditions,
      });
      
      // Save profile with correctly typed conditions
      await setUserProfile({
        ...formData,
        conditions,
      });

      // Navigate to meals page after successful save
      navigate("/meals");
    } catch (error) {
      console.error('Error saving profile:', error);
      setFormError("Failed to save profile. Please try again or check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Health Profile</h1>
        <p className="text-muted-foreground mb-8 text-center">
          Complete your profile to get personalized meal suggestions tailored to your health needs.
        </p>

        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic information to help us personalize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={formData.age || ""}
                      onChange={handleInputChange}
                      placeholder="Age in years"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      name="height"
                      type="number"
                      value={formData.height || ""}
                      onChange={handleInputChange}
                      placeholder="Height in cm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight || ""}
                      onChange={handleInputChange}
                      placeholder="Weight in kg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={handleGenderChange}
                    className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.height > 0 && formData.weight > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm font-medium">
                      BMI: {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Health Conditions</CardTitle>
              <CardDescription>
                Select any health conditions you have been diagnosed with
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthConditions.map((condition) => (
                  <div
                    key={condition.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={condition.id}
                      checked={formData.conditions.includes(condition.id)}
                      onCheckedChange={(checked) =>
                        handleConditionChange(condition.id, checked === true)
                      }
                    />
                    <Label htmlFor={condition.id}>{condition.label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Allergies</CardTitle>
              <CardDescription>
                Select any food allergies or sensitivities you have
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {commonAllergies.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={`allergy-${allergy}`}
                      checked={formData.allergies.includes(allergy)}
                      onCheckedChange={(checked) =>
                        handleAllergyChange(allergy, checked === true)
                      }
                    />
                    <Label htmlFor={`allergy-${allergy}`}>{allergy}</Label>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <Label htmlFor="otherAllergy">Add other allergy</Label>
                <div className="flex space-x-2">
                  <Input
                    id="otherAllergy"
                    value={otherAllergy}
                    onChange={(e) => setOtherAllergy(e.target.value)}
                    placeholder="Enter allergy"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddOtherAllergy}
                  >
                    Add
                  </Button>
                </div>
              </div>

              {formData.allergies.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm mb-2">Your allergies:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.allergies.map((allergy) => (
                      <Badge
                        key={allergy}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => handleAllergyChange(allergy, false)}
                          className="ml-1 rounded-full hover:bg-muted w-4 h-4 inline-flex items-center justify-center"
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
