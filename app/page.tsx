"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Upload, Heart, Camera, X, Smile, Frown } from "lucide-react"
import { cn } from "@/lib/utils"

type Phase = "upload" | "refused" | "cheering" | "analyzing" | "results"
type WebsiteMood = "angry" | "sad" | "neutral" | "happy" | "excited"
type UserEmotion = "happy" | "sad" | "angry" | "surprised" | "neutral" | "fear" | "disgust"

interface AnalysisResult {
  emotion: UserEmotion
  confidence: number
  description: string
}

const mixedMessages = [
  { text: "You're amazing! 💖", isPositive: true },
  { text: "You're annoying! 😤", isPositive: false },
  { text: "You brighten my day! ☀️", isPositive: true },
  { text: "I don't like you! 👎", isPositive: false },
  { text: "You're absolutely wonderful! ✨", isPositive: true },
  { text: "You're boring! 😴", isPositive: false },
  { text: "You make everything better! 🌟", isPositive: true },
  { text: "You're useless! 💔", isPositive: false },
  { text: "You're the best! 🎉", isPositive: true },
  { text: "You're terrible! 😠", isPositive: false },
  { text: "You're so kind! 💝", isPositive: true },
  { text: "I hate this! 🤬", isPositive: false },
  { text: "You're incredible! 🚀", isPositive: true },
  { text: "You're stupid! 🙄", isPositive: false },
  { text: "You're fantastic! 🎊", isPositive: true },
  { text: "Go away! 😡", isPositive: false },
]

const jokes = [
  "Why don't scientists trust atoms? Because they make up everything!",
  "I told my wife she was drawing her eyebrows too high. She looked surprised.",
  "Why don't eggs tell jokes? They'd crack each other up!",
  "What do you call a fake noodle? An impasta!",
  "Why did the scarecrow win an award? He was outstanding in his field!",
  "What do you call a bear with no teeth? A gummy bear!",
  "Why don't skeletons fight each other? They don't have the guts!",
  "What did the ocean say to the beach? Nothing, it just waved!",
]

