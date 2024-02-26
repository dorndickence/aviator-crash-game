import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const GameHistory = () => {
  const [history, setHistory] = useState([]);

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
                      ? "text-green-500"
                      : "text-red-500"
                  }
                  key={index}
                >
                  <td>x{his.crash.$numberDecimal}</td>
                  <td>x{his.odds.$numberDecimal}</td>
                  <td>{his.amount.$numberDecimal}</td>
                  <td>{his.win.$numberDecimal}</td>
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
