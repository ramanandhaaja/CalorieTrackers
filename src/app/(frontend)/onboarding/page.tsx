"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

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
      const response = await fetch('/api/user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // This ensures cookies are sent with the request
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user details');
      }
  
      // Redirect to dashboard after successful submission
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving user details:', error);
      // Handle error (show error message to user)
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.height.unit}
                      onChange={(e) => updateNestedFormData("height", "unit", e.target.value)}
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="ft">Feet/Inches</option>
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
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.weight.unit}
                      onChange={(e) => updateNestedFormData("weight", "unit", e.target.value)}
                    >
                      <option value="kg">Kilograms (kg)</option>
                      <option value="lbs">Pounds (lbs)</option>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activity Level
                </label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.activityLevel}
                  onChange={(e) => updateFormData("activityLevel", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select activity level
                  </option>
                  <option value="sedentary">Sedentary (little or no exercise)</option>
                  <option value="light">
                    Lightly active (light exercise/sports 1-3 days/week)
                  </option>
                  <option value="moderate">
                    Moderately active (moderate exercise/sports 3-5 days/week)
                  </option>
                  <option value="very">Very active (hard exercise/sports 6-7 days a week)</option>
                  <option value="extra">
                    Extra active (very hard exercise & physical job or 2x training)
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goal</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.goal}
                  onChange={(e) => updateFormData("goal", e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Select fitness goal
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
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit}>Complete Setup</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}