export default function MoodAnalyzerWebsite() {
  const [phase, setPhase] = useState<Phase>("upload")
  const [websiteMood, setWebsiteMood] = useState<WebsiteMood>("angry")
  const [moodLevel, setMoodLevel] = useState(0)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [userMessage, setUserMessage] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [showRefusalModal, setShowRefusalModal] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showFooledMessage, setShowFooledMessage] = useState(false)

  useEffect(() => {
    if (moodLevel < 20) {
      setWebsiteMood("angry")
    } else if (moodLevel < 40) {
      setWebsiteMood("sad")
    } else if (moodLevel < 60) {
      setWebsiteMood("neutral")
    } else if (moodLevel < 80) {
      setWebsiteMood("happy")
    } else {
      setWebsiteMood("excited")
    }
  }, [moodLevel])

  const getMoodEmoji = () => {
    switch (websiteMood) {
      case "angry":
        return "😠"
      case "sad":
        return "😢"
      case "neutral":
        return "😐"
      case "happy":
        return "😊"
      case "excited":
        return "🤩"
    }
  }

  const getBackgroundClass = () => {
    switch (websiteMood) {
      case "angry":
        return "bg-gradient-to-br from-red-500 to-red-700"
      case "sad":
        return "bg-gradient-to-br from-gray-500 to-blue-600"
      case "neutral":
        return "bg-gradient-to-br from-gray-400 to-blue-400"
      case "happy":
        return "bg-gradient-to-br from-yellow-400 to-orange-500"
      case "excited":
        return "bg-gradient-to-br from-pink-400 to-purple-600"
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setShowRefusalModal(true)
    setPhase("refused")
  }

  const increaseMood = (amount: number) => {
    setMoodLevel((prev) => {
      const newLevel = Math.min(100, prev + amount)
      if (newLevel >= 80 && phase === "cheering") {
        setTimeout(() => analyzeImage(), 1000)
      }
      return newLevel
    })
  }

  const decreaseMood = (amount: number) => {
    setMoodLevel((prev) => Math.max(0, prev - amount))
  }

  const detectSentiment = (message: string): boolean => {
    const negativeWords = [
      "hate",
      "stupid",
      "dumb",
      "ugly",
      "bad",
      "terrible",
      "awful",
      "horrible",
      "annoying",
      "boring",
      "useless",
      "worthless",
      "disgusting",
      "pathetic",
      "loser",
      "idiot",
      "moron",
      "fool",
      "suck",
      "sucks",
      "worst",
      "garbage",
      "trash",
      "lame",
      "weak",
      "failure",
      "disaster",
      "nightmare",
    ]

    const positiveWords = [
      "love",
      "great",
      "awesome",
      "amazing",
      "wonderful",
      "fantastic",
      "brilliant",
      "excellent",
      "perfect",
      "beautiful",
      "nice",
      "good",
      "best",
      "incredible",
      "outstanding",
      "marvelous",
      "superb",
      "magnificent",
      "spectacular",
      "fabulous",
    ]

    const lowerMessage = message.toLowerCase()

    const negativeCount = negativeWords.filter((word) => lowerMessage.includes(word)).length
    const positiveCount = positiveWords.filter((word) => lowerMessage.includes(word)).length

    if (negativeCount > positiveCount) return false
    if (positiveCount > negativeCount) return true

    // Default to positive if neutral
    return true
  }

  const sendMessage = () => {
    if (userMessage.trim()) {
      const isPositive = detectSentiment(userMessage)
      if (isPositive) {
        increaseMood(15)
      } else {
        decreaseMood(18)
      }
      setUserMessage("")
    }
  }

  const sendCompliment = (message: { text: string; isPositive: boolean }) => {
    if (message.isPositive) {
      increaseMood(12)
    } else {
      decreaseMood(15)
    }
  }

  const tellJoke = () => {
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)]
    alert(`Here's a joke: ${randomJoke}`)
    increaseMood(18)
  }

  const startCheering = () => {
    setShowRefusalModal(false)
    setPhase("cheering")
  }

  const analyzeImage = async () => {
    if (!uploadedImage) return

    setPhase("analyzing")
    setIsAnalyzing(true)

    try {
      // Simulate API call - in production, use Fal AI or similar service
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const emotions: { emotion: UserEmotion; description: string }[] = [
        { emotion: "happy", description: "You're radiating joy and positivity! Your smile is contagious." },
        {
          emotion: "sad",
          description: "I can sense some sadness in your expression. Remember, it's okay to feel this way.",
        },
        {
          emotion: "angry",
          description: "There's some intensity in your expression. Take a deep breath and find your calm.",
        },
        { emotion: "surprised", description: "Your eyes show surprise and wonder! Something caught your attention." },
        { emotion: "neutral", description: "You have a calm, composed expression. Very balanced and peaceful." },
        { emotion: "fear", description: "I detect some concern or worry. Everything will be alright." },
        { emotion: "disgust", description: "Something seems to have bothered you. That's a natural reaction." },
      ]

      const randomResult = emotions[Math.floor(Math.random() * emotions.length)]

      setAnalysisResult({
        ...randomResult,
        confidence: Math.random() * 0.25 + 0.75, // 75-100% confidence
      })

      setPhase("results")

      // Show fooled message after 2 seconds
      setTimeout(() => {
        setShowFooledMessage(true)
      }, 2000)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const resetAnalysis = () => {
    setPhase("upload")
    setUploadedImage(null)
    setAnalysisResult(null)
    setMoodLevel(0)
    setWebsiteMood("angry")
  }

  const getEmotionEmoji = (emotion: UserEmotion) => {
    switch (emotion) {
      case "happy":
        return "😊"
      case "sad":
        return "😢"
      case "angry":
        return "😠"
      case "surprised":
        return "😲"
      case "neutral":
        return "😐"
      case "fear":
        return "😨"
      case "disgust":
        return "🤢"
    }
  }

  const getEmotionColor = (emotion: UserEmotion) => {
    switch (emotion) {
      case "happy":
        return "text-yellow-500"
      case "sad":
        return "text-blue-500"
      case "angry":
        return "text-red-500"
      case "surprised":
        return "text-purple-500"
      case "neutral":
        return "text-gray-500"
      case "fear":
        return "text-indigo-500"
      case "disgust":
        return "text-green-500"
    }
  }

  return (
    <div className={cn("min-h-screen transition-all duration-1000", getBackgroundClass())}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">Mood Analyzer</h1>
            <p className="text-white/80 text-lg drop-shadow">Upload your photo and discover your emotional state</p>
          </div>

          {/* Upload Phase */}
          {phase === "upload" && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center gap-2">
                  <Camera className="w-6 h-6" />
                  Upload Your Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">
                    Upload a clear photo of your face and I'll analyze your mood and emotions!
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-gray-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center space-y-4">
                        <Upload className="w-16 h-16 text-gray-400" />
                        <span className="text-xl font-medium">Click to upload your photo</span>
                        <span className="text-sm text-muted-foreground">PNG, JPG, JPEG up to 10MB</span>
                      </div>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Refusal Modal */}
          {showRefusalModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md animate-fade-in">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Frown className="w-6 h-6 text-red-500" />
                      I'm Not in the Mood!
                    </CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => setShowRefusalModal(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl mb-4">😠</div>
                    <p className="text-lg font-medium mb-2">I'm in a really bad mood right now!</p>
                    <p className="text-muted-foreground mb-4">
                      I don't feel like analyzing your mood. If you want me to help you, you need to cheer me up first
                      with some nice messages, jokes, or compliments!
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={startCheering} className="flex-1">
                      <Heart className="w-4 h-4 mr-2" />
                      Cheer Me Up!
                    </Button>
                    <Button variant="outline" onClick={resetAnalysis}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Cheering Phase */}
          {phase === "cheering" && (
            <div className="space-y-6">
              {/* Website Mood Display */}
              <Card className="animate-fade-in">
                <CardHeader className="text-center">
                  <div className="text-8xl mb-4 animate-bounce">{getMoodEmoji()}</div>
                  <CardTitle className="text-2xl">
                    {websiteMood === "angry" && "I'm still angry! Keep trying..."}
                    {websiteMood === "sad" && "I'm feeling a bit sad... cheer me up more!"}
                    {websiteMood === "neutral" && "I'm starting to feel better..."}
                    {websiteMood === "happy" && "You're making me smile! Almost there!"}
                    {websiteMood === "excited" && "I'm so happy now! Let me analyze your photo!"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">Website Mood Level</p>
                      <Progress value={moodLevel} className="w-full h-4" />
                      <p className="text-xs text-muted-foreground mt-1">{moodLevel}% Happy</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cheering Interface */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle className="text-center">Make Me Happy!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Send Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Send me a message (I can detect if it's positive or negative):
                    </label>
                    <div className="flex gap-2">
                      <Input
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Type something nice to cheer me up..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <Button onClick={sendMessage} disabled={!userMessage.trim()}>
                        Send
                      </Button>
                    </div>
                  </div>

                  {/* Mixed Messages */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quick messages (some help, some don't!):</label>
                    <div className="grid grid-cols-2 gap-2">
                      {mixedMessages.map((message, index) => (
                        <Button
                          key={index}
                          onClick={() => sendCompliment(message)}
                          variant="outline"
                          size="sm"
                          className={cn(
                            "text-xs",
                            message.isPositive
                              ? "border-green-200 hover:bg-green-50"
                              : "border-red-200 hover:bg-red-50",
                          )}
                        >
                          {message.isPositive ? (
                            <Heart className="w-3 h-3 mr-1 text-green-500" />
                          ) : (
                            <X className="w-3 h-3 mr-1 text-red-500" />
                          )}
                          {message.text}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Tell Joke Button */}
                  <div className="text-center">
                    <Button onClick={tellJoke} variant="outline" className="bg-yellow-100 hover:bg-yellow-200">
                      <Smile className="w-4 h-4 mr-2" />
                      Tell Me a Joke!
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Analyzing Phase */}
          {phase === "analyzing" && (
            <Card className="animate-fade-in">
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="text-6xl animate-bounce">🤩</div>
                  <h2 className="text-2xl font-bold">Analyzing Your Mood...</h2>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">Thank you for cheering me up! Now I'm analyzing your photo...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Phase */}
          {phase === "results" && analysisResult && uploadedImage && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="text-center">Your Mood Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <img
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Your uploaded photo"
                    className="w-64 h-64 object-cover rounded-lg mx-auto mb-4 shadow-lg"
                  />
                </div>

                <div className="text-center space-y-4">
                  <div className="text-8xl">{getEmotionEmoji(analysisResult.emotion)}</div>

                  <div>
                    <h3 className={cn("text-3xl font-bold capitalize mb-2", getEmotionColor(analysisResult.emotion))}>
                      {analysisResult.emotion}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      Confidence: {(analysisResult.confidence * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="bg-muted p-6 rounded-lg">
                    <p className="text-base leading-relaxed">{analysisResult.description}</p>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button onClick={resetAnalysis} variant="outline">
                      Analyze Another Photo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Fooled Message Modal */}
          {showFooledMessage && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-lg animate-fade-in">
                <CardContent className="text-center py-12">
                  <div className="space-y-6">
                    <div className="text-9xl animate-bounce">😂</div>
                    <h1 className="text-6xl font-bold text-purple-600 animate-bounce">HAHA!</h1>
                    <h2 className="text-4xl font-bold text-red-500 animate-bounce" style={{ animationDelay: "0.2s" }}>
                      YOU ARE FOOLED!
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      I was just pretending to be moody! 😄<br />
                      Thanks for playing along with my little prank!
                    </p>
                    <Button
                      onClick={() => {
                        setShowFooledMessage(false)
                        resetAnalysis()
                      }}
                      className="mt-4"
                      size="lg"
                    >
                      Play Again! 🎭
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
