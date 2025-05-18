"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<"intro" | "rules" | "mode">("intro");
  const [rounds, setRounds] = useState<number>(3);
  const [animationState, setAnimationState] = useState<"idle" | "exiting" | "entering">("idle");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const router = useRouter();

  // Handle smooth transitions between steps
  const handleNavigation = (nextStep: "intro" | "rules" | "mode") => {
    // Prevent navigation while animating
    if (animationState !== "idle") return;
    
    // Determine slide direction based on navigation flow
    if (
      (currentStep === "intro" && nextStep === "rules") ||
      (currentStep === "rules" && nextStep === "mode")
    ) {
      setSlideDirection("right");
    } else {
      setSlideDirection("left");
    }
    
    // Start exit animation
    setAnimationState("exiting");
    
    // After exit animation completes, change the step and start enter animation
    setTimeout(() => {
      setCurrentStep(nextStep);
      setAnimationState("entering");
      
      // Reset to idle state after enter animation completes
      setTimeout(() => {
        setAnimationState("idle");
      }, 500); // Match this with CSS animation duration
    }, 300); // Slightly shorter than exit animation to prevent visual gap
  };

  const handleStartGame = () => {
    // Prevent action while animating
    if (animationState !== "idle") return;
    
    setAnimationState("exiting");
    
    // Add delay before navigation for button effect to be visible
    setTimeout(() => {
      router.push(`/game?rounds=${rounds}`);
    }, 400);
  };

  // Get animation classes based on current animation state and direction
  const getAnimationClasses = () => {
    switch (animationState) {
      case "exiting":
        return slideDirection === "right" 
          ? "animate-slide-out-left" 
          : "animate-slide-out-right";
      case "entering":
        return slideDirection === "right" 
          ? "animate-slide-in-right" 
          : "animate-slide-in-left";
      default:
        return ""; // No animation when idle
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8 text-white overflow-hidden">
      {/* Background container with improved contrast */}
      <div className="fixed inset-0 -z-20 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 opacity-100"></div>
      
      {/* Content containers with conditional rendering and animations */}
      <div className={`absolute inset-0 flex flex-col items-center justify-center ${currentStep === "intro" ? "z-10" : "-z-10"}`}>
        <div className={`flex flex-col items-center max-w-2xl text-center ${currentStep === "intro" ? getAnimationClasses() : "opacity-0"}`}>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent animate-gradient-x drop-shadow-text">
            Rock Paper Scissors
          </h1>
          <p className="text-xl mb-8 animate-fade-in font-medium drop-shadow-text">
      Embark on a timeless contest of intellect and chance! Strategize, adapt, and outmaneuver your adversary in this classic battle of wits and unpredictability.
    </p>
    <p className="text-md sm:text-lg mt-4 text-gray-300">
      Your cards remain enigmatic until the moment of revelation. Exercise prudence and foresight to triumph over the computer&#39;s cunning maneuvers!
    </p>
          <button
            onClick={() => animationState === "idle" && handleNavigation("rules")}
            className={`px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold text-lg hover:scale-110 transition-transform duration-300 animate-pulse-slow ${animationState !== "idle" ? 'pointer-events-none' : ''}`}
          >
            <span className="relative inline-block">
              Get Started
              <span className="absolute inset-0 rounded-full bg-white opacity-30 animate-ping-slow"></span>
            </span>
          </button>
        </div>
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center ${currentStep === "rules" ? "z-10" : "-z-10"}`}>
        <div className={`flex flex-col items-center max-w-2xl ${currentStep === "rules" ? getAnimationClasses() : "opacity-0"}`}>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent animate-gradient-x drop-shadow-text">
            Game Rules
          </h2>
          <ul className="text-left space-y-4 mb-8 text-lg font-medium">
            <li className="flex items-start animate-fade-in-up bg-gray-900/50 p-3 rounded-lg backdrop-blur-sm" style={{ animationDelay: "100ms" }}>
              <span className="text-2xl mr-3 animate-bounce-subtle">✊</span>
              <span>Rock crushes Scissors</span>
            </li>
            <li className="flex items-start animate-fade-in-up bg-gray-900/50 p-3 rounded-lg backdrop-blur-sm" style={{ animationDelay: "200ms" }}>
              <span className="text-2xl mr-3 animate-bounce-subtle">✋</span>
              <span>Paper covers Rock</span>
            </li>
            <li className="flex items-start animate-fade-in-up bg-gray-900/50 p-3 rounded-lg backdrop-blur-sm" style={{ animationDelay: "300ms" }}>
              <span className="text-2xl mr-3 animate-bounce-subtle">✌️</span>
              <span>Scissors cut Paper</span>
            </li>
            <li className="flex items-start pt-4 animate-fade-in-up bg-gray-900/50 p-3 rounded-lg backdrop-blur-sm" style={{ animationDelay: "400ms" }}>
              <span className="text-2xl mr-3 animate-pulse">🏆</span>
              <span>First to win the majority of rounds wins the game!</span>
            </li>
          </ul>
          <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <button
              onClick={() => animationState === "idle" && handleNavigation("intro")}
              className={`px-6 py-2 bg-gray-700 rounded-full font-bold hover:bg-gray-600 transition-colors hover:scale-105 duration-300 ${animationState !== "idle" ? 'pointer-events-none opacity-70' : ''}`}
            >
              Back
            </button>
            <button
              onClick={() => animationState === "idle" && handleNavigation("mode")}
              className={`px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold hover:scale-110 transition-transform duration-300 relative group ${animationState !== "idle" ? 'pointer-events-none opacity-70' : ''}`}
            >
              <span className="relative inline-block">
                Next
                <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                  →
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className={`absolute inset-0 flex flex-col items-center justify-center ${currentStep === "mode" ? "z-10" : "-z-10"}`}>
        <div className={`flex flex-col items-center max-w-2xl ${currentStep === "mode" ? getAnimationClasses() : "opacity-0"}`}>
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent animate-gradient-x drop-shadow-text">
            Select Game Mode
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
            {[
              { rounds: 3, label: "Quick Play", desc: "Best of 3 rounds" },
              { rounds: 5, label: "Standard", desc: "Best of 5 rounds" },
              { rounds: 7, label: "Marathon", desc: "Best of 7 rounds" },
            ].map((mode, index) => (
              <button
                key={mode.rounds}
                onClick={() => setRounds(mode.rounds)}
                className={`p-6 rounded-xl transition-all duration-300 animate-fade-in-up 
                  ${rounds === mode.rounds 
                    ? "bg-purple-900/70 border-2 border-purple-500 scale-105 shadow-glow backdrop-blur-sm" 
                    : "bg-gray-900/50 border-2 border-gray-700 hover:border-purple-400 hover:bg-gray-800/70 backdrop-blur-sm"}
                `}
                style={{ animationDelay: `${index * 100 + 100}ms` }}
              >
                <h3 className="text-2xl font-bold mb-2">{mode.label}</h3>
                <p className="text-gray-300">{mode.desc}</p>
                <div className={`mt-4 font-mono text-lg ${
                  rounds === mode.rounds ? "text-purple-400 animate-pulse" : "text-gray-400"
                }`}>
                  {mode.rounds} rounds
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "500ms" }}>
            <button
              onClick={() => animationState === "idle" && handleNavigation("rules")}
              className={`px-6 py-2 bg-gray-700 rounded-full font-bold hover:bg-gray-600 transition-colors hover:scale-105 duration-300 ${animationState !== "idle" ? 'pointer-events-none opacity-70' : ''}`}
            >
              Back
            </button>
            <button
              onClick={() => animationState === "idle" && handleStartGame()}
              className={`px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full font-bold text-lg hover:scale-110 transition-all duration-300 ${
                animationState !== "idle" ? "animate-button-pulse scale-110 pointer-events-none" : ""
              }`}
            >
              <span className="relative inline-block group">
                Start Game
                <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-30 animate-ping-slow"></span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Add global animations and effects */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-5 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full filter blur-3xl opacity-5 animate-float"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-violet-600 rounded-full filter blur-3xl opacity-5 animate-float-delayed"></div>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slide-in-right {
          0% { transform: translateX(30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-left {
          0% { transform: translateX(-30px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-out-right {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(30px); opacity: 0; }
        }
        @keyframes slide-out-left {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-30px); opacity: 0; }
        }
        @keyframes fade-in-up {
          0% { transform: translateY(10px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.2; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes button-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-slide-out-right {
          animation: slide-out-right 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
        .animate-slide-out-left {
          animation: slide-out-left 0.3s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-out infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
          animation-delay: 1s;
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 1.5s ease-in-out infinite;
        }
        .animate-button-pulse {
          animation: button-pulse 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .shadow-glow {
          box-shadow: 0 0 15px 2px rgba(168, 85, 247, 0.3);
        }
        .drop-shadow-text {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}