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
    if (playerChoice || computerChoice) return; // Prevent multiple selections

    // Player selects a card
    setPlayerChoice(cards[index]);
    setFlippedCards((prev) => [...prev, index]);

    // Computer selects a random card
    const computerIndex = Math.floor(Math.random() * 3);
    setComputerChoice(cards[computerIndex]);
    setFlippedCards((prev) => [...prev, computerIndex]);

    // Determine the result after a short delay
    setTimeout(() => {
      determineWinner(cards[index], cards[computerIndex]);
    }, 1000);
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
    // Show the modal with the result
    setShowModal(true);
  };

  const resetGame = (): void => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setFlippedCards([]);
    setShowModal(false);
    initializeGame();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-600 p-6">
      {/* Title with gradient text */}
      <h1 className="text-6xl font-extrabold mb-4 text-center"
          style={{
            background: "linear-gradient(to right, #00c6ff, #92effd, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 2px 10px rgba(0, 198, 255, 0.3)"
          }}>
        Rock, Paper, Scissors
      </h1>
      
      {/* Score display */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-4 mb-8 flex items-center justify-center space-x-8 shadow-lg">
        <div className="text-center">
          <p className="text-white text-lg font-medium opacity-80">You</p>
          <p className="text-3xl font-bold"
            style={{
              background: "linear-gradient(to right, #4ade80, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
            {score.player}
          </p>
        </div>
        <div className="text-white text-xl font-bold">vs</div>
        <div className="text-center">
          <p className="text-white text-lg font-medium opacity-80">Computer</p>
          <p className="text-3xl font-bold"
            style={{
              background: "linear-gradient(to right, #f87171, #f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
            {score.computer}
          </p>
        </div>
      </div>
      
      <div className="w-full max-w-4xl">
        {/* Computer Section */}
        <h2 className="text-3xl font-bold mb-6 text-center"
            style={{
              background: "linear-gradient(to right, #f87171, #f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
          Computer
        </h2>
        
        <div className="grid grid-cols-3 gap-8 mb-16">
          {cards.slice(0, 3).map((card, index) => (
            <div
              key={index}
              className="relative w-32 h-48 mx-auto"
              style={{ perspective: "1000px" }}
            >
              <div
                className="absolute w-full h-full transition-all duration-500"
                style={{ 
                  transformStyle: "preserve-3d",
                  transform: flippedCards.includes(index) ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* Front of the card */}
                <div className="absolute w-full h-full rounded-xl shadow-lg flex items-center justify-center"
                     style={{ 
                       backfaceVisibility: "hidden", 
                       background: "linear-gradient(135deg, #1e293b, #0f172a)"
                     }}>
                  <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">?</span>
                  </div>
                </div>
                {/* Back of the card */}
                <div className="absolute w-full h-full rounded-xl shadow-lg flex flex-col items-center justify-center"
                     style={{ 
                       backfaceVisibility: "hidden", 
                       transform: "rotateY(180deg)",
                       background: "linear-gradient(135deg, #4c1d95, #7e22ce)" 
                     }}>
                  <span className="text-6xl mb-2">{choiceIcons[card as Choice]}</span>
                  <span className="text-white font-bold">{card}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Player Section */}
        <h2 className="text-3xl font-bold mb-6 text-center"
            style={{
              background: "linear-gradient(to right, #4ade80, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
          Player
        </h2>
        
        <div className="grid grid-cols-3 gap-8">
          {cards.slice(3, 6).map((card, index) => (
            <div
              key={index + 3}
              onClick={() => handleCardClick(index + 3)}
              className="relative w-32 h-48 cursor-pointer mx-auto transform transition-transform hover:scale-105"
              style={{ perspective: "1000px" }}
            >
              <div
                className="absolute w-full h-full transition-all duration-500 shadow-lg"
                style={{ 
                  transformStyle: "preserve-3d",
                  transform: flippedCards.includes(index + 3) ? "rotateY(180deg)" : "rotateY(0deg)"
                }}
              >
                {/* Front of the card */}
                <div className="absolute w-full h-full rounded-xl flex items-center justify-center"
                     style={{ 
                       backfaceVisibility: "hidden",
                       background: "linear-gradient(135deg, #1e293b, #0f172a)",
                       boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                     }}>
                  <div className="w-16 h-16 border-2 border-gray-600 rounded-full flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">?</span>
                  </div>
                </div>
                {/* Back of the card */}
                <div className="absolute w-full h-full rounded-xl flex flex-col items-center justify-center"
                     style={{ 
                       backfaceVisibility: "hidden", 
                       transform: "rotateY(180deg)",
                       background: "linear-gradient(135deg, #0d9488, #14b8a6)" 
                     }}>
                  <span className="text-6xl mb-2">{choiceIcons[card as Choice]}</span>
                  <span className="text-white font-bold">{card}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Section */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm z-50">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 text-white w-96 p-8 rounded-2xl shadow-2xl text-center"
               style={{
                 background: "linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))"
               }}>
            <p className="text-3xl font-bold mb-6"
               style={{
                 background: result === "You win!" 
                   ? "linear-gradient(to right, #4ade80, #22d3ee)" 
                   : result === "You lose!" 
                     ? "linear-gradient(to right, #f87171, #f43f5e)" 
                     : "linear-gradient(to right, #d8b4fe, #a78bfa)",
                 WebkitBackgroundClip: "text",
                 WebkitTextFillColor: "transparent"
               }}>
              {result}
            </p>
            
            <div className="flex justify-between items-center mb-8">
              <div className="text-center">
                <div className="mb-2 text-5xl">{playerChoice && choiceIcons[playerChoice as Choice]}</div>
                <p className="text-sm text-gray-300">You chose</p>
                <p className="text-lg font-bold text-white">{playerChoice}</p>
              </div>
              
              <div className="text-white text-xl font-bold">vs</div>
              
              <div className="text-center">
                <div className="mb-2 text-5xl">{computerChoice && choiceIcons[computerChoice as Choice]}</div>
                <p className="text-sm text-gray-300">Computer chose</p>
                <p className="text-lg font-bold text-white">{computerChoice}</p>
              </div>
            </div>
            
            <button
              onClick={resetGame}
              className="px-8 py-3 rounded-full font-bold text-white shadow-lg transition-all duration-300 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {!showModal && !playerChoice && (
        <div className="mt-10 text-center">
          <p className="text-white text-lg opacity-80">
            Click a card to play
          </p>
        </div>
      )}
    </div>
  );
};

export default Game;