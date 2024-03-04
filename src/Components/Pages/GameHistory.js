import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import usdttrc20 from "../../images/usdttrc20.svg";
import trx from "../../images/trx.svg";
import dai from "../../images/dai.svg";
import sol from "../../images/sol.svg";
const GameHistory = () => {
  const [history, setHistory] = useState([]);

  const currencyImage = {
    usdttrc20: usdttrc20,
    sol: sol,
    dai: dai,
    trx: trx,
  };

  const historyMethod = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}game-history`, {
        token: Cookies.get("token"),
      })
      .then((data) => {
        setHistory(data.data.data);
      })
      .catch(() => {
        setHistory([]);
      });
  };
  useEffect(() => {
    historyMethod();
  }, []);
  return (
    <>
      <div className="py-6">
        <h2 className="text-center py-6">Transaction History</h2>
        <div className="overflow-x-auto">
          <table className="table text-center">
            {/* head */}
            <thead>
              <tr>
                <th>Crash</th>
                <th>Odds</th>
                <th>Bet Amount</th>
                <th>Win</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {history.map((his, index) => (
                <tr
                  className={
                    his.win.$numberDecimal > 0
                      ? "bg-green-900 border-green-500 text-white"
                      : "bg-red-900 border-red-500 text-white"
                  }
                  key={index}
                >
                  <td>x{his.crash.$numberDecimal}</td>
                  <td>x{his.odds.$numberDecimal}</td>
                  <td>
                    <div class="flex gap-1 items-center justify-center">
                      {his.amount.$numberDecimal}{" "}
                      <img class="w-4" src={currencyImage[his.currency]} />
                    </div>
                  </td>
                  <td>
                    <div class="flex gap-1 items-center justify-center">
                      {his.win.$numberDecimal}{" "}
                      <img class="w-4" src={currencyImage[his.currency]} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Crash</th>
                <th>Odds</th>
                <th>Bet Amount</th>
                <th>Win</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default GameHistory;
