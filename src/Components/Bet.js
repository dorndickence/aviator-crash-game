import { useEffect, useState } from "react";
import Crash from "./Crash";
import axios from "axios";
import Cookies from "js-cookie";

const Bet = ({
  crashNumber,
  crashed,
  alert,
  setAlert,
  cashoutBtn,
  setCashoutBtn,
  timer,
}) => {
  const [amount, setAmount] = useState(0);
  const [betData, setBetData] = useState([]);
  const loginValidation = () => {
    let errorMsg = document.getElementById("errorMsg");
    if (!Cookies.get("token")) {
      if (errorMsg.childNodes.length === 0) {
        const msg = document.createElement("span");
        msg.classList.add("badge", "badge-error");
        msg.innerText = "Please login to play";
        errorMsg.appendChild(msg);
      }
      return;
    }
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
    loginValidation();

    if (amount > 0) {
      axios
        .post(`${process.env.REACT_APP_API_URL}bet`, {
          amount: amount,
          token: Cookies.get("token"),
        })
        .then((data) => {
          if (data.status === 200) {
            setAlert(data.data);
            setCashoutBtn(true);
            // e.target.setAttribute("disabled", true);
            e.target.removeAttribute("onClick");
            e.target.classList.remove(
              "bg-green-700",
              "hover:bg-green-700",
              "text-white"
            );
            e.target.classList.add("bg-green-950", "hover:bg-green-950");
          }
        })
        .catch((error) => {
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
    loginValidation();
    axios
      .post(`${process.env.REACT_APP_API_URL}cashout`, {
        amount: amount,
        token: Cookies.get("token"),
      })
      .then((data) => {
        if (data.status === 200) {
          setAlert(data.data);
          setCashoutBtn(false);
        }
      })
      .catch((error) => {
        setAlert(error.response.data);
      });
  };

  const getBetData = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}betlive`)
      .then((data) => {
        setBetData(data.data.data);
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
          {/* {} */}
          {crashed && timer >= 2 && timer <= 10 ? (
            <>
              <button
                id="beBTn"
                onClick={bet}
                className="btn btn-wide w-[49%] bg-green-700 hover:bg-green-700 text-white"
              >
                Place Bet
              </button>
              <button className="btn btn-wide w-[49%] bg-rose-950 hover:bg-rose-950">
                Cashout
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-wide w-[49%] bg-green-950 hover:bg-green-950 ">
                Place Bet
              </button>
              {/* {} */}
              {cashoutBtn ? (
                <>
                  <button
                    onClick={cashout}
                    className="btn btn-wide w-[49%]  bg-rose-700 hover:bg-rose-700 text-white"
                  >
                    Cashout
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-wide w-[49%]  bg-rose-950 hover:bg-rose-950">
                    Cashout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex justify-around bg-emerald-950 py-4 rounded-t-box">
        <div className="text-center">
          <div className=" text-xs">Number of players</div>
          <div className="font-bold text-xs">12323</div>
        </div>
        <div className="text-center">
          <div className=" text-xs">Number of players</div>
          <div className="font-bold text-xs">12323</div>
        </div>
        <div className="text-center">
          <div className=" text-xs">Number of players</div>
          <div className="font-bold text-xs">12323</div>
        </div>
      </div>
      <div className="py-6">
        <div className="overflow-y-auto">
          <table className="table  text-center">
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
                      ? `bet${livedata._id} text-green-300`
                      : `bet${livedata._id}`
                  }
                >
                  <td>{livedata.publicUsername}</td>
                  <td>x{livedata.odds.$numberDecimal}</td>
                  <td>{livedata.amount.$numberDecimal}</td>
                  <td>{livedata.win.$numberDecimal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {alert && alert.success === true ? (
        <>
          <div className="toast toast-top toast-center">
            <div className="alert alert-success">
              <span>{alert.message}</span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {alert && alert.success === false ? (
        <>
          <div className="toast toast-top toast-center">
            <div className="alert alert-error">
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
