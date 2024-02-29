import Crash from "../Crash";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Bet from "../Bet";

const Home = () => {
  const [crashNumber, setCrashNumber] = useState("");
  const [crashed, setCrashed] = useState(true);
  const [timer, setTimer] = useState("0");
  const [players, setPlayers] = useState("0");
  const [bets, setBets] = useState("0");
  const [winnings, setWinnings] = useState("0");

  const styleButton = (button, isTrue) => {
    const betButton = document.getElementById("beBTn");
    const cashoutButton = document.getElementById("cashoutBtn");
    const betButtonFake = document.getElementById("beBTnFake");
    const cashoutButtonFake = document.getElementById("cashoutBtnFake");
    if (button === "bet") {
      if (isTrue === "active") {
        betButton.classList.remove("hidden");
        betButtonFake.classList.add("hidden");
      } else {
        betButtonFake.classList.remove("hidden");
        betButton.classList.add("hidden");
      }
    }
    if (button === "cashout") {
      if (isTrue === "active") {
        cashoutButtonFake.classList.add("hidden");
        cashoutButton.classList.remove("hidden");
      } else {
        cashoutButtonFake.classList.remove("hidden");
        cashoutButton.classList.add("hidden");
      }
    }
  };

  const [alert, setAlert] = useState(false);
  const [cashoutBtn, setCashoutBtn] = useState(false);
  const soundController = (e) => {
    if (Cookies.get("sound")) {
      Cookies.remove("sound");
      e.target.removeAttribute("Checked");
    } else {
      Cookies.set("sound", "yes");
    }
  };
  useEffect(() => {
    const sound = document.getElementById("sound");

    if (Cookies.get("sound")) {
      sound.setAttribute("Checked", "true");
    }
  }, []);
  return (
    <>
      <div className="bg-base-200">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>

          <input
            type="checkbox"
            id="sound"
            className="toggle toggle-sm toggle-success"
            onClick={soundController}
          />
        </div>
        <div className="max-w-lg m-auto relative ">
          <div>
            <Crash
              setCrashNumber={setCrashNumber}
              crashNumber={crashNumber}
              crashed={crashed}
              setCrashed={setCrashed}
              setAlert={setAlert}
              setCashoutBtn={setCashoutBtn}
              timer={timer}
              setTimer={setTimer}
              setBets={setBets}
              setWinnings={setWinnings}
              setPlayers={setPlayers}
              winnings={winnings}
              bets={bets}
              players={players}
              styleButton={styleButton}
            />
          </div>
          <div className="px-3 sm:px-0">
            <Bet
              crashNumber={crashNumber}
              crashed={crashed}
              alert={alert}
              setAlert={setAlert}
              cashoutBtn={cashoutBtn}
              setCashoutBtn={setCashoutBtn}
              timer={timer}
              winnings={winnings}
              bets={bets}
              players={players}
              setBets={setBets}
              setWinnings={setWinnings}
              setPlayers={setPlayers}
              styleButton={styleButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
