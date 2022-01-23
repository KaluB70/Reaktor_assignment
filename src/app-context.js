import { createContext, useState } from "react";

const AppContext = createContext([{}, () => {}]);

const AppProvider = ({ children }) => {
  let matches = [];
  let players = [];

  //A state to store most of the data as it stands - not very practical and currently implpementing
  // a full-stack solution to this to store the data in a DB rather than a State
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
