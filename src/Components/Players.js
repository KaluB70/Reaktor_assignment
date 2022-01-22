import React from "react";
import useMatches from "../UseMatches";
import giphy from "../Assets/giphy.gif";

function Players() {
  const {
    players,
    handleChange,
    searchPlayer,
    handleChoosePlayer,
    chosenPlayer,
    playerCount,
  } = useMatches();

  const changeValue = (e) => {
    handleChange(e.target.value);
  };
  const choosePlayer = (e) => {
    handleChoosePlayer(e.target.text);
  };

  return (
    <div className="">
      <b>PLAYERS:</b>
      <img className="max-h-24" src={giphy} alt="loading players..."></img>

      <br />
      <input
        type="search"
        placeholder="Enter name..."
        onChange={changeValue}
      ></input>
      <p>{playerCount} players found</p>
      <div className="max-h-96 overflow-y-scroll bg-slate-100">
        {players
          .sort()
          .filter((n) => n.toLowerCase().includes(searchPlayer.toLowerCase()))
          .map((m, index) => {
            return (
              <a
                className="font-mono hover:text-3xl hover:text-green-400"
                href="#"
                onClick={choosePlayer}
                key={m + index}
                value={chosenPlayer}
              >
                {m}
                <br />
              </a>
            );
          })}
      </div>
    </div>
  );
}

export default Players;
