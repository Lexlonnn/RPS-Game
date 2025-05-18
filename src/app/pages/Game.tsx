"use client";

import React, { useState, useEffect } from "react";

type Choice = "Rock" | "Paper" | "Scissors";
type Score = {
  player: number;
  computer: number;
};

const Game: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);
  const [computerChoice, setComputerChoice] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [score, setScore] = useState<Score>({ player: 0, computer: 0 });
  const [animationState, setAnimationState] = useState<string>("idle");
  const [resultVisible, setResultVisible] = useState<boolean>(false);

  const choices: Choice[] = ["Rock", "Paper", "Scissors"];
  const choiceIcons: Record<Choice, string> = {
    Rock: "✊",
    Paper: "✋",
    Scissors: "✌️"
  };

  // Shuffle and initialize cards
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = (): void => {
    const shuffledCards = [...choices, ...choices].sort(
      () => Math.random() - 0.5
    );
    setCards(shuffledCards);
  };

  const handleCardClick = (index: number): void => {
    if (playerChoice || computerChoice || animationState !== "idle") return; // Prevent multiple selections

    const selectedChoice = cards[index];
    setPlayerChoice(selectedChoice);
    setFlippedCards((prev) => [...prev, index]);

    // Computer selects a random card
    const computerIndex = Math.floor(Math.random() * choices.length);
    const computerSelectedChoice = choices[computerIndex];
    setComputerChoice(computerSelectedChoice);

    // Start animation sequence
    setAnimationState("animating");
    
    // After animations complete, show the result
    setTimeout(() => {
      setAnimationState("finished");
      determineWinner(selectedChoice, computerSelectedChoice);
      setResultVisible(true);
    }, 1500);
  };

  const determineWinner = (player: string, computer: string): void => {
    let newResult: string;
    
    if (player === computer) {
      newResult = "It's a tie!";
    } else if (
      (player === "Rock" && computer === "Scissors") ||
      (player === "Paper" && computer === "Rock") ||
      (player === "Scissors" && computer === "Paper")
    ) {
      newResult = "You win!";
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
    } else {
      newResult = "You lose!";
      setScore(prev => ({ ...prev, computer: prev.computer + 1 }));
    }
    
    setResult(newResult);
  };

  const resetGame = (): void => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setFlippedCards([]);
    setShowModal(false);
    setAnimationState("idle");
    setResultVisible(false);
    initializeGame();
  };

  // Get result color based on outcome
  const getResultColor = () => {
    if (result === "You win!") {
      return {
        bg: "linear-gradient(to right, #4ade80, #22d3ee)",
        shadow: "0 4px 20px rgba(74, 222, 128, 0.5)"
      };
    } else if (result === "You lose!") {
      return {
        bg: "linear-gradient(to right, #f87171, #f43f5e)",
        shadow: "0 4px 20px rgba(248, 113, 113, 0.5)"
      };
    } else {
      return {
        bg: "linear-gradient(to right, #d8b4fe, #a78bfa)",
        shadow: "0 4px 20px rgba(216, 180, 254, 0.5)"
      };
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6 relative overflow-hidden">
      {/* Background Lighting Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-pink-500 to-red-500 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Add padding to account for the fixed navbar */}
      <div className="mt-20"></div>
      
      {/* Score display */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 mb-8 flex items-center justify-center space-x-8 shadow-2xl border border-white border-opacity-10">
        <div className="text-center">
          <p className="text-white text-lg font-medium opacity-80">You</p>
          <p className="text-4xl font-extrabold"
            style={{
              background: "linear-gradient(to right, #4ade80, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 20px rgba(74, 222, 128, 0.5)"
            }}>
            {score.player}
          </p>
        </div>
        <div className="text-white text-2xl font-bold">vs</div>
        <div className="text-center">
          <p className="text-white text-lg font-medium opacity-80">Computer</p>
          <p className="text-4xl font-extrabold"
            style={{
              background: "linear-gradient(to right, #f87171, #f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 4px 20px rgba(248, 113, 113, 0.5)"
            }}>
            {score.computer}
          </p>
        </div>
      </div>
      
      {/* Main game area with battle animation */}
      <div className="w-full max-w-4xl relative z-10 mb-8">
        <div className="flex flex-col items-center justify-center">
          {/* Battle Arena */}
          <div className="relative w-full h-56 mb-8 flex justify-between items-center">
            {/* Player Choice Display */}
            <div 
              className={`w-40 h-40 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center transition-all duration-500 shadow-lg ${animationState === "idle" ? "opacity-0" : "opacity-100"}`}
              style={{
                transform: animationState === "animating" 
                  ? "translateX(100px) scale(1.1)" 
                  : animationState === "finished" 
                    ? "translateX(60px) scale(1)" 
                    : "translateX(0) scale(1)",
                transition: "all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)"
              }}
            >
              {playerChoice && (
                <span className="text-8xl">{choiceIcons[playerChoice as Choice]}</span>
              )}
            </div>

            {/* Center Result Display */}
            <div 
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${resultVisible ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
            >
              {result && (
                <div className="text-4xl font-bold"
                  style={{
                    background: getResultColor().bg,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: getResultColor().shadow
                  }}
                >
                  {result}
                </div>
              )}
            </div>

            {/* Computer Choice Display */}
            <div 
              className={`w-40 h-40 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center transition-all duration-500 shadow-lg ${animationState === "idle" ? "opacity-0" : "opacity-100"}`}
              style={{
                transform: animationState === "animating" 
                  ? "translateX(-100px) scale(1.1)" 
                  : animationState === "finished" 
                    ? "translateX(-60px) scale(1)" 
                    : "translateX(0) scale(1)",
                transition: "all 0.5s cubic-bezier(0.68, -0.6, 0.32, 1.6)"
              }}
            >
              {computerChoice && (
                <span className="text-8xl">{choiceIcons[computerChoice as Choice]}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-4xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Player Section */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-center"
                style={{
                  background: "linear-gradient(to right, #4ade80, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 20px rgba(74, 222, 128, 0.5)"
                }}>
              Player
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              {choices.map((choice, index) => (
                <div
                  key={`player-${index}`}
                  onClick={() => handleCardClick(index)}
                  className={`relative w-24 h-36 cursor-pointer mx-auto transform transition-transform hover:scale-105 ${animationState !== "idle" ? "pointer-events-none" : ""}`}
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="absolute w-full h-full transition-all duration-500 shadow-lg"
                    style={{ 
                      transformStyle: "preserve-3d",
                      transform: playerChoice === choice ? "rotateY(180deg)" : "rotateY(0deg)"
                    }}
                  >
                    {/* Front of the card */}
                    <div className="absolute w-full h-full rounded-xl flex items-center justify-center"
                         style={{ 
                           backfaceVisibility: "hidden",
                           background: "linear-gradient(135deg, #1e293b, #0f172a)",
                           boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)"
                         }}>
                      <div className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">?</span>
                      </div>
                    </div>
                    {/* Back of the card */}
                    <div className="absolute w-full h-full rounded-xl flex flex-col items-center justify-center"
                         style={{ 
                           backfaceVisibility: "hidden", 
                           transform: "rotateY(180deg)",
                           background: "linear-gradient(135deg, #0d9488, #14b8a6)",
                           boxShadow: "0 10px 30px -5px rgba(20, 184, 166, 0.5)"
                         }}>
                      <span className="text-4xl mb-2">{choiceIcons[choice]}</span>
                      <span className="text-white font-bold text-sm">{choice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Computer Section */}
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-6 text-center"
                style={{
                  background: "linear-gradient(to right, #f87171, #f43f5e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  textShadow: "0 4px 20px rgba(248, 113, 113, 0.5)"
                }}>
              Computer
            </h2>
            
            <div className="grid grid-cols-3 gap-4">
              {choices.map((choice, index) => (
                <div
                  key={`computer-${index}`}
                  className="relative w-24 h-36 mx-auto"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="absolute w-full h-full transition-all duration-500 shadow-2xl"
                    style={{ 
                      transformStyle: "preserve-3d",
                      transform: computerChoice === choice ? "rotateY(180deg)" : "rotateY(0deg)"
                    }}
                  >
                    {/* Front of the card */}
                    <div className="absolute w-full h-full rounded-xl shadow-lg flex items-center justify-center"
                         style={{ 
                           backfaceVisibility: "hidden", 
                           background: "linear-gradient(135deg, #1e293b, #0f172a)",
                           boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)"
                         }}>
                      <div className="w-12 h-12 border-2 border-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">?</span>
                      </div>
                    </div>
                    {/* Back of the card */}
                    <div className="absolute w-full h-full rounded-xl shadow-lg flex flex-col items-center justify-center"
                         style={{ 
                           backfaceVisibility: "hidden", 
                           transform: "rotateY(180deg)",
                           background: "linear-gradient(135deg, #4c1d95, #7e22ce)",
                           boxShadow: "0 10px 30px -5px rgba(124, 58, 237, 0.5)"
                         }}>
                      <span className="text-4xl mb-2">{choiceIcons[choice]}</span>
                      <span className="text-white font-bold text-sm">{choice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Play Again Button */}
      {animationState === "finished" && (
        <div className="mt-10">
          <button
            onClick={resetGame}
            className="px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105"
          >
            Play Again
          </button>
        </div>
      )}
      
      {animationState === "idle" && !playerChoice && (
        <div className="mt-10 text-center">
          <p className="text-white text-lg opacity-80">
            Choose your move
          </p>
        </div>
      )}
    </div>
  );
};

export default Game;