"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// Define the steps for onboarding
const STEPS = {
  BASIC_INFO: 0,
  PHYSICAL_MEASUREMENTS: 1,
  ACTIVITY_GOALS: 2,
  DIETARY_PREFERENCES: 3,
  COMPLETE: 4,
};

// Define types for our form data
type HeightData = {
  value: string;
  unit: string;
  inches: string;
};

type WeightData = {
  value: string;
  unit: string;
};

type FormData = {
  age: string;
  gender: string;
  height: HeightData;
  weight: WeightData;
  activityLevel: string;
  goal: string;
  dietaryPreferences: string[];
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(STEPS.BASIC_INFO);
  const [formData, setFormData] = useState<FormData>({
    age: "",
    gender: "",
    height: {
      value: "",
      unit: "cm",
      inches: "",
    },
    weight: {
      value: "",
      unit: "kg",
    },
    activityLevel: "",
    goal: "",
    dietaryPreferences: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateNestedFormData = <P extends 'height' | 'weight', K extends keyof FormData[P]>(
    parent: P,
    field: K,
    value: FormData[P][K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  }; 

  const handleSubmit = async () => {
    try {
      console.log('Starting onboarding submission...');
      
      // Set loading state
      setIsSubmitting(true);
      
      // Calculate BMR, TDEE, and nutrition goals based on user data
      const age = parseInt(formData.age);
      const gender = formData.gender;
      const weightValue = parseFloat(formData.weight.value);
      const weightInKg = formData.weight.unit === 'kg' ? weightValue : weightValue * 0.453592;
      
      // Calculate height in cm
      const heightValue = parseFloat(formData.height.value);
      let heightInCm = formData.height.unit === 'cm' ? heightValue : 0;
      if (formData.height.unit === 'ft') {
        const inches = parseFloat(formData.height.inches || '0');
        heightInCm = (heightValue * 30.48) + (inches * 2.54);
      }
      
      // Calculate BMR using Mifflin-St Jeor Equation
      let bmr = 0;
      if (gender === 'male') {
        bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
      } else if (gender === 'female') {
        bmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
      } else {
        // For non-specified gender, use average of male and female formulas
        const maleBmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
        const femaleBmr = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
        bmr = Math.round((maleBmr + femaleBmr) / 2);
      }
      
      // Calculate TDEE based on activity level
      let activityMultiplier = 1.2; // Default: Sedentary
      
      switch (formData.activityLevel) {
        case 'sedentary':
          activityMultiplier = 1.2;
          break;
        case 'light':
          activityMultiplier = 1.375;
          break;
        case 'moderate':
          activityMultiplier = 1.55;
          break;
        case 'very':
          activityMultiplier = 1.725;
          break;
        case 'extra':
          activityMultiplier = 1.9;
          break;
      }
      
      const tdee = Math.round(bmr * activityMultiplier);
      
      // Calculate target calories based on goal
      let dailyCalorieTarget = tdee; // Default: maintain weight
      
      switch (formData.goal) {
        case 'lose':
          dailyCalorieTarget = Math.round(tdee * 0.8); // 20% deficit
          break;
        case 'gain':
          dailyCalorieTarget = Math.round(tdee * 1.15); // 15% surplus
          break;
        case 'build':
          dailyCalorieTarget = Math.round(tdee * 1.1); // 10% surplus
          break;
      }
      
      // Calculate macronutrient goals
      const dailyProtein = Math.round(weightInKg * (formData.goal === 'build' ? 2.2 : 1.8)); // Higher protein for muscle building
      const dailyFat = Math.round((dailyCalorieTarget * 0.25) / 9); // 25% of calories from fat
      const dailyCarbs = Math.round((dailyCalorieTarget - (dailyProtein * 4) - (dailyFat * 9)) / 4); // Remaining calories from carbs
      
      // Prepare data with correct field names
      const userDetailsData = {
        ...formData,
        bmr: Math.round(bmr),
        tdee,
        dailyCalorieTarget,
        dailyProtein,
        dailyCarbs,
        dailyFat
      };
      
      console.log('Sending user details to API:', JSON.stringify(userDetailsData));
      
      // Now save the user details
      const response = await fetch('/api/user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetailsData),
        credentials: 'include' // This ensures cookies are sent with the request
      });
  
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save user details');
      }
      
      console.log('User details saved successfully:', responseData);
      
      // Show success toast
      toast.success('Profile setup complete! Redirecting to dashboard...');
      
      // Use a short delay before redirecting to allow the toast to be seen
      setTimeout(() => {
        // Use the Next.js router for client-side navigation instead of window.location
        router.push('/dashboard');
      }, 1500);
      
    } catch (error) {
      console.error('Error saving user details:', error);
      setIsSubmitting(false);
      // Show error toast
      toast.error('Error saving user details: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl p-6 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to CalorieTrackers</h1>
          <p className="text-gray-500 mt-2">
            Let's set up your profile to get personalized nutrition recommendations
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between">
            {Object.values(STEPS).slice(0, -1).map((stepValue, index) => (
              <div
                key={index}
                className={`flex flex-col items-center ${
                  step >= stepValue ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    step >= stepValue ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>
                <span className="text-xs hidden sm:inline">
                  {Object.keys(STEPS)[index].replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full"></div>
            <div
              className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
              style={{ width: `${(step / (Object.keys(STEPS).length - 2)) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {step === STEPS.BASIC_INFO && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => updateFormData("age", e.target.value)}
                  min={13}
                  max={120}
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  id="gender"
                  className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                  value={formData.gender}
                  onChange={(e) => updateFormData("gender", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="not-specified">Prefer not to say</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 2: Physical Measurements */}
        {step === STEPS.PHYSICAL_MEASUREMENTS && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Physical Measurements</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      type="number"
                      placeholder="Height"
                      value={formData.height.value}
                      onChange={(e) => updateNestedFormData("height", "value", e.target.value)}
                      min={50}
                      max={300}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <select
                      id="height-unit"
                      className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                      value={formData.height.unit}
                      onChange={(e) => updateNestedFormData("height", "unit", e.target.value)}
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="ft">Feet/Inches (ft/in)</option>
                    </select>
                  </div>
                </div>
                {formData.height.unit === "ft" && (
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional inches
                    </label>
                    <Input
                      type="number"
                      placeholder="Inches"
                      value={formData.height.inches}
                      onChange={(e) => updateNestedFormData("height", "inches", e.target.value)}
                      min={0}
                      max={11}
                    />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <Input
                      type="number"
                      placeholder="Weight"
                      value={formData.weight.value}
                      onChange={(e) => updateNestedFormData("weight", "value", e.target.value)}
                      min={30}
                      max={500}
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <select
                      id="weight-unit"
                      className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                      value={formData.weight.unit}
                      onChange={(e) => updateNestedFormData("weight", "unit", e.target.value)}
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lb">Pounds (lb)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 3: Activity & Goals */}
        {step === STEPS.ACTIVITY_GOALS && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Activity & Goals</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <select
                  id="activityLevel"
                  className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                  value={formData.activityLevel}
                  onChange={(e) => updateFormData("activityLevel", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select activity level
                  </option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">Lightly active (light exercise/sports 1-3 days/week)</option>
                  <option value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</option>
                  <option value="very">Very active (hard exercise/sports 6-7 days a week)</option>
                  <option value="extra">Extra active (very hard exercise & physical job or 2x training)</option>
                </select>
              </div>
              <div>
                <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
                  Goal
                </label>
                <select
                  id="goal"
                  className="w-full h-[42px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 appearance-none bg-white"
                  value={formData.goal}
                  onChange={(e) => updateFormData("goal", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select goal
                  </option>
                  <option value="lose">Lose weight</option>
                  <option value="maintain">Maintain weight</option>
                  <option value="gain">Gain weight</option>
                  <option value="build">Build muscle</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        )}

        {/* Step 4: Dietary Preferences */}
        {step === STEPS.DIETARY_PREFERENCES && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Dietary Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select any dietary preferences (optional)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: "Vegetarian", value: "vegetarian" },
                  { label: "Vegan", value: "vegan" },
                  { label: "Pescatarian", value: "pescatarian" },
                  { label: "Gluten-free", value: "gluten-free" },
                  { label: "Dairy-free", value: "dairy-free" },
                  { label: "Keto", value: "keto" },
                  { label: "Paleo", value: "paleo" },
                  { label: "Low-carb", value: "low-carb" },
                ].map((preference) => (
                  <div key={preference.value} className="flex items-center">
                    <input
                      type="checkbox"
                      id={preference.value}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={formData.dietaryPreferences.includes(preference.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateFormData("dietaryPreferences", [
                            ...formData.dietaryPreferences,
                            preference.value,
                          ]);
                        } else {
                          updateFormData(
                            "dietaryPreferences",
                            formData.dietaryPreferences.filter((p) => p !== preference.value)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={preference.value}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {preference.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={isSubmitting}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </div>
                ) : (
                  'Complete Setup'
                )}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}