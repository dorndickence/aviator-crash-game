import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import usdttrc20 from "../images/usdttrc20.svg";
import trx from "../images/trx.svg";
import dai from "../images/dai.svg";
import sol from "../images/sol.svg";

const Bet = ({
  alert,
  setAlert,
  setCashoutBtn,
  bets,
  winnings,
  players,
  setBets,
  setWinnings,
  setPlayers,
  styleButton,
}) => {
  const [amount, setAmount] = useState(0);
  const [betData, setBetData] = useState([]);

  const currencyImage = {
    usdttrc20: usdttrc20,
    sol: sol,
    dai: dai,
    trx: trx,
  };

  const loginValidation = () => {
    let errorMsg = document.getElementById("errorMsg");
    if (!Cookies.get("token")) {
      if (errorMsg.childNodes.length === 0) {
        const msg = document.createElement("span");
        msg.classList.add("badge", "badge-error");
        msg.innerText = "Please login to play";
        errorMsg.appendChild(msg);
      }
      return false;
    }
    return true;
  };

  const amountMethod = (e) => {
    let errorMsg = document.getElementById("errorMsg");
    if (e.target.value > 0) {
      setAmount(e.target.value);
      errorMsg.innerHTML = "";
    } else {
      setAmount(0);
    }
  };
  const bet = (e) => {
    let errorMsg = document.getElementById("errorMsg");
    const currency = Cookies.get("currency");

    if (!loginValidation()) {
      return;
    }

    if (currency === undefined) {
      setAlert({ message: "Currency is not updated", success: false });
      return;
    }

    const cm = document.querySelectorAll(`.${currency}`);

    if (currency === "sol") {
      if (amount < 0.01) {
        const msg = document.createElement("span");
        msg.classList.add("badge", "badge-error");
        msg.innerText = "Minimum amount 0.01";
        errorMsg.appendChild(msg);
        return;
      }
    } else {
      if (amount < 1) {
        const msg = document.createElement("span");
        msg.classList.add("badge", "badge-error");
        msg.innerText = "Minimum amount 1";
        errorMsg.appendChild(msg);
        return;
      }
    }

    if (amount > 0) {
      axios
        .post(`${process.env.REACT_APP_API_URL}bet`, {
          amount: amount,
          socketuserId: Cookies.get("socketuserId"),
          token: Cookies.get("token"),
          currency: currency,
        })
        .then((data) => {
          if (data.status === 200) {
            setAlert(data.data);
            // e.target.setAttribute("disabled", true);
            styleButton("bet", "disable");

            cm.forEach((c) => {
              c.innerText = (
                parseFloat(c.innerText) - parseFloat(amount)
              ).toFixed(8);
            });
          }
        })
        .catch((error) => {
          console.log(error);
          setAlert(error.response.data);
        });
    } else {
      if (errorMsg.childNodes.length === 0) {
        const msg = document.createElement("span");
        msg.classList.add("badge", "badge-error");
        msg.innerText = "Enter amount";
        errorMsg.appendChild(msg);
      }
    }
  };
  const cashout = (e) => {
    const currency = Cookies.get("currency");
    if (currency === undefined) {
      setAlert({ message: "Currency is not updated", success: false });
      return;
    }

    if (!loginValidation()) {
      return;
    }

    const cm = document.querySelectorAll(`.${currency}`);

    axios
      .post(`${process.env.REACT_APP_API_URL}cashout`, {
        amount: amount,
        socketuserId: Cookies.get("socketuserId"),
        token: Cookies.get("token"),
        currency: currency,
      })
      .then((data) => {
        if (data.status === 200) {
          setAlert(data.data);
          setCashoutBtn(false);
          cm.forEach((c) => {
            c.innerText = (
              parseFloat(c.innerText) + parseFloat(data.data.amount)
            ).toFixed(8);
          });
        }
      })
      .catch((error) => {
        setAlert(error.response.data);
      });
  };

  const getBetData = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}betlive`, {
        token: Cookies.get("token"),
      })
      .then((data) => {
        setBetData(
          data.data.data.livebets.sort(
            (a, b) => b.amount.$numberDecimal - a.amount.$numberDecimal
          )
        );

        setBets(data.data.data.bets);
        setPlayers(data.data.data.players);
        setWinnings(data.data.data.winnings);
        if (data.data.data.userBetActve) {
          setTimeout(() => {
            styleButton("cashout", "active");
          }, data.data.data.timeout);
        }
      })
      .catch((error) => {
        setAlert(error.response.data);
      });
  };

  useEffect(() => {
    getBetData();
  }, []);

  return (
    <>
      <div className="py-6 space-y-3">
        <label className="input input-bordered flex items-center gap-2">
          Bet
          <input
            onKeyUp={amountMethod}
            id="amount"
            type="number"
            className="grow"
            placeholder="0"
          />
        </label>
        <div id="errorMsg"></div>

        <div className="flex justify-center gap-3">
          <button
            id="beBTn"
            onClick={bet}
            className="btn btn-wide w-[49%] bg-green-700 hover:bg-green-700 text-white"
          >
            Place Bet
          </button>
          <button
            id="beBTnFake"
            className="btn hidden btn-wide w-[49%] bg-green-950 hover:bg-green-950"
          >
            Place Bet
          </button>
          <button
            id="cashoutBtn"
            onClick={cashout}
            className="btn hidden btn-wide w-[49%] bg-rose-700 hover:bg-rose-700 text-white"
          >
            Cashout
          </button>
          <button
            id="cashoutBtnFake"
            className="btn btn-wide w-[49%] bg-rose-950 hover:bg-rose-950"
          >
            Cashout
          </button>
        </div>
      </div>
      <div className="flex justify-around bg-emerald-950 py-4 rounded-t-box">
        <div className="text-center">
          <div className=" text-xs">Number of players</div>
          <div className="font-bold text-xs" id="totalPlayers">
            {players}
          </div>
        </div>
        <div className="text-center">
          <div className=" text-xs">Total bets</div>
          <div className="font-bold text-xs">
            <span id="totalBets">{bets}</span>
            <span> USD</span>
          </div>
        </div>
        <div className="text-center">
          <div className=" text-xs">Total winnings</div>
          <div className="font-bold text-xs">
            <span id="totalWinnings">{winnings}</span>
            <span> USD</span>
          </div>
        </div>
      </div>
      <div className="py-6 min-h-[300px]">
        <div className="overflow-y-auto">
          <table id="myTable" className="table  text-center">
            {/* head */}
            <thead>
              <tr>
                <th>Username</th>
                <th>Odds</th>
                <th>Bet Amount</th>
                <th>Win</th>
              </tr>
            </thead>
            <tbody id="betRow" className="text-xs max-h-[300px]">
              {betData.map((livedata, index) => (
                <tr
                  key={index}
                  className={
                    livedata.win.$numberDecimal > 0
                      ? `bet${livedata._id} bg-green-900 border-green-500 text-white`
                      : `bet${livedata._id}`
                  }
                >
                  <td>{livedata.publicUsername}</td>
                  <td>x{livedata.odds.$numberDecimal}</td>
                  <td>
                    <div className="flex gap-1 items-center justify-center">
                      {livedata.amount.$numberDecimal}{" "}
                      <img
                        className="w-3"
                        src={currencyImage[livedata.currency]}
                      />
                    </div>
                  </td>
                  <td>
                    {" "}
                    <div className="flex gap-1 items-center justify-center">
                      {livedata.win.$numberDecimal}{" "}
                      <img
                        className="w-3"
                        src={currencyImage[livedata.currency]}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {alert && alert.success === true ? (
        <>
          <div className="toast toast-top top-[30px] toast-center">
            <div className="alert py-2">
              {alert.currency ? (
                <div className="flex items-center gap-1 text-green-500">
                  <span className="text-xl">Win </span>
                  <span className="text-xl">{alert.amount}</span>
                  <img
                    className="w-5 h-5"
                    src={currencyImage[alert.currency]}
                  />
                </div>
              ) : (
                <span className="text-xl">{alert.message}</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {alert && alert.success === false ? (
        <>
          <div className="toast toast-top  top-[30px] toast-center">
            <div className="alert alert-error py-2">
              <span>{alert.message}</span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Bet;
