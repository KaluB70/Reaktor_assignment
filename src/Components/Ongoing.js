import { useEffect } from "react";
import useMatches from "../UseMatches";
import rps from "../Assets/rps.gif";
const Ongoing = () => {
  const { live, wsConnect, totalGamesAll, loadHistory } = useMatches();

  useEffect(() => {
    wsConnect();
    loadHistory();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center">LIVE MATCHES</h1>
      {/* <h2>TOTAL MATCHES FOUND: {totalGamesAll}</h2> <br /> */}
      <br />
      <ul className="overflow-y-auto h-screen">
        {live.map((m, index) => {
          return (
            <li
              className="text-2xl flex flex-row justify-between m-2 items-center bg-violet-200 border-2 rounded-lg"
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
