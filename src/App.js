import "./App.css";
import History from "./Components/History";
import Ongoing from "./Components/Ongoing";
import PlayerData from "./Components/PlayerData";
import Players from "./Components/Players";

function App() {
  return (
    <div className="flex flex-row justify-evenly text-2xl font-mono">
      <Ongoing className="text-2xl"></Ongoing>
      <Players className="text-2xl"></Players>
      <PlayerData></PlayerData>
    </div>
  );
}

export default App;
