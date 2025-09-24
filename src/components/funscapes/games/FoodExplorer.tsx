import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ChefHat, Trophy, Star, Download, Clock, Utensils } from "lucide-react"

interface Dish {
  id: string
  name: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  cookingTime: number
  points: number
  completed: boolean
  ingredients: string[]
  steps: string[]
  culturalStory: string
  recipe: {
    servings: number
    prepTime: string
    cookTime: string
    instructions: string[]
  }
}

interface CookingStep {
  id: string
  instruction: string
  options: string[]
  correctAnswer: number
  explanation: string
}

interface FoodExplorerProps {
  onBack: () => void
  onScoreUpdate: (points: number) => void
}

const dishes: Dish[] = [
  {
    id: "dhuska",
    name: "Dhuska",
    description: "Traditional deep-fried rice and lentil pancakes",
    difficulty: "Easy",
    cookingTime: 30,
    points: 25,
    completed: false,
    ingredients: ["Rice", "Black gram dal", "Ginger", "Green chilies", "Salt", "Oil"],
    steps: ["Soak rice and dal", "Grind to paste", "Add spices", "Deep fry"],
    culturalStory:
      "Dhuska is a beloved breakfast dish in Jharkhand, traditionally prepared during festivals and special occasions. The crispy exterior and soft interior make it a perfect accompaniment to spicy chutneys.",
    recipe: {
      servings: 4,
      prepTime: "4 hours (including soaking)",
      cookTime: "20 minutes",
      instructions: [
        "Soak 1 cup rice and 1/2 cup black gram dal for 4 hours",
        "Grind together with ginger and green chilies to make smooth batter",
        "Add salt and let it ferment for 2 hours",
        "Heat oil and deep fry spoonfuls of batter until golden brown",
        "Serve hot with chutney or curry",
      ],
    },
  },
  {
    id: "litti-chokha",
    name: "Litti Chokha",
    description: "Roasted wheat balls with mashed vegetable curry",
    difficulty: "Medium",
    cookingTime: 45,
    points: 35,
    completed: false,
    ingredients: ["Wheat flour", "Sattu", "Onions", "Tomatoes", "Potatoes", "Eggplant", "Mustard oil"],
    steps: ["Make dough", "Prepare sattu filling", "Stuff and shape", "Roast over fire", "Prepare chokha"],
    culturalStory:
      "Litti Chokha represents the rustic cuisine of Jharkhand and Bihar. Traditionally cooked over cow dung cakes, it symbolizes the connection between food and nature in tribal culture.",
    recipe: {
      servings: 6,
      prepTime: "30 minutes",
      cookTime: "45 minutes",
      instructions: [
        "Mix wheat flour with water and oil to make firm dough",
        "Prepare sattu filling with roasted gram flour, onions, and spices",
        "Stuff dough with filling and shape into balls",
        "Roast over open fire or in oven until golden",
        "Mash roasted vegetables with mustard oil for chokha",
        "Serve hot litti with chokha and ghee",
      ],
    },
  },
  {
    id: "handia",
    name: "Handia",
    description: "Traditional fermented rice beverage",
    difficulty: "Hard",
    cookingTime: 120,
    points: 50,
    completed: false,
    ingredients: ["Rice", "Ranu tablets", "Water", "Jaggery", "Herbs"],
    steps: ["Cook rice", "Cool completely", "Add ranu", "Ferment", "Strain and serve"],
    culturalStory:
      "Handia is a sacred drink in tribal culture, prepared for religious ceremonies and festivals. The fermentation process using traditional ranu tablets has been passed down through generations.",
    recipe: {
      servings: 8,
      prepTime: "30 minutes",
      cookTime: "3-5 days (fermentation)",
      instructions: [
        "Cook 2 cups rice until soft and let it cool completely",
        "Mix with crushed ranu tablets (traditional fermentation starter)",
        "Store in earthen pot for 3-5 days to ferment",
        "Add jaggery and herbs for flavor",
        "Strain through cloth and serve chilled",
        "Note: Consume responsibly as it contains natural alcohol",
      ],
    },
  },
  {
    id: "rugra",
    name: "Rugra Curry",
    description: "Wild mushroom curry with tribal spices",
    difficulty: "Medium",
    cookingTime: 25,
    points: 30,
    completed: false,
    ingredients: ["Rugra mushrooms", "Onions", "Tomatoes", "Turmeric", "Red chilies", "Mustard oil"],
    steps: ["Clean mushrooms", "Sauté onions", "Add spices", "Cook mushrooms", "Simmer"],
    culturalStory:
      "Rugra mushrooms are foraged from the forests during monsoon season. This dish represents the deep connection between tribal communities and their natural environment.",
    recipe: {
      servings: 4,
      prepTime: "15 minutes",
      cookTime: "25 minutes",
      instructions: [
        "Clean and chop 500g fresh rugra mushrooms",
        "Heat mustard oil and sauté sliced onions until golden",
        "Add chopped tomatoes, turmeric, and red chili powder",
        "Add mushrooms and cook until tender",
        "Simmer with salt and water until gravy thickens",
        "Garnish with fresh coriander and serve with rice",
      ],
    },
  },
]

