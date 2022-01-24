import useMatches from "../UseMatches";
import { useEffect } from "react";

function History() {
  const { matches, handleChange, findPlayer, loadHistory } = useMatches();
  const changeValue = (e) => {
    handleChange(e);
  };
  const find = () => {
    findPlayer();
  };

  return (
    <div>
      {/* <div>
        RECENTLY FINISHED MATCHES
        <ul>
          {matches
            .filter((m) => !m.isRunning)
            .map((f) => (
              <li key={f.gameId + "-" + f.running}>
                {f.playerA.name +
                  " VS " +
                  f.playerB.name +
                  " WINNER: " +
                  nullCheck}
              </li>
            ))}
        </ul>
      </div> */}
      <div>
        {/* <input type="submit" value="Search" onClick={find} />
        {matches
          .filter((m) => !m.isRunning)
          .map((match, index) => {
            return <p key={match.gameId + index}>{match.playerA.name}</p>;
          })} */}
      </div>
    </div>
  );
}

export default History;
