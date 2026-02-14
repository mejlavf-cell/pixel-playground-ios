// Game entry point
import { GameProvider, useGame } from "@/context/GameContext";
import { HomeScreen } from "@/screens/HomeScreen";
import { SetupScreen } from "@/screens/SetupScreen";
import { PlayerTransitionScreen } from "@/screens/PlayerTransitionScreen";
import { GameScreen } from "@/screens/GameScreen";
import { WinnerScreen } from "@/screens/WinnerScreen";

function GameRouter() {
  const { screen } = useGame();

  switch (screen) {
    case "home":
      return <HomeScreen />;
    case "setup":
      return <SetupScreen />;
    case "playerTransition":
      return <PlayerTransitionScreen />;
    case "game":
      return <GameScreen />;
    case "winner":
      return <WinnerScreen />;
    default:
      return <HomeScreen />;
  }
}

const Index = () => {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
};

export default Index;
