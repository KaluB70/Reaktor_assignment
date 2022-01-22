import { useEffect } from "react";
import useMatches from "../UseMatches";
import rps from "../Assets/rps.gif";
const Ongoing = () => {
  const { live, wsConnect, totalGamesAll } = useMatches();

  useEffect(() => {
    wsConnect();
  }, []);

  return (
    <div>
      <h1>
        <b>LIVE MATCHES</b>
      </h1>
      <h2>TOTAL MATCHES FOUND: {totalGamesAll}</h2> <br />
      <br />
      <br />
      <ul>
        {live.map((m, index) => {
          return (
            <li
              className="text-2xl flex flex-row m-2 items-center"
              key={m.gameId + index}
            >
              {m.playerA.name + " VS " + m.playerB.name}
              <img
                className="max-h-24 border-2 rounded-lg ml-5"
                src={rps}
                alt="live game"
              ></img>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Ongoing;
