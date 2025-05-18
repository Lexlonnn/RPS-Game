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
  const [gameState, setGameState] = useState<"loading" | "idle" | "animating" | "finished" | "gameOver">("loading");
  const [score, setScore] = useState<Score>({ player: 0, computer: 0 });
  const [roundsPlayed, setRoundsPlayed] = useState<number>(0);
  const [flippedPlayerIndex, setFlippedPlayerIndex] = useState<number | null>(null);
  const [flippedComputerIndex, setFlippedComputerIndex] = useState<number | null>(null);
  const [overallResult, setOverallResult] = useState<GameResult>(null);
  const [cardsReady, setCardsReady] = useState<boolean>(false);
  const [animationStage, setAnimationStage] = useState<"initial" | "cardFlip" | "handAnimation" | "resultReveal">("initial");
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);

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
    setAnimationStage("initial");
  }, []);

  // Initialize game with new cards and reset all scores
  const startNewGame = useCallback(() => {
    // First set loading state
    setGameState("loading");
    setCardsReady(false);
    
    const shuffledPlayer = [...choices].sort(() => Math.random() - 0.5);
    const shuffledComputer = [...choices].sort(() => Math.random() - 0.5);
    
    // Cards enter with animation effect - staggered timing for smoother appearance
    setTimeout(() => {
      setPlayerCards(shuffledPlayer);
      setComputerCards(shuffledComputer);
      
      // Delay slightly before showing cards to ensure smooth transition
      setTimeout(() => {
        setCardsReady(true);
        
        // After cards animation completes, set game to idle
        setTimeout(() => {
          setGameState("idle");
        }, 800);
      }, 400);
    }, 600);
    
    // Reset all game state
    resetRound();
    setScore({ player: 0, computer: 0 });
    setRoundsPlayed(0);
    setOverallResult(null);
  }, [choices, resetRound]);
  
  // Handle initial page load animations
  useEffect(() => {
    // Trigger page load animation after a short delay
    setTimeout(() => {
      setPageLoaded(true);
    }, 100);
  }, []);

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
    // First set loading state
    setGameState("loading");
    setCardsReady(false);
    
    const shuffledPlayer = [...choices].sort(() => Math.random() - 0.5);
    const shuffledComputer = [...choices].sort(() => Math.random() - 0.5);
    
    // Cards enter with animation effect - longer, smoother transitions
    setTimeout(() => {
      setPlayerCards(shuffledPlayer);
      setComputerCards(shuffledComputer);
      
      setTimeout(() => {
        setCardsReady(true);
        
        // After cards animation completes, set game to idle
        setTimeout(() => {
          setGameState("idle");
        }, 800);
      }, 400);
    }, 600);
    
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
    setAnimationStage("cardFlip");
    
    // Computer selects a random card after delay
    setTimeout(() => {
      const computerIndex = Math.floor(Math.random() * computerCards.length);
      const computerSelectedChoice = computerCards[computerIndex];
      setComputerChoice(computerSelectedChoice);
      setFlippedComputerIndex(computerIndex);
      
      // Move to hand animation stage
      setTimeout(() => {
        setAnimationStage("handAnimation");
        
        // Determine winner after animations complete
        setTimeout(() => {
          setAnimationStage("resultReveal");
          determineWinner(selectedChoice, computerSelectedChoice);
          setRoundsPlayed(prev => prev + 1);
          
          // Small delay before setting finished state for smoother transition
          setTimeout(() => {
            setGameState("finished");
          }, 300);
        }, 1500);
      }, 600);
    }, 800);
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
;

  // Generate a random rotation for initial card appearance
  const getRandomRotation = () => {
    return Math.floor(Math.random() * 6 - 3); // -3 to +3 degrees for more subtle rotation
  };

  // Generate a slight random offset for cards to make them look more natural
  const getRandomOffset = () => {
    return Math.floor(Math.random() * 8 - 4); // -4px to +4px
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-4 overflow-hidden transition-opacity duration-1000 ease-in-out ${pageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white opacity-10 animate-float"
              style={{
                width: `${Math.random() * 20 + 5}px`,
                height: `${Math.random() * 20 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 12 + 6}s`,
                animationDelay: `${Math.random() * 5}s`,
                filter: `blur(${Math.random() * 2 + 1}px)`
              }}
            />
          ))}
        </div>
        {/* Add additional animated shapes for depth */}
        <div className="absolute top-0 left-0 w-full h-full">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`star-${i}`}
              className="absolute bg-purple-300 opacity-20 animate-twinkle"
              style={{
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 4 + 2}s`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Round Info - Removed round selector */}
      <div className={`flex items-center justify-center mb-4 text-white transition-all duration-700 ease-out ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}
           style={{ transitionDelay: '200ms' }}>
        {gameState !== "gameOver" && (
          <div className="text-xl animate-fadeIn">
            Round {roundsPlayed + 1} of {totalRounds}
          </div>
        )}
      </div>
        
      {/* Game Over Screen - Removed round adjustment */}
      {gameState === "gameOver" ? (
        <div className={`flex flex-col items-center justify-center animate-scaleIn ${pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} transition-all duration-1000 ease-out`}
             style={{ transitionDelay: '600ms' }}>
          <div className={`text-5xl font-bold mb-8 ${
            overallResult === "win" ? "text-green-400 animate-bounce" :
            overallResult === "lose" ? "text-red-400 animate-pulse" :
            "text-purple-400 animate-pulse"
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
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-600 font-bold rounded-full hover:scale-110 transition-all duration-300 text-lg shadow-lg shadow-green-900/50 hover:shadow-green-900/70"
            >
              Play Again
            </button>
            <button
              onClick={handleBackToHome}
              className="px-8 py-3 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-lg shadow-lg"
            >
              Back to Home
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Game Arena */}
          <div className={`flex w-full max-w-5xl justify-between mb-12 transition-all duration-1000 ease-out ${pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
              style={{ transitionDelay: '600ms' }}>
            {/* Player Side */}
            <div className="flex flex-col items-center">
              <h2 className={`text-2xl font-bold text-white mb-4 transition-all duration-700 ease-out ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                   style={{ transitionDelay: '700ms' }}>Player</h2>
              <div className="flex flex-col gap-6">
                {playerCards.map((card, index) => (
                  <div 
                    key={`player-${index}`}
                    onClick={() => gameState === "idle" && handlePlayerCardClick(index)}
                    className={`relative w-32 h-40 cursor-pointer transition-all duration-700 ease-out ${
                      gameState === "idle" ? "hover:scale-110 hover:rotate-2 hover:shadow-lg hover:shadow-blue-500/30" : ""
                    } ${
                      flippedPlayerIndex === index && gameState !== "idle" && gameState !== "loading"
                        ? "transform translate-x-20 z-10" 
                        : ""
                    } ${
                      !cardsReady ? "opacity-0 -translate-x-20" : "opacity-100 translate-x-0"
                    }`}
                    style={{ 
                      perspective: "1500px",
                      transitionDelay: `${index * 150}ms`,
                      transform: cardsReady && gameState === "idle" ? `rotate(${getRandomRotation()}deg) translateY(${getRandomOffset()}px)` : undefined
                    }}
                  >
                    <div className={`relative w-full h-full transition-transform duration-700 ease-out ${
                      flippedPlayerIndex === index ? "[transform:rotateY(180deg)]" : ""
                    }`} style={{ transformStyle: "preserve-3d" }}>
                      {/* Card Back (Hidden) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg flex items-center justify-center [backface-visibility:hidden] hover:from-blue-500 hover:to-blue-700 group">
                        <span className="text-white text-6xl group-hover:scale-110 transition-transform duration-500">?</span>
                        <div className="absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      {/* Card Front (Revealed) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-green-500 to-green-700 rounded-xl shadow-lg flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <span className="text-7xl animate-floatBounce">{choiceIcons[card]}</span>
                        <span className="text-white text-lg mt-2">{card}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Center Battle Area */}
            <div className={`flex flex-col items-center justify-center mx-8 w-64 transition-all duration-1000 ease-out ${pageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: '800ms' }}>
              {/* 3D Hand Effects */}
              <div className="relative w-full h-48 mb-8 flex justify-between items-center">
                {/* Player Hand */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-7xl transition-all duration-700 ease-out ${
                  gameState === "idle" ? "bg-blue-500" : 
                  gameState === "animating" && animationStage === "handAnimation" ? "bg-blue-500 scale-150 animate-glow" : 
                  gameState === "animating" ? "bg-blue-500" : "bg-blue-500"
                } shadow-xl`}>
                  <div className={`transform transition-transform duration-700 ease-out ${
                    !playerChoice ? "" :
                    playerChoice === "Rock" && animationStage === "handAnimation" ? "animate-smoothShake" :
                    playerChoice === "Paper" && animationStage === "handAnimation" ? "animate-smoothWave" :
                    playerChoice === "Scissors" && animationStage === "handAnimation" ? "animate-smoothCut" :
                    ""
                  }`}>
                    {!playerChoice ? "✊" : choiceIcons[playerChoice]}
                  </div>
                </div>

                {/* Computer Hand */}
                <div className={`relative w-24 h-24 rounded-full flex items-center justify-center text-7xl transition-all duration-700 ease-out ${
                  gameState === "idle" ? "bg-red-500" : 
                  gameState === "animating" && animationStage === "handAnimation" ? "bg-red-500 scale-150 animate-glow" : 
                  gameState === "animating" ? "bg-red-500" : "bg-red-500"
                } shadow-xl`}>
                  <div className={`transform transition-transform duration-700 ease-out ${
                    !computerChoice ? "" :
                    computerChoice === "Rock" && animationStage === "handAnimation" ? "animate-smoothShake" :
                    computerChoice === "Paper" && animationStage === "handAnimation" ? "animate-smoothWave" :
                    computerChoice === "Scissors" && animationStage === "handAnimation" ? "animate-smoothCut" :
                    ""
                  }`}>
                    {!computerChoice ? "✊" : choiceIcons[computerChoice]}
                  </div>
                </div>
              </div>

              {/* Result Display */}
              {result && (
                <div className={`text-3xl font-bold px-8 py-3 rounded-full transition-all duration-700 ease-out ${
                  gameState === "finished" || animationStage === "resultReveal" ? "opacity-100 scale-100" : "opacity-0 scale-0"
                } ${getResultColor()} text-white shadow-lg animate-resultPop`}>
                  {result}
                </div>
              )}
            </div>

            {/* Computer Side */}
            <div className="flex flex-col items-center">
              <h2 className={`text-2xl font-bold text-white mb-4 transition-all duration-700 ease-out ${pageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                   style={{ transitionDelay: '900ms' }}>Computer</h2>
              <div className="flex flex-col gap-6">
                {computerCards.map((card, index) => (
                  <div 
                    key={`computer-${index}`}
                    className={`relative w-32 h-40 transition-all duration-700 ease-out ${
                      flippedComputerIndex === index && gameState !== "idle" && gameState !== "loading"
                        ? "transform -translate-x-20 z-10" 
                        : ""
                    } ${
                      !cardsReady ? "opacity-0 translate-x-20" : "opacity-100 translate-x-0"
                    }`}
                    style={{ 
                      perspective: "1500px",
                      transitionDelay: `${index * 150}ms`,
                      transform: cardsReady && gameState === "idle" ? `rotate(${getRandomRotation()}deg) translateY(${getRandomOffset()}px)` : undefined
                    }}
                  >
                    <div className={`relative w-full h-full transition-transform duration-700 ease-out ${
                      flippedComputerIndex === index ? "[transform:rotateY(180deg)]" : ""
                    }`} style={{ transformStyle: "preserve-3d" }}>
                      {/* Card Back (Hidden) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-xl shadow-lg flex items-center justify-center [backface-visibility:hidden] group">
                        <span className="text-white text-6xl group-hover:scale-110 transition-transform duration-500">?</span>
                        <div className="absolute inset-0 rounded-xl border-2 border-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      {/* Card Front (Revealed) */}
                      <div className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg flex flex-col items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                        <span className="text-7xl animate-floatBounce">{choiceIcons[card]}</span>
                        <span className="text-white text-lg mt-2">{card}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Status */}
          {gameState === "loading" && (
            <div className={`text-white text-xl mb-6 animate-fadeInPulse transition-all duration-700 ease-out ${pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionDelay: '1000ms' }}>Dealing cards...</div>
          )}
          
          {gameState === "idle" && (
            <p className={`text-white text-xl mb-6 transition-all duration-700 ease-out ${pageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
               style={{ transitionDelay: '1000ms' }}>Select one of your cards to play</p>
          )}

          {/* Play Again Button */}
          {gameState === "finished" && (
            <button
              onClick={handlePlayAgain}
              className="px-8 py-3 bg-white text-purple-900 font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-500 ease-out text-lg shadow-lg animate-fadeIn opacity-0"
            >
              Next Round
            </button>
          )}
        </>
      )}

      {/* Add enhanced animations to global styles */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; transform: scale(1.5); }
        }
        
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scaleIn {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes floatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        @keyframes smoothShake {
          0%, 100% { transform: rotate(0deg); }
          15% { transform: rotate(-15deg); }
          30% { transform: rotate(8deg); }
          45% { transform: rotate(-8deg); }
          60% { transform: rotate(8deg); }
          75% { transform: rotate(-8deg); }
          90% { transform: rotate(5deg); }
        }
        
        @keyframes smoothWave {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(5deg); }
          50% { transform: translateY(-12px) rotate(0deg); }
          75% { transform: translateY(-6px) rotate(-5deg); }
        }
        
        @keyframes smoothCut {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          50% { transform: rotate(70deg) translateY(-5px); }
          75% { transform: rotate(100deg) translateY(-2px); }
          90% { transform: rotate(90deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.3); }
          50% { box-shadow: 0 0 25px rgba(255, 255, 255, 0.7); }
        }
        
        @keyframes resultPop {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.1); opacity: 1; }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        
        @keyframes fadeInPulse {
          0% { opacity: 0; }
          50% { opacity: 1; }
          75% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.7s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-floatBounce {
          animation: floatBounce 2s ease-in-out infinite;
        }
        
        .animate-smoothShake {
          animation: smoothShake 1.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        .animate-smoothWave {
          animation: smoothWave 1.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        .animate-smoothCut {
          animation: smoothCut 1.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
        }
        
        .animate-glow {
          animation: glow 1.5s ease-in-out infinite;
        }
        
        .animate-fadeInPulse {
          animation: fadeInPulse 2s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Loading fallback component
function GameLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="text-white text-2xl animate-fadeInPulse mb-6">Loading game...</div>
      <div className="flex gap-4">
        {["✊", "✋", "✌️"].map((icon, index) => (
          <div 
            key={index}
            className="w-16 h-16 bg-purple-800 rounded-full flex items-center justify-center text-3xl animate-float"
            style={{ animationDelay: `${index * 0.3}s` }}
          >
            {icon}
          </div>
        ))}
      </div>
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