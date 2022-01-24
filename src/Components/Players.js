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
    loading,
  } = useMatches();

  const changeValue = (e) => {
    handleChange(e.target.value);
  };
  const choosePlayer = (e) => {
    handleChoosePlayer(e.target.text);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-4xl text-center">PLAYERS</h1>
        {loading ? (
          <img className="max-h-32" src={giphy} alt="loading players..."></img>
        ) : null}
      </div>
      <input
        className="border-2 rounded-lg"
        type="search"
        placeholder="Enter name..."
        onChange={changeValue}
      ></input>
      <p>{playerCount} players found</p>
      <div className=" w-80 max-h-128 overflow-y-auto bg-violet-200 border-2 rounded-lg mt-4">
        {players
          .sort()
          .filter((n) => n.toLowerCase().includes(searchPlayer.toLowerCase()))
          .map((m, index) => {
            return (
              <a
                className="font-mono hover:text-3xl hover:bg-violet-100 hover:text-violet-600 rounded-lg"
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
