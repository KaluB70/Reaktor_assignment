import { createContext, useState } from "react";

const AppContext = createContext([{}, () => {}]);

const AppProvider = ({ children }) => {
  let matches = [];
  let players = [];

  const [state, setState] = useState({
    matches: matches,
    currentGameId: 0,
    searchPlayer: "",
    players: players,
    chosenPlayer: "",
    stats: {
      name: "",
      wins: 0,
      losses: 0,
      draws: 0,
      winRatio: 0,
      mostPlayedHand: "",
    },
  });

  return (
    <AppContext.Provider value={[state, setState]}>
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
