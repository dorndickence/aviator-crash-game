import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import usdttrc20 from "../../images/usdttrc20.svg";
import trx from "../../images/trx.svg";
import dai from "../../images/dai.svg";
import sol from "../../images/sol.svg";
import bdt from "../../images/bdt2.png";
const GameHistory = () => {
  const [history, setHistory] = useState(false);
  const [totalPages, setTotalPages] = useState([0]);

  const currencyImage = {
    usdttrc20: usdttrc20,
    sol: sol,
    dai: dai,
    trx: trx,
    bdt: bdt,
  };

  const historyMethod = (page = 0) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}game-history`, {
        token: Cookies.get("token"),
        page: page,
      })
      .then((data) => {
        setHistory(data.data.data);
        setTotalPages(data.data.totalPages);
      })
      .catch(() => {
        setHistory(false);
      });
  };

  const getColor = (odds) => {
    if (odds >= 1 && odds <= 2) return "bg-blue-500 text-white"; // 1-2.00
    if (odds > 2 && odds <= 9.9) return "bg-purple-500 text-white"; // 2.01-9.9
    if (odds > 10 && odds <= 99.9) return "bg-pink-500 text-white"; // 10-99.9
    if (odds >= 100) return "bg-red-500 text-white"; // 100 and above
    return ""; // Default case
  };

  const fetchHistory = (page = 0) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}game-history`, {
        token: Cookies.get("token"),
        page: page,
      })
      .then((data) => {
        setHistory(data.data.data);
        setTotalPages(data.data.totalPages);
        scrollToBottom(); // Scroll to the bottom on new data
      })
      .catch(() => {
        setHistory([]);
      });
  };

  const scrollToBottom = () => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="py-6" ref={historyRef} style={{ maxHeight: '300px', overflowY: 'auto' }}>
      <h2 className="text-center py-6">Transaction History</h2>
      <div className="overflow-x-auto">
        <table className="table text-center">
          <thead>
            <tr>
              <th>Crash</th>
              <th>Odds</th>
              <th>Bet Amount</th>
              <th>Win</th>
            </tr>
          </thead>
          <tbody>
            {history.length > 0 ? (
              history.map((his, index) => (
                <tr
                  className={
                    his.win.$numberDecimal > 0
                      ? "bg-green-900 border-green-500 text-white"
                      : "bg-rose-900 border-rose-500 text-white"
                  }
                  key={index}
                >
                  <td>x{his.crash.$numberDecimal}</td>
                  <td className={getColor(his.odds.$numberDecimal)}>
                    x{his.odds.$numberDecimal}
                  </td>
                  <td>
                    <div className="flex gap-1 items-center justify-center">
                      {parseFloat(his.amount.$numberDecimal).toFixed(8)}{" "}
                      <img className="w-4" src={currencyImage[his.currency]} />
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1 items-center justify-center">
                      {parseFloat(his.win.$numberDecimal).toFixed(8)}{" "}
                      <img className="w-4" src={currencyImage[his.currency]} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  <span className="loading loading-bars loading-lg"></span>
                </td>
              </tr>
            )}
          </tbody>
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
      <div className="join flex-wrap">
        <button onClick={(e) => setPageNumber("back", e)} className="join-item btn btn-outline">
          Previous
        </button>
        {totalPages.map((page, index) => (
          <div
            key={index}
            onClick={(e) => setPageNumber(index, e)}
            className="join-item btn btn-outline pagebtns"
          >
            {page}
          </div>
        ))}
        <button onClick={(e) => setPageNumber("next", e)} className="join-item btn btn-outline">
          Next
        </button>
      </div>
    </div>
  );
};

export default GameHistory;