import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const WithdrawHistory = () => {
  const [history, setHistory] = useState([]);
  const getStatusMethod = (sts) => {
    if (sts === "waiting") {
      return `<span class="badge badge-warning">Waiting</span>`;
    } else if (sts === "finished") {
      return `<span class="badge badge-primary">Completed</span>`;
    } else if (sts === "failed") {
      return `<span class="badge badge-secondary">Failed</span>`;
    } else {
      return `<span class="badge badge-info">Processing</span>`;
    }
  };
  const getTimeMethod = (backTime) => {
    const oldDate = new Date(backTime);
    const currentTime = new Date();
    const Difference_In_Time = currentTime.getTime() - oldDate.getTime();
    let days = Math.round(Difference_In_Time / (1000 * 3600 * 24));
    if (days === 0) {
      days = `Today`;
    } else if (days < 2) {
      days = `${days} day ago`;
    } else {
      days = `${days} days ago`;
    }
    return days;
  };
  const historyMethod = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}withdraw-history`, {
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
                <th>Receiving</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Time</th>
                <th>status</th>
              </tr>
            </thead>
            <tbody>
              {/* row 1 */}
              {history.map((his, index) => (
                <tr key={index}>
                  <td>
                    {his.account.slice(0, 5)}***
                    {his.account.slice(his.account.length - 5)}
                  </td>
                  <td>{his.amount.$numberDecimal}</td>
                  <td>{his.payout_currency.toUpperCase()}</td>
                  <td>{getTimeMethod(his.updatedAt)}</td>
                  <td
                    dangerouslySetInnerHTML={{
                      __html: getStatusMethod(his.status),
                    }}
                  />
                </tr>
              ))}
            </tbody>
            {/* foot */}
            <tfoot>
              <tr>
                <th>Receiving</th>
                <th>Amount</th>
                <th>Currency</th>
                <th>Time</th>
                <th>status</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default WithdrawHistory;
