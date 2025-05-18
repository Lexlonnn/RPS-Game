"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<"intro" | "rules" | "mode">("intro");
  const [rounds, setRounds] = useState<number>(3);
  const router = useRouter();

  const handleStartGame = () => {
    router.push(`/game?rounds=${rounds}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-8 text-white">
      {currentStep === "intro" && (
        <div className="flex flex-col items-center max-w-2xl text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Rock Paper Scissors
          </h1>
          <p className="text-xl mb-8">
            The classic game of strategy and chance! Test your luck and outsmart your opponent in this
            timeless battle of wits.
          </p>
          <button
            onClick={() => setCurrentStep("rules")}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold text-lg hover:scale-105 transition-transform"
          >
            Get Started
          </button>
        </div>
      )}

      {currentStep === "rules" && (
        <div className="flex flex-col items-center max-w-2xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-teal-500 bg-clip-text text-transparent">
            Game Rules
          </h2>
          <ul className="text-left space-y-4 mb-8 text-lg">
            <li className="flex items-start">
              <span className="text-2xl mr-3">✊</span>
              <span>Rock crushes Scissors</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">✋</span>
              <span>Paper covers Rock</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">✌️</span>
              <span>Scissors cut Paper</span>
            </li>
            <li className="flex items-start pt-4">
              <span className="text-2xl mr-3">🏆</span>
              <span>First to win the majority of rounds wins the game!</span>
            </li>
          </ul>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep("intro")}
              className="px-6 py-2 bg-gray-700 rounded-full font-bold hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep("mode")}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === "mode" && (
        <div className="flex flex-col items-center max-w-2xl animate-fade-in">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Select Game Mode
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 w-full">
            {[
              { rounds: 3, label: "Quick Play", desc: "Best of 3 rounds" },
              { rounds: 5, label: "Standard", desc: "Best of 5 rounds" },
              { rounds: 190, label: "Marathon", desc: "Best of 190 rounds" },
            ].map((mode) => (
              <button
                key={mode.rounds}
                onClick={() => setRounds(mode.rounds)}
                className={`p-6 rounded-xl border-2 transition-all ${
                  rounds === mode.rounds
                    ? "border-purple-500 bg-purple-900/30 scale-105"
                    : "border-gray-700 hover:border-purple-400 hover:bg-gray-800/30"
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{mode.label}</h3>
                <p className="text-gray-300">{mode.desc}</p>
                <div className="mt-4 text-purple-400 font-mono text-lg">
                  {mode.rounds} rounds
                </div>
              </button>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentStep("rules")}
              className="px-6 py-2 bg-gray-700 rounded-full font-bold hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleStartGame}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Start Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}