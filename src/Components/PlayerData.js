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
        <div className="font-semibold h-fit bg-violet-200 border-2 rounded-lg text-center mt-2">
          <h2 className="font-bold text-4xl">{chosenPlayer}</h2>
          <br />
          TOTAL GAMES PLAYED: {totalGames}
          <br />
          WINS: {wins} LOSSES: {losses} Draws: {draws}
          <br />
          WIN RATIO: {winRatio}
          <br />
          MOST PLAYED HAND: {mostPlayedHand}
        </div>
        <h2 className="mt-4 font-bold text-2xl border-2 rounded-lg bg-violet-200">
          GAME HISTORY
        </h2>
        <ul className="max-h-128 overflow-y-auto mt-2 bg-violet-200 border-2 rounded-lg">
          {matches
            .filter(
              (matches) =>
                matches.playerA.name === chosenPlayer ||
                matches.playerB.name === chosenPlayer
            )
            .map((m, index) => {
              return (
                <li
                  key={index}
                  className="text-xl font-normal text-center bg-violet-100 rounded-lg border-2 m-2"
                >
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