const cookingSteps: Record<string, CookingStep[]> = {
  dhuska: [
    {
      id: "soak",
      instruction: "First step in making Dhuska - what should you do with rice and dal?",
      options: ["Roast them", "Soak in water for 4 hours", "Grind immediately", "Boil them"],
      correctAnswer: 1,
      explanation: "Soaking rice and dal for 4 hours softens them, making it easier to grind into a smooth batter.",
    },
    {
      id: "grind",
      instruction: "After soaking, how should you prepare the batter?",
      options: ["Mash with hands", "Grind to smooth paste", "Chop finely", "Blend with lots of water"],
      correctAnswer: 1,
      explanation:
        "Grinding to a smooth paste ensures the Dhuska has the right texture - crispy outside and soft inside.",
    },
    {
      id: "fry",
      instruction: "What's the correct way to cook Dhuska?",
      options: ["Shallow fry", "Steam", "Deep fry in hot oil", "Bake in oven"],
      correctAnswer: 2,
      explanation: "Deep frying in hot oil gives Dhuska its characteristic golden color and crispy texture.",
    },
  ],
  "litti-chokha": [
    {
      id: "dough",
      instruction: "What type of dough is needed for Litti?",
      options: ["Soft and sticky", "Firm and pliable", "Very dry", "Liquid batter"],
      correctAnswer: 1,
      explanation: "A firm, pliable dough is essential to hold the sattu filling and maintain shape during roasting.",
    },
    {
      id: "roast",
      instruction: "Traditional method of cooking Litti?",
      options: ["Boiling in water", "Roasting over open fire", "Steaming", "Microwaving"],
      correctAnswer: 1,
      explanation:
        "Roasting over open fire or cow dung cakes gives Litti its authentic smoky flavor and crispy exterior.",
    },
  ],
  handia: [
    {
      id: "ferment",
      instruction: "What makes Handia special?",
      options: ["It's boiled", "It's fermented", "It's frozen", "It's dried"],
      correctAnswer: 1,
      explanation:
        "Fermentation using traditional ranu tablets creates the unique flavor and mild alcoholic content of Handia.",
    },
  ],
  rugra: [
    {
      id: "season",
      instruction: "When are Rugra mushrooms typically found?",
      options: ["Summer", "Winter", "Monsoon season", "All year round"],
      correctAnswer: 2,
      explanation: "Rugra mushrooms grow wild in forests during monsoon season, making them a seasonal delicacy.",
    },
  ],
}

