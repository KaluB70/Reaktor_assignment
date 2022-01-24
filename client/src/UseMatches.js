import { useContext, useEffect, useState } from "react";
import { AppContext } from "./app-context";
import Axios from "axios";
import axios from "axios";
import { get } from "mongoose";

const useMatches = () => {
  const API_URL = "https://bad-api-assignment.reaktor.com";
  let API_CURSOR = "/rps/history";
  let cursors = [];
  let matches = [];
  let players = [];
  const [state, setState] = useContext(AppContext);
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     // loadHistory();
  //   }, 2000);
  //   return () => clearTimeout(timeout);
  // }, []);
  const fetchDB = () => {
    matches = getMatchesDB();
    players = getPlayersDB();
    cursors = getCursorsDB();
  };
  useEffect(() => {
    handlePlayers();
    handlePlayerStats();
  }, [state.chosenPlayer]);

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
    // setState((prevState) => ({
    //   ...prevState,
    //   players: prevState.players.concat(
    //     tempGame.playerA.name,
    //     tempGame.playerB.name
    //   ),
    // }));
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

  // const loadHistory = async () => {
  //   await Axios.get(API_URL.concat(API_CURSOR)).then((res) => {
  //     let index = cursors.some((c) => c === "/rps/history?cursor=ejhG_6SwC5pT");
  //     console.log(index);
  //   });
  // };

  // const loadHistory = async () => {
  //   await Axios.get(API_URL.concat(API_CURSOR))
  //     .then((res) => {
  //       if (
  //         res.data.cursor === null ||
  //         cursors.some((c) => c === res.data.cursor)
  //       ) {
  //         setLoading(false);
  //         console.log("API REFRESHED");
  //         // return;
  //       }
  //       let game = {};
  //       res.data.data.forEach((match) => {
  //         let game = {};
  //         // console.log(matches, match.gameId);
  //         if (!matches.some((m) => m.gameId === match.gameId)) {
  //           game = {
  //             type: match.type,
  //             t: match.t,
  //             gameId: match.gameId,
  //             playerA: {
  //               name: match.playerA.name,
  //               played: match.playerA.played,
  //             },
  //             playerB: {
  //               name: match.playerB.name,
  //               played: match.playerB.played,
  //             },
  //             winner: checkWinner(match.playerA, match.playerB),
  //           };
  //           console.log("NEW MATCH ADDED");
  //           addMatch(game);
  //         }
  //         if (!players.some((p) => p.name === match.playerA.name)) {
  //           // console.log(match.playerA.name + " ADDED");
  //           addPlayer(match.playerA);
  //         }
  //         if (!players.some((p) => p.name === match.playerB.name)) {
  //           // console.log(match.playerA.name + " ADDED");
  //           addPlayer(match.playerB.name);
  //         }
  //         // setTimeout(() => addPlayer(game.playerA), 300);
  //         // setTimeout(() => addPlayer(game.playerB), 300);
  //         // setTimeout(() => addMatch(game), 300);
  //         // addPlayer(game.playerB);
  //       });
  //       // addCursor(res.data.cursor);

  //       setState((prevState) => ({
  //         ...prevState,
  //         matches: prevState.matches.concat(game),
  //         players: prevState.players.concat(
  //           game.playerA.name,
  //           game.playerB.name
  //         ),
  //       }));

  //       if (
  //         res.data.cursor !== API_CURSOR &&
  //         res.data.cursor != null &&
  //         res.data.data.length > 1
  //       ) {
  //         API_CURSOR = res.data.cursor;
  //         loadHistory();
  //         // loadHistory();
  //       } else {
  //         setLoading(false);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setTimeout(() => loadHistory(), 3000);
  //     });
  // };
  const handlePlayers = () => {
    setState((prevState) => ({
      ...prevState,
      players: [...new Set(prevState.players)],
    }));
  };

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

  const addMatch = async (game) => {
    await Axios.post("http://localhost:3001/addMatch", {
      type: game.type,
      gameId: game.gameId,
      t: game.t,
      playerA: { name: game.playerA.name, played: game.playerA.played },
      playerB: { name: game.playerB.played, played: game.playerB.played },
      winner: game.winner,
    });
    setState((prevState) => ({
      ...prevState,
      matches: prevState.matches.concat(game),
    }));
  };

  const addPlayer = (player) => {
    Axios.post("http://localhost:3001/addPlayer", { name: player.name });
    setState((prevState) => ({
      ...prevState,
      players: prevState.players.concat(player),
    }));
  };

  const addCursor = (cursor) => {
    Axios.post("http://localhost:3001/addCursor", {
      cursor: cursor,
    });
    setState((prevState) => ({
      ...prevState,
      cursors: prevState.cursors.concat(cursor),
    }));
  };

  const getMatchesDB = () => {
    let matchArr = [];
    Axios.get("http://localhost:3001/getMatches").then((response) => {
      response.data.forEach((match) => matchArr.push(match));
      setState((prevState) => ({
        ...prevState,
        matches: matchArr,
      }));
    });
    return matchArr;
  };
  const getPlayersDB = () => {
    let playerArr = [];
    Axios.get("http://localhost:3001/getPlayers").then((response) => {
      response.data.forEach((player) => playerArr.push(player));
      setState((prevState) => ({
        ...prevState,
        players: playerArr,
      }));
    });
  };
  const getCursorsDB = () => {
    let cursArr = [];
    Axios.get("http://localhost:3001/getCursors").then((response) => {
      response.data.forEach((c) => cursArr.push(c.cursor));
      setState((prevState) => ({
        ...prevState,
        cursors: cursArr,
      }));
    });
    return cursArr;
  };

  const initLoad = async () => {
    let cursorArr = [];
    let matchArr = [];
    let playerArr = [];
    const response = await Axios.get("http://localhost:3001/getCursors");
    response.data.forEach((c) => cursorArr.push(c.cursor));
    const response2 = await Axios.get("http://localhost:3001/getPlayers");
    response2.data.forEach((player) => playerArr.push(player));
    const response3 = await Axios.get("http://localhost:3001/getMatches");
    response3.data.forEach((match) => matchArr.push(match));
    console.log(matchArr);
    setState((prevState) => ({
      ...prevState,
      cursors: cursorArr,
      players: playerArr,
      matches: matchArr,
    }));
  };
  return {
    matches: state.matches,
    searchPlayer: state.searchPlayer,
    playerCount: state.players.length,
    wsConnect,
    handleChange,
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
    loading,
    // loadHistory,
    getPlayersDB,
    getCursorsDB,
    getMatchesDB,
    fetchDB,
    initLoad,
  };
};
export default useMatches;
