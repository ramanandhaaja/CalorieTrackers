'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, AlertCircle } from 'lucide-react';

import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../../../components/ui/card';
import { Checkbox } from '../../../../components/ui/checkbox';
import { toast } from 'sonner';
import { Label } from '../../../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../../../components/ui/alert';
import { Separator } from '../../../../components/ui/separator';

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
  calorieGoal?: number;
  proteinGoal?: number;
  carbsGoal?: number;
  fatGoal?: number;
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
    calorieGoal: 2000,
    proteinGoal: 150,
    carbsGoal: 200,
    fatGoal: 65,
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
            calorieGoal: userDetails.calorieGoal || 2000,
            proteinGoal: userDetails.proteinGoal || 150,
            carbsGoal: userDetails.carbsGoal || 200,
            fatGoal: userDetails.fatGoal || 65,
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
          body: JSON.stringify(formValues),
        });
      } else {
        // Create new user details
        response = await fetch('/api/user-details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formValues),
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
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="health">Health & Fitness</TabsTrigger>
            <TabsTrigger value="goals">Nutrition Goals</TabsTrigger>
          </TabsList>
          
          {/* Personal Information Tab */}
          <TabsContent value="personal">
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
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Health & Fitness Tab */}
          <TabsContent value="health">
            <Card>
              <CardHeader>
                <CardTitle>Health & Fitness</CardTitle>
                <CardDescription>
                  Update your activity level, goals, and dietary preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                </div>
                
                <Separator className="my-4" />
                
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
              <CardHeader>
                <CardTitle>Nutrition Goals</CardTitle>
                <CardDescription>
                  Set your daily nutrition targets for tracking progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Calorie Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="calorieGoal">Daily Calorie Goal (kcal)</Label>
                    <Input
                      id="calorieGoal"
                      type="number"
                      min={500}
                      max={10000}
                      value={formValues.calorieGoal}
                      onChange={(e) => handleInputChange('calorieGoal', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* Protein Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="proteinGoal">Daily Protein Goal (g)</Label>
                    <Input
                      id="proteinGoal"
                      type="number"
                      min={0}
                      max={1000}
                      value={formValues.proteinGoal}
                      onChange={(e) => handleInputChange('proteinGoal', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* Carbs Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="carbsGoal">Daily Carbs Goal (g)</Label>
                    <Input
                      id="carbsGoal"
                      type="number"
                      min={0}
                      max={1000}
                      value={formValues.carbsGoal}
                      onChange={(e) => handleInputChange('carbsGoal', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  
                  {/* Fat Goal */}
                  <div className="space-y-2">
                    <Label htmlFor="fatGoal">Daily Fat Goal (g)</Label>
                    <Input
                      id="fatGoal"
                      type="number"
                      min={0}
                      max={1000}
                      value={formValues.fatGoal}
                      onChange={(e) => handleInputChange('fatGoal', parseInt(e.target.value) || 0)}
                    />
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