export function FoodExplorer({ onBack, onScoreUpdate }: FoodExplorerProps) {
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null)
  const [gameDishes, setGameDishes] = useState<Dish[]>(dishes)
  const [score, setScore] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [showCookingModal, setShowCookingModal] = useState(false)
  const [cookingComplete, setCookingComplete] = useState(false)
  const [unlockedRecipes, setUnlockedRecipes] = useState<string[]>([])

  const handleDishSelect = (dish: Dish) => {
    if (dish.completed) return
    setSelectedDish(dish)
    setCurrentStep(0)
    setShowCookingModal(true)
    setCookingComplete(false)
  }

  const handleStepAnswer = (answerIndex: number) => {
    if (!selectedDish) return

    const dishSteps = cookingSteps[selectedDish.id]
    const currentStepData = dishSteps[currentStep]
    const isCorrect = answerIndex === currentStepData.correctAnswer

    if (isCorrect) {
      if (currentStep < dishSteps.length - 1) {
        setCurrentStep((prev) => prev + 1)
      } else {
        // Cooking complete
        const pointsEarned = selectedDish.points
        setScore((prev) => prev + pointsEarned)
        onScoreUpdate(pointsEarned)

        // Mark dish as completed
        setGameDishes((prev) => prev.map((dish) => (dish.id === selectedDish.id ? { ...dish, completed: true } : dish)))

        // Unlock recipe
        setUnlockedRecipes((prev) => [...prev, selectedDish.id])
        setCookingComplete(true)
      }
    } else {
      // Wrong answer, but still continue (with explanation)
      setTimeout(() => {
        if (currentStep < dishSteps.length - 1) {
          setCurrentStep((prev) => prev + 1)
        } else {
          setCookingComplete(true)
        }
      }, 2000)
    }
  }

  const closeCookingModal = () => {
    setShowCookingModal(false)
    setSelectedDish(null)
    setCurrentStep(0)
    setCookingComplete(false)
  }

  const downloadRecipe = (dish: Dish) => {
    const recipeText = `
${dish.name} Recipe

Description: ${dish.description}
Servings: ${dish.recipe.servings}
Prep Time: ${dish.recipe.prepTime}
Cook Time: ${dish.recipe.cookTime}

Ingredients:
${dish.ingredients.map((ing) => `• ${ing}`).join("\n")}

Instructions:
${dish.recipe.instructions.map((inst, i) => `${i + 1}. ${inst}`).join("\n")}

Cultural Story:
${dish.culturalStory}

---
Recipe from Jharkhand AR/VR Games - Food Explorer
    `.trim()

    const blob = new Blob([recipeText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${dish.name.replace(/\s+/g, "_")}_Recipe.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const completedDishes = gameDishes.filter((dish) => dish.completed).length
  const totalDishes = gameDishes.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button onClick={onBack} variant="outline" className="flex items-center gap-2 bg-transparent">
            <ArrowLeft className="h-4 w-4" />
            Back to Games
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Trophy className="h-4 w-4 mr-2" />
              {score} Points
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              <ChefHat className="h-4 w-4 mr-2" />
              {completedDishes}/{totalDishes} Dishes
            </Badge>
          </div>
        </div>

        {/* Game Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <Utensils className="h-8 w-8 text-primary" />
              Local Food Explorer
            </CardTitle>
            <CardDescription className="text-lg">
              Explore traditional Jharkhand cuisine through interactive cooking experiences. Learn recipes, cultural
              stories, and download PDFs!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={(completedDishes / totalDishes) * 100} className="w-full h-3" />
            <p className="text-sm text-muted-foreground mt-2">Master all dishes to become a Jharkhand cuisine expert</p>
          </CardContent>
        </Card>

        {/* Food Stalls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {gameDishes.map((dish) => (
            <Card
              key={dish.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${dish.completed ? "border-green-500 bg-green-50" : "hover:border-primary"}`}
              onClick={() => handleDishSelect(dish)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="/images/funscapes/traditional-jharkhand-cuisine-cooking-scene.jpg"
                    alt={dish.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {dish.completed && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-green-600">
                        <Star className="h-3 w-3 mr-1 fill-white" />
                        Mastered
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {dish.cookingTime}min
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{dish.name}</CardTitle>
                <CardDescription className="text-sm">{dish.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className={`text-xs ${dish.difficulty === "Easy"
                      ? "border-green-500 text-green-700"
                      : dish.difficulty === "Medium"
                        ? "border-yellow-500 text-yellow-700"
                        : "border-red-500 text-red-700"}`}
                  >
                    {dish.difficulty}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {dish.points}pts
                    </Badge>
                    {dish.completed && unlockedRecipes.includes(dish.id) && (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadRecipe(dish)
                        }}
                        variant="outline"
                        size="sm"
                        className="h-6 px-2"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Unlocked Recipes Section */}
        {unlockedRecipes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                Your Recipe Collection
              </CardTitle>
              <CardDescription>Download your mastered recipes as PDF files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {unlockedRecipes.map((recipeId) => {
                  const dish = gameDishes.find((d) => d.id === recipeId)
                  if (!dish) return null

                  return (
                    <div
                      key={recipeId}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <h4 className="font-medium text-green-800">{dish.name}</h4>
                        <p className="text-sm text-green-600">Recipe unlocked!</p>
                      </div>
                      <Button
                        onClick={() => downloadRecipe(dish)}
                        variant="outline"
                        size="sm"
                        className="border-green-300 text-green-700 hover:bg-green-100"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Cooking Modal */}
        {showCookingModal && selectedDish && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-6 w-6 text-primary" />
                  Cooking {selectedDish.name}
                </CardTitle>
                <CardDescription>{selectedDish.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!cookingComplete ? (
                  <>
                    {cookingSteps[selectedDish.id] && (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium">
                            Step {currentStep + 1} of {cookingSteps[selectedDish.id].length}
                          </span>
                          <Progress
                            value={((currentStep + 1) / cookingSteps[selectedDish.id].length) * 100}
                            className="w-32"
                          />
                        </div>

                        <p className="font-medium text-lg">{cookingSteps[selectedDish.id][currentStep].instruction}</p>

                        <div className="grid grid-cols-1 gap-3">
                          {cookingSteps[selectedDish.id][currentStep].options.map((option, index) => (
                            <Button
                              key={index}
                              onClick={() => handleStepAnswer(index)}
                              variant="outline"
                              className="justify-start text-left p-4 h-auto"
                            >
                              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
                              {option}
                            </Button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="text-6xl text-green-500">🍽️</div>
                    <h3 className="text-2xl font-bold text-green-700">Dish Completed!</h3>
                    <p className="text-lg">{selectedDish.name} is ready to serve!</p>

                    <div className="bg-orange-50 p-4 rounded-lg text-left">
                      <h4 className="font-bold text-orange-800 mb-2">Cultural Story:</h4>
                      <p className="text-sm text-orange-700">{selectedDish.culturalStory}</p>
                    </div>

                    <Badge className="bg-green-600 text-lg px-4 py-2">+{selectedDish.points} points earned!</Badge>

                    <div className="flex gap-3 justify-center">
                      <Button onClick={closeCookingModal}>Continue Exploring</Button>
                      <Button
                        onClick={() => downloadRecipe(selectedDish)}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download Recipe
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
