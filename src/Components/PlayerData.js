import useMatches from "../UseMatches";

function PlayerData() {
  const {
    chosenPlayer,
    matches,
    wins,
    losses,
    draws,
    winRatio,
    mostPlayedHand,
    totalGames,
  } = useMatches();

  if (chosenPlayer !== "")
    return (
      <div>
        <h2 className="font-extrabold text-3xl">{chosenPlayer}</h2>
        <div className="font-semibold">
          TOTAL GAMES PLAYED: {totalGames}
          <br />
          WINS: {wins} LOSSES: {losses} Draws: {draws}
          <br />
          WIN RATIO: {winRatio}
          <br />
          MOST PLAYED HAND: {mostPlayedHand}
          <br />
        </div>
        <ul className="max-h-96 overflow-y-scroll mt-6">
          GAME HISTORY
          {matches
            .filter(
              (matches) =>
                matches.playerA.name === chosenPlayer ||
                matches.playerB.name === chosenPlayer
            )
            .map((m, index) => {
              return (
                <li key={index} className="text-xl font-normal text-justify">
                  {m.playerA.name} VS {m.playerB.name}
                  <br />
                  {m.playerA.played} - {m.playerB.played}
                  <br />
                  <b>{"WINNER: " + m.winner}</b>
                </li>
              );
            })}
        </ul>
      </div>
    );
  else {
    return null;
  }
}

export default PlayerData;
