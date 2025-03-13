'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

// Define interfaces for form data
interface HeightData {
  value: number;
  unit: 'cm' | 'ft';
  inches?: number;
}

interface WeightData {
  value: number;
  unit: 'kg' | 'lbs';
}

interface UserDetailsFormValues {
  age: number;
  gender: 'male' | 'female' | 'not-specified';
  height: HeightData;
  weight: WeightData;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'lose' | 'maintain' | 'gain' | 'build';
  dietaryPreferences: string[];
  dailyCalorieTarget?: number;
  dailyProtein?: number;
  dailyCarbs?: number;
  dailyFat?: number;
  bmr?: number;
  tdee?: number;
}

// Dietary preferences options
const dietaryPreferencesOptions = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'gluten-free', label: 'Gluten-free' },
  { id: 'dairy-free', label: 'Dairy-free' },
  { id: 'keto', label: 'Keto' },
  { id: 'paleo', label: 'Paleo' },
  { id: 'low-carb', label: 'Low-carb' },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userDetailsId, setUserDetailsId] = useState<string | null>(null);
  
  // Form state
  const [formValues, setFormValues] = useState<UserDetailsFormValues>({
    age: 30,
    gender: 'not-specified',
    height: { value: 170, unit: 'cm' },
    weight: { value: 70, unit: 'kg' },
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryPreferences: [],
    dailyCalorieTarget: 2000,
    dailyProtein: 150,
    dailyCarbs: 200,
    dailyFat: 65,
    bmr: 0,
    tdee: 0,
  });

  // Fetch user details on component mount
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setFetchingData(true);
        setError(null);
        
        const response = await fetch('/api/user-details');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch user details');
        }
        
        const data = await response.json();
        
        if (data.docs && data.docs.length > 0) {
          const userDetails = data.docs[0];
          setUserDetailsId(userDetails.id);
          
          // Update form values with user details
          setFormValues({
            age: userDetails.age || 30,
            gender: userDetails.gender || 'not-specified',
            height: userDetails.height || { value: 170, unit: 'cm' },
            weight: userDetails.weight || { value: 70, unit: 'kg' },
            activityLevel: userDetails.activityLevel || 'moderate',
            goal: userDetails.goal || 'maintain',
            dietaryPreferences: userDetails.dietaryPreferences || [],
            dailyCalorieTarget: userDetails.dailyCalorieTarget || 2000,
            dailyProtein: userDetails.dailyProtein || 150,
            dailyCarbs: userDetails.dailyCarbs || 200,
            dailyFat: userDetails.dailyFat || 65,
            bmr: userDetails.bmr || 0,
            tdee: userDetails.tdee || 0,
          });
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch user details');
      } finally {
        setFetchingData(false);
      }
    }
    
    fetchUserDetails();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (userDetailsId) {
        // Update existing user details
        response = await fetch('/api/user-details', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            age: formValues.age,
            gender: formValues.gender,
            height: formValues.height,
            weight: formValues.weight,
            activityLevel: formValues.activityLevel,
            goal: formValues.goal,
            dietaryPreferences: formValues.dietaryPreferences,
            dailyCalorieTarget: formValues.dailyCalorieTarget,
            dailyProtein: formValues.dailyProtein,
            dailyCarbs: formValues.dailyCarbs,
            dailyFat: formValues.dailyFat,
            bmr: formValues.bmr,
            tdee: formValues.tdee,
          }),
        });
      } else {
        // Create new user details
        response = await fetch('/api/user-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            age: formValues.age,
            gender: formValues.gender,
            height: formValues.height,
            weight: formValues.weight,
            activityLevel: formValues.activityLevel,
            goal: formValues.goal,
            dietaryPreferences: formValues.dietaryPreferences,
            dailyCalorieTarget: formValues.dailyCalorieTarget,
            dailyProtein: formValues.dailyProtein,
            dailyCarbs: formValues.dailyCarbs,
            dailyFat: formValues.dailyFat,
            bmr: formValues.bmr,
            tdee: formValues.tdee,
          }),
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save user details');
      }
      
      const data = await response.json();
      setUserDetailsId(data.id);
      
      toast.success('Settings saved successfully!');
    } catch (err) {
      console.error('Error saving user details:', err);
      setError(err instanceof Error ? err.message : 'Failed to save user details');
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setFormValues((prev) => {
      // Handle nested fields (height, weight)
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof UserDetailsFormValues] as Record<string, any>),
            [child]: value,
          },
        };
      }
      
      // Handle checkbox arrays (dietaryPreferences, healthConditions, allergies)
      if (['dietaryPreferences', 'healthConditions', 'allergies'].includes(field)) {
        const arrayField = field as 'dietaryPreferences';
        const currentArray = prev[arrayField] || [];
        
        if (currentArray.includes(value)) {
          // Remove value if already selected
          return {
            ...prev,
            [field]: currentArray.filter((item) => item !== value),
          };
        } else {
          // Add value if not selected
          return {
            ...prev,
            [field]: [...currentArray, value],
          };
        }
      }
      
      // Handle regular fields
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  // Calculate BMR and TDEE based on user data
  const calculateMetabolicRates = () => {
    // Get user data
    const { age, gender, weight, height, activityLevel, goal } = formValues;
    
    // Convert weight to kg if in lbs
    const weightInKg = weight.unit === 'kg' ? weight.value : weight.value * 0.453592;
    
    // Convert height to cm if in ft/inches
    let heightInCm = height.unit === 'cm' ? height.value : 0;
    if (height.unit === 'ft') {
      heightInCm = (height.value * 30.48) + ((height.inches || 0) * 2.54);
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
    
    switch (activityLevel) {
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
    let calorieGoal = tdee; // Default: maintain weight
    
    switch (goal) {
      case 'lose':
        calorieGoal = Math.round(tdee * 0.8); // 20% deficit
        break;
      case 'gain':
        calorieGoal = Math.round(tdee * 1.15); // 15% surplus
        break;
      case 'build':
        calorieGoal = Math.round(tdee * 1.1); // 10% surplus
        break;
    }
    
    // Calculate macronutrient goals
    const proteinGoal = Math.round(weightInKg * (goal === 'build' ? 2.2 : 1.8)); // Higher protein for muscle building
    const fatGoal = Math.round((calorieGoal * 0.25) / 9); // 25% of calories from fat
    const carbGoal = Math.round((calorieGoal - (proteinGoal * 4) - (fatGoal * 9)) / 4); // Remaining calories from carbs
    
    // Update form values
    setFormValues(prev => ({
      ...prev,
      bmr: Math.round(bmr),
      tdee,
      dailyCalorieTarget: calorieGoal,
      dailyProtein: proteinGoal,
      dailyCarbs: carbGoal,
      dailyFat: fatGoal,
    }));
    
    // Show success message
    toast.success('Metabolic rates and nutrition goals calculated!');
  };

  if (fetchingData) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your profile...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Profile Settings</h1>
      
      {error && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="goals">Nutrition Goals</TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your basic personal information here.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      min={13}
                      max={120}
                      value={formValues.age}
                      onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                      required
                    />
                  </div>
                  
                  {/* Gender */}
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                    
                      value={formValues.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="not-specified">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Height */}
                <div className="space-y-2">
                  <Label>Height</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        min={50}
                        max={300}
                        value={formValues.height.value}
                        onChange={(e) => handleInputChange('height.value', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Select
                        value={formValues.height.unit}
                        onValueChange={(value) => handleInputChange('height.unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cm">Centimeters (cm)</SelectItem>
                          <SelectItem value="ft">Feet/Inches</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  {formValues.height.unit === 'ft' && (
                    <div className="mt-2">
                      <Label htmlFor="inches">Additional inches</Label>
                      <Input
                        id="inches"
                        type="number"
                        min={0}
                        max={11}
                        value={formValues.height.inches || 0}
                        onChange={(e) => handleInputChange('height.inches', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  )}
                </div>
                
                {/* Weight */}
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        min={30}
                        max={500}
                        value={formValues.weight.value}
                        onChange={(e) => handleInputChange('weight.value', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div>
                      <Select
                        value={formValues.weight.unit}
                        onValueChange={(value) => handleInputChange('weight.unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                {/* Dietary Preferences */}
                <div className="space-y-4">
                  <Label>Dietary Preferences</Label>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {dietaryPreferencesOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diet-${option.id}`}
                          checked={formValues.dietaryPreferences?.includes(option.id)}
                          onCheckedChange={() => {
                            handleInputChange('dietaryPreferences', option.id);
                          }}
                        />
                        <Label htmlFor={`diet-${option.id}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Nutrition Goals Tab */}
          <TabsContent value="goals">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Nutrition Goals</CardTitle>
                  <CardDescription>
                    Set your daily nutrition targets for tracking progress.
                  </CardDescription>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={calculateMetabolicRates}
                >
                  Calculate BMR & Goals
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Alert about Health & Fitness connection */}
                <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Health & Fitness Connection</AlertTitle>
                  <AlertDescription>
                    Your BMR, TDEE, and nutrition goals are calculated based on your age, gender, height, weight, activity level, and goal from the Health & Fitness tab.
                  </AlertDescription>
                </Alert>
                
                {/* Activity Level and Goal in a horizontal layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Level */}
                  <div className="space-y-2">
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select
                      value={formValues.activityLevel}
                      onValueChange={(value) => handleInputChange('activityLevel', value)}
                    >
                      <SelectTrigger id="activityLevel">
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                        <SelectItem value="light">Lightly active (light exercise/sports 1-3 days/week)</SelectItem>
                        <SelectItem value="moderate">Moderately active (moderate exercise/sports 3-5 days/week)</SelectItem>
                        <SelectItem value="very">Very active (hard exercise/sports 6-7 days a week)</SelectItem>
                        <SelectItem value="extra">Extra active (very hard exercise & physical job or 2x training)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Your activity level affects your daily calorie needs (TDEE calculation)</p>
                  </div>
                  
                  {/* Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="goal">Goal</Label>
                    <Select
                      value={formValues.goal}
                      onValueChange={(value) => handleInputChange('goal', value)}
                    >
                      <SelectTrigger id="goal">
                        <SelectValue placeholder="Select goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lose">Lose weight</SelectItem>
                        <SelectItem value="maintain">Maintain weight</SelectItem>
                        <SelectItem value="gain">Gain weight</SelectItem>
                        <SelectItem value="build">Build muscle</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Your goal determines your target calorie intake</p>
                  </div>
                </div>
                
                {/* Metabolic Information */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    Metabolic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* BMR */}
                    <div className="space-y-2">
                      <Label htmlFor="bmr">Basal Metabolic Rate (BMR)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="bmr"
                          type="number"
                          min={0}
                          max={10000}
                          value={formValues.bmr}
                          readOnly
                        />
                        <span className="text-sm text-gray-500">kcal/day</span>
                      </div>
                      <p className="text-xs text-gray-500">Calories your body needs at complete rest. Calculated using the Mifflin-St Jeor Equation.</p>
                    </div>
                    
                    {/* TDEE */}
                    <div className="space-y-2">
                      <Label htmlFor="tdee">Total Daily Energy Expenditure (TDEE)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="tdee"
                          type="number"
                          min={0}
                          max={10000}
                          value={formValues.tdee}
                          readOnly
                        />
                        <span className="text-sm text-gray-500">kcal/day</span>
                      </div>
                      <p className="text-xs text-gray-500">Total calories burned per day including activity. Calculated as BMR × activity multiplier (1.2-1.9).</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-blue-50 rounded-md text-xs text-blue-700">
                    <p className="font-medium mb-1">About these calculations:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      <li><strong>BMR Formula:</strong> Uses Mifflin-St Jeor Equation (10 × weight kg) + (6.25 × height cm) - (5 × age) + gender factor</li>
                      <li><strong>Activity Multipliers:</strong> Sedentary (1.2), Light (1.375), Moderate (1.55), Very active (1.725), Extra active (1.9)</li>
                      <li><strong>Calorie Goals:</strong> Based on your goal - Lose weight (20% deficit), Maintain (TDEE), Gain (15% surplus), Build muscle (10% surplus)</li>
                      <li><strong>Macronutrients:</strong> Protein (1.8-2.2g per kg bodyweight), Fat (25% of calories), Carbs (remaining calories)</li>
                    </ul>
                  </div>
                </div>
                
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                  Daily Targets
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Calorie Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="dailyCalorieTarget">Daily Calorie Goal (kcal)</Label>
                    <Input
                      id="dailyCalorieTarget"
                      type="number"
                      min={500}
                      max={10000}
                      value={formValues.dailyCalorieTarget}
                      onChange={(e) => handleInputChange('dailyCalorieTarget', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* Protein Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="dailyProtein">Daily Protein Goal (g)</Label>
                    <Input
                      id="dailyProtein"
                      type="number"
                      min={0}
                      max={1000}
                      value={formValues.dailyProtein}
                      onChange={(e) => handleInputChange('dailyProtein', parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500">Recommended: {Math.round((formValues.weight?.unit === 'kg' ? formValues.weight?.value : formValues.weight?.value * 0.453592) * 1.8)}g</p>
                  </div>
                  
                  {/* Carbs Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="dailyCarbs">Daily Carbs Goal (g)</Label>
                    <Input
                      id="dailyCarbs"
                      type="number"
                      min={0}
                      max={1000}
                      value={formValues.dailyCarbs}
                      onChange={(e) => handleInputChange('dailyCarbs', parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500">Typically 45-65% of total calories</p>
                  </div>
                  
                  {/* Fat Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="dailyFat">Daily Fat Goal (g)</Label>
                    <Input
                      id="dailyFat"
                      type="number"
                      min={0}
                      max={1000}
                      value={formValues.dailyFat}
                      onChange={(e) => handleInputChange('dailyFat', parseInt(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500">Typically 20-35% of total calories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}