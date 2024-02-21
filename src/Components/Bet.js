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
            // console.log(data.data);
            setAlert(data.data);
            setCashoutBtn(true);
            e.target.setAttribute("disabled", true);
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
        console.log(alert);
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
          {crashed ? (
            <>
              <button
                id="beBTn"
                onClick={bet}
                className="btn btn-wide w-[49%] btn-warning"
              >
                Place Bet
              </button>
              <button disabled className="btn btn-wide w-[49%] btn-error">
                Cashout
              </button>
            </>
          ) : (
            <>
              <button disabled className="btn btn-wide w-[49%] btn-warning">
                Place Bet
              </button>

              {cashoutBtn ? (
                <>
                  <button
                    onClick={cashout}
                    className="btn btn-wide w-[49%] btn-error"
                  >
                    Cashout
                  </button>
                </>
              ) : (
                <>
                  <button disabled className="btn btn-wide w-[49%] btn-error">
                    Cashout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
      <div className="py-6">
        <div className="overflow-x-auto">
          <table className="table">
            {/* head */}
            <thead>
              <tr>
                <th>Username</th>
                <th>Odds</th>
                <th>Bet Amount</th>
                <th>Win</th>
              </tr>
            </thead>
            <tbody id="betRow" className="text-xs">
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
