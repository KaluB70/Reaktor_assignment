import { useContext, useEffect, useState } from "react";
import { AppContext } from "./app-context";

const useMatches = () => {
  const API_URL = "https://bad-api-assignment.reaktor.com";
  let API_CURSOR = "/rps/history";

  const [state, setState] = useContext(AppContext);
  const [live, setLive] = useState([]);
  const wsConnect = () => {
    const SOCKET = new WebSocket(
      "ws://bad-api-assignment.reaktor.com/rps/live"
    );
    SOCKET.onopen = () => {
      console.log("SOCKET OPEN");
    };
    SOCKET.onmessage = (event) => {
      let JSONdata = JSON.parse(event.data);
      handleMatch(JSON.parse(JSONdata));
    };
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    handlePlayers();
    handlePlayerStats();
  }, [state.matches]);

  const handlePlayerStats = () => {
    let winRatio,
      totalGames,
      mostPlayedHand,
      wins = 0,
      losses = 0,
      draws = 0,
      rock = 0,
      paper = 0,
      scissors = 0;

    let arr = state.matches.filter(
      (match) =>
        match.playerA.name === state.chosenPlayer ||
        match.playerB.name === state.chosenPlayer
    );
    totalGames = arr.length;
    arr.forEach((m) => {
      if (m.winner === "DRAW") {
        draws++;
      } else if (m.winner === state.chosenPlayer) {
        wins++;
      } else {
        losses++;
      }
      if (m.playerA.name === state.chosenPlayer) {
        if (m.playerA.played === "ROCK") {
          rock++;
        }
        if (m.playerA.played === "SCISSORS") {
          scissors++;
        }
        if (m.playerA.played === "PAPER") {
          paper++;
        }
      }
      if (m.playerB.name === state.chosenPlayer) {
        if (m.playerB.played === "ROCK") {
          rock++;
        }
        if (m.playerB.played === "SCISSORS") {
          scissors++;
        }
        if (m.playerB.played === "PAPER") {
          paper++;
        }
      }
    });
    const mph = { ROCK: rock, SCISSORS: scissors, PAPER: paper };
    mostPlayedHand = Object.keys(mph).reduce((a, b) =>
      mph[a] > mph[b] ? a : b
    );
    winRatio = !Number.isFinite(wins / (losses + draws))
      ? wins
      : wins / (losses + draws);

    setState((prevState) => ({
      ...prevState,
      stats: {
        name: state.chosenPlayer,
        wins: wins,
        losses: losses,
        draws: draws,
        mostPlayedHand: mostPlayedHand,
        winRatio: winRatio.toFixed(2),
        totalGames: totalGames,
      },
    }));
  };
  function handleMatch(ev) {
    let game = {
      gameId: ev.gameId,
      t: 0,
      playerA: { name: ev.playerA.name, played: "" },
      playerB: { name: ev.playerB.name, played: "" },
      isRunning: false,
    };
    if (ev.type === "GAME_BEGIN") {
      handleBegin(game);
    } else if (ev.type === "GAME_RESULT") {
      handleResult(ev, game);
    }
  }
  function handleBegin(game) {
    let tempGame = game;
    tempGame.isRunning = true;

    setLive((prevState) => prevState.concat(tempGame));
    setState((prevState) => ({
      ...prevState,
      players: prevState.players.concat(
        tempGame.playerA.name,
        tempGame.playerB.name
      ),
    }));
  }
  function handleResult(event, game) {
    let tempGame = game;
    tempGame.isRunning = false;
    tempGame.t = event.t;
    tempGame.playerA.played = event.playerA.played;
    tempGame.playerB.played = event.playerB.played;
    tempGame.winner = checkWinner(tempGame.playerA, tempGame.playerB);

    setLive((prevLive) => prevLive.filter((m) => m.gameId !== tempGame.gameId));
    setState((prevState) => ({
      ...prevState,
      matches: prevState.matches.concat(tempGame),
      players: prevState.players.concat(
        tempGame.playerA.name,
        tempGame.playerB.name
      ),
      currentGameId: tempGame.gameId,
    }));
  }
  const checkWinner = (A, B) => {
    if (A.played === B.played) {
      return "DRAW";
    }
    if (A.played === "ROCK") {
      if (B.played === "SCISSORS") return A.name;
      else if (B.played === "PAPER") return B.name;
    }
    if (A.played === "PAPER") {
      if (B.played === "SCISSORS") return B.name;
      else if (B.played === "ROCK") return A.name;
    }
    if (A.played === "SCISSORS") {
      if (B.played === "ROCK") return B.name;
      else if (B.played === "PAPER") return A.name;
    }
  };

  async function loadHistory() {
    try {
      let response = await fetch(API_URL + API_CURSOR);
      if (response.ok) {
        let result = await response.json();
        if (result.data.length < 1) return;
        let newArr = [];
        let game = {};
        result.data.forEach((match) => {
          game = {
            gameId: match.gameId,
            t: match.t,
            playerA: { name: match.playerA.name, played: match.playerA.played },
            playerB: { name: match.playerB.name, played: match.playerB.played },
            isRunning: false,
            winner: checkWinner(match.playerA, match.playerB),
          };
          newArr.push(game);
        });

        setState((prevState) => ({
          ...prevState,
          matches: prevState.matches.concat(game),
          players: prevState.players.concat(
            game.playerA.name,
            game.playerB.name
          ),
        }));

        if (result.cursor !== API_CURSOR && result.cursor != null) {
          API_CURSOR = result.cursor;
          await sleep(50);
          loadHistory();
        }
      } else {
        await sleep(10000);
        loadHistory();
      }
    } catch (error) {
      console.log("yes");
    }
    // let newArr = result.data.filter(
    //   (match) =>
    //     match.playerA.name.includes(state.searchPlayer) ||
    //     match.playerB.name.includes(state.searchPlayer)
    // );
  }
  const handlePlayers = () => {
    setState((prevState) => ({
      ...prevState,
      players: [...new Set(prevState.players)],
    }));
  };
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleChange = (e) => {
    setState((prevState) => ({
      ...prevState,
      searchPlayer: e,
    }));
  };
  const handleChoosePlayer = (e) => {
    setState((prevState) => ({
      ...prevState,
      chosenPlayer: e,
      stats: { name: e },
    }));
    handlePlayerStats();
  };
  return {
    matches: state.matches,
    searchPlayer: state.searchPlayer,
    playerCount: state.players.length,
    wsConnect,
    handleChange,
    loadHistory,
    players: state.players,
    live,
    winRatio: state.stats.winRatio,
    wins: state.stats.wins,
    losses: state.stats.losses,
    totalGames: state.stats.totalGames,
    totalGamesAll: state.matches.length,
    mostPlayedHand: state.stats.mostPlayedHand,
    draws: state.stats.draws,
    // mostRecentGames,
    handleChoosePlayer,
    chosenPlayer: state.chosenPlayer,
  };
};
export default useMatches;
