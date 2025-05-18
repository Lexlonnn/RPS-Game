"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Choice = "Rock" | "Paper" | "Scissors";
type Score = {
  player: number;
  computer: number;
};
type GameResult = "win" | "lose" | "tie" | null;

// Create a client component that safely uses searchParams
function GameContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rounds = searchParams.get("rounds") || "3"; // Default to 3 rounds if not provided
  const [totalRounds, setTotalRounds] = useState<number>(parseInt(rounds));

  const [playerCards, setPlayerCards] = useState<Choice[]>([]);
  const [computerCards, setComputerCards] = useState<Choice[]>([]);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [gameState, setGameState] = useState<"idle" | "animating" | "finished" | "gameOver">("idle");
  const [score, setScore] = useState<Score>({ player: 0, computer: 0 });
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);
  const [flippedPlayerIndex, setFlippedPlayerIndex] = useState<number | null>(null);
  const [flippedComputerIndex, setFlippedComputerIndex] = useState<number | null>(null);
  const [overallResult, setOverallResult] = useState<GameResult>(null);

  const choices: Choice[] = useMemo(() => ["Rock", "Paper", "Scissors"], []);
  const choiceIcons: Record<Choice, string> = {
    Rock: "✊",
    Paper: "✋",
    Scissors: "✌️"
  };

  // Reset round state without disturbing the overall game progress
  const resetRound = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setFlippedPlayerIndex(null);
    setFlippedComputerIndex(null);
    setGameState("idle");
  }, []);

  // Initialize game with new cards and reset all scores
  const startNewGame = useCallback(() => {
    const shuffledPlayer = [...choices].sort(() => Math.random() - 0.5);
    const shuffledComputer = [...choices].sort(() => Math.random() - 0.5);
    setPlayerCards(shuffledPlayer);
    setComputerCards(shuffledComputer);
    
    // Reset all game state
    resetRound();
    setScore({ player: 0, computer: 0 });
    setRoundsPlayed(0);
    setOverallResult(null);
    setGameState("idle");
  }, [choices, resetRound]);

  // Watch for changes in the URL params
  useEffect(() => {
    const newRounds = parseInt(searchParams.get("rounds") || "3");
    if (newRounds !== totalRounds) {
      setTotalRounds(newRounds);
    }
  }, [searchParams, totalRounds]);

  // Initialize game once on mount or when totalRounds changes
  useEffect(() => {
    console.log(`Game started with ${totalRounds} rounds`);
    startNewGame();
  }, [totalRounds, startNewGame]);

  // Create new cards for next round
  const prepareNextRound = useCallback(() => {
    const shuffledPlayer = [...choices].sort(() => Math.random() - 0.5);
    const shuffledComputer = [...choices].sort(() => Math.random() - 0.5);
    setPlayerCards(shuffledPlayer);
    setComputerCards(shuffledComputer);
    resetRound();
  }, [choices, resetRound]);

  // Check if game is over after score changes
  useEffect(() => {
    if (gameState === "gameOver") return; // Skip if game is already over
    
    const roundsToWin = Math.ceil(totalRounds / 2);
    
    if (score.player >= roundsToWin) {
      setOverallResult("win");
      setGameState("gameOver");
    } else if (score.computer >= roundsToWin) {
      setOverallResult("lose");
      setGameState("gameOver");
    } else if (roundsPlayed >= totalRounds) {
      // In case of a tie after all rounds
      if (score.player > score.computer) {
        setOverallResult("win");
      } else if (score.computer > score.player) {
        setOverallResult("lose");
      } else {
        setOverallResult("tie");
      }
      setGameState("gameOver");
    }
  }, [score, roundsPlayed, totalRounds, gameState]);

  const handlePlayerCardClick = (index: number) => {
    if (gameState !== "idle") return;
    
    const selectedChoice = playerCards[index];
    setPlayerChoice(selectedChoice);
    setFlippedPlayerIndex(index);
    setGameState("animating");
    
    // Computer selects a random card after delay
    setTimeout(() => {
      const computerIndex = Math.floor(Math.random() * computerCards.length);
      const computerSelectedChoice = computerCards[computerIndex];
      setComputerChoice(computerSelectedChoice);
      setFlippedComputerIndex(computerIndex);
      
      // Determine winner after animations complete
      setTimeout(() => {
        determineWinner(selectedChoice, computerSelectedChoice);
        setRoundsPlayed(prev => prev + 1);
        setGameState("finished");
      }, 1000);
    }, 500);
  };

  const determineWinner = (player: Choice, computer: Choice): void => {
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

  const getResultColor = () => {
    if (result === "You win!") {
      return "bg-gradient-to-r from-green-400 to-teal-500";
    } else if (result === "You lose!") {
      return "bg-gradient-to-r from-red-400 to-pink-500";
    } else {
      return "bg-gradient-to-r from-purple-400 to-indigo-500";
    }
  };

  const handlePlayAgain = () => {
    if (gameState === "finished") {
      // Reset for next round
      prepareNextRound();
    } else if (gameState === "gameOver") {
      // Start a new game
      startNewGame();
    }
  };

  const handleBackToHome = () => {
    router.push('/');
  };

  // Function to change number of rounds
  const handleChangeRounds = (newRounds: number) => {
    if (newRounds >= 1 && newRounds <= 10) {
      setTotalRounds(newRounds);
      router.push(`/game?rounds=${newRounds}`);
      startNewGame();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4">
      {/* Round Info and Controls */}
      <div className="flex items-center justify-center mb-4 text-white">
        {gameState !== "gameOver" && (
          <div className="text-xl mr-8">
            Round {roundsPlayed + 1} of {totalRounds}
          </div>
        )}
        
        {/* Round selector - only visible before game starts or after game ends */}
        {(gameState === "idle" && roundsPlayed === 0) || gameState === "gameOver" ? (
          <div className="flex items-center">
            <span className="mr-2">Rounds:</span>
            <div className="flex border border-white rounded-lg overflow-hidden">
              <button 
                onClick={() => handleChangeRounds(totalRounds - 2)}
                disabled={totalRounds <= 3}
                className="px-2 py-1 bg-purple-800 hover:bg-purple-700 disabled:opacity-50"
              >
                -2
              </button>
              <button 
                onClick={() => handleChangeRounds(totalRounds - 1)}
                disabled={totalRounds <= 1}
                className="px-2 py-1 bg-purple-800 hover:bg-purple-700 disabled:opacity-50"
              >
                -
              </button>
              <span className="px-3 py-1 bg-purple-900">{totalRounds}</span>
              <button 
                onClick={() => handleChangeRounds(totalRounds + 1)}
                disabled={totalRounds >= 10}
                className="px-2 py-1 bg-purple-800 hover:bg-purple-700 disabled:opacity-50"
              >
                +
              </button>
              <button 
                onClick={() => handleChangeRounds(totalRounds + 2)}
                disabled={totalRounds >= 8}
                className="px-2 py-1 bg-purple-800 hover:bg-purple-700 disabled:opacity-50"
              >
                +2
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Score Display */}
      <div className="flex items-center justify-center gap-8 mb-8">
        <div className="text-center">
          <p className="text-white opacity-80">You</p>
          <p className="text-4xl font-bold text-green-400">{score.player}</p>
        </div>
        <div className="text-white text-2xl font-bold">vs</div>
        <div className="text-center">
          <p className="text-white opacity-80">Computer</p>
          <p className="text-4xl font-bold text-red-400">{score.computer}</p>
        </div>
      </div>

      {/* Game Over Screen */}
      {gameState === "gameOver" ? (
        <div className="flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold mb-8 ${
            overallResult === "win" ? "text-green-400" :
            overallResult === "lose" ? "text-red-400" :
            "text-purple-400"
          }`}>
            {overallResult === "win" ? "You Won The Game!" :
             overallResult === "lose" ? "You Lost The Game!" :
             "Game Ended In A Tie!"}
          </div>
          <div className="text-white text-2xl mb-10">
            Final Score: {score.player} - {score.computer}
          </div>
          <div className="flex gap-6">
            <button
              onClick={handlePlayAgain}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 font-bold rounded-full hover:scale-105 transition-all text-lg"
            >
              Play Again
            </button>
            <button
              onClick={handleBackToHome}
              className="px-8 py-3 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-200 transition-colors text-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Game Arena */}
          <div className="flex w-full max-w-5xl justify-between mb-12">
            {/* Player Side */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-4">Player</h2>
              <div className="flex flex-col gap-6">
                {playerCards.map((card, index) => (
                  <div 
                    key={`player-${index}`}
                    onClick={() => gameState === "idle" && handlePlayerCardClick(index)}
                    className={`relative w-32 h-40 cursor-pointer transition-all duration-300 ${
                      gameState === "idle" ? "hover:scale-105" : ""
                    } ${
                      flippedPlayerIndex === index && gameState !== "idle" 
                        ? "transform translate-x-20 z-10" 
                        : ""
                    }`}
                    style={{ perspective: "1000px" }}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 ${
                      flippedPlayerIndex === index ? "[transform:rotateY(180deg)]" : ""
                    }`} style={{ transformStyle: "preserve-3d" }}>
                      {/* Card Back (Hidden) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg flex items-center justify-center [backface-visibility:hidden]">
                        <span className="text-white text-6xl">?</span>
                      </div>
                      {/* Card Front (Revealed) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <span className="text-7xl">{choiceIcons[card]}</span>
                        <span className="text-white text-lg mt-2">{card}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Battle Area */}
            <div className="flex flex-col items-center justify-center mx-8 w-64">
              {/* 3D Hand Effects */}
              <div className="relative w-full h-48 mb-8 flex justify-between items-center">
                {/* Player Hand */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-7xl transition-all duration-500 ${
                  gameState === "idle" ? "bg-blue-500" : 
                  gameState === "animating" ? "bg-blue-500 scale-150" : "bg-blue-500"
                } shadow-xl`}>
                  <div className={`transform transition-transform duration-500 ${
                    !playerChoice ? "" :
                    playerChoice === "Rock" ? "rotate-0" :
                    playerChoice === "Paper" ? "rotate-0" :
                    "rotate-0"
                  }`}>
                    {!playerChoice ? "✊" : choiceIcons[playerChoice]}
                  </div>
                </div>

                {/* Computer Hand */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-7xl transition-all duration-500 ${
                  gameState === "idle" ? "bg-red-500" : 
                  gameState === "animating" ? "bg-red-500 scale-150" : "bg-red-500"
                } shadow-xl`}>
                  <div className={`transform transition-transform duration-500 ${
                    !computerChoice ? "" :
                    computerChoice === "Rock" ? "rotate-0" :
                    computerChoice === "Paper" ? "rotate-0" :
                    "rotate-0"
                  }`}>
                    {!computerChoice ? "✊" : choiceIcons[computerChoice]}
                  </div>
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <div className={`text-3xl font-bold px-8 py-3 rounded-full transition-opacity duration-500 ${
                  gameState === "finished" ? "opacity-100" : "opacity-0"
                } ${getResultColor()} text-white`}>
                  {result}
                </div>
              )}
            </div>

            {/* Computer Side */}
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold text-white mb-4">Computer</h2>
              <div className="flex flex-col gap-6">
                {computerCards.map((card, index) => (
                  <div 
                    key={`computer-${index}`}
                    className={`relative w-32 h-40 transition-all duration-300 ${
                      flippedComputerIndex === index && gameState !== "idle" 
                        ? "transform -translate-x-20 z-10" 
                        : ""
                    }`}
                    style={{ perspective: "1000px" }}
                  >
                    <div className={`relative w-full h-full transition-transform duration-500 ${
                      flippedComputerIndex === index ? "[transform:rotateY(180deg)]" : ""
                    }`} style={{ transformStyle: "preserve-3d" }}>
                      {/* Card Back (Hidden) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg flex items-center justify-center [backface-visibility:hidden]">
                        <span className="text-white text-6xl">?</span>
                      </div>
                      {/* Card Front (Revealed) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <span className="text-7xl">{choiceIcons[card]}</span>
                        <span className="text-white text-lg mt-2">{card}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Status */}
          {gameState === "idle" && (
            <p className="text-white text-xl mb-6">Select one of your cards to play</p>
          )}

          {/* Play Again Button */}
          {gameState === "finished" && (
            <button
              onClick={handlePlayAgain}
              className="px-8 py-3 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-200 transition-colors text-lg"
            >
              Next Round
            </button>
          )}
        </>
      )}
    </div>
  );
}

// Loading fallback component
function GameLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="text-white text-2xl">Loading game...</div>
    </div>
  );
}

// Main Game component that wraps the content with Suspense
const Game: React.FC = () => {
  return (
    <Suspense fallback={<GameLoading />}>
      <GameContent />
    </Suspense>
  );
};

export default Game;