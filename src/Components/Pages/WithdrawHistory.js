import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

const WithdrawHistory = () => {
  const [history, setHistory] = useState(false);
  const [totalPages, setTotalPages] = useState([0]);
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
  const historyMethod = (page = 0) => {
    axios
      .post(`${process.env.REACT_APP_API_URL}withdraw-history`, {
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

  const setPageNumber = (index, e) => {
    const pagesBtn = document.querySelectorAll(".pagebtns");
    let counter = 0;
    pagesBtn.forEach((btn) => {
      if (btn.classList.contains("bg-green-500")) {
        counter++;
        btn.classList.remove("bg-green-500", "text-black");
        if (index === "next") {
          index = parseInt(btn.innerText);

          if (index < pagesBtn.length) {
            setTimeout(() => {
              pagesBtn[index].classList.add("bg-green-500", "text-black");
            }, 10);
          }
          if (index === pagesBtn.length) {
            index = 0;
            pagesBtn[index].classList.add("bg-green-500", "text-black");
          }
        }
        if (index === "back") {
          index = parseInt(btn.innerText) - 2;

          if (index >= 0) {
            setTimeout(() => {
              pagesBtn[index].classList.add("bg-green-500", "text-black");
            }, 10);
          }
          if (index < 0) {
            index = pagesBtn.length - 1;
            setTimeout(() => {
              pagesBtn[index].classList.add("bg-green-500", "text-black");
            }, 10);
          }
        }
      }
    });

    if (counter === 0 && (index === "next" || index === "back")) {
      if (index === "next") {
        index = 0;
      } else {
        index = pagesBtn.length - 1;
      }
      pagesBtn[index].classList.add("bg-green-500", "text-black");
    }

    if (!e.target.classList.contains("bg-green-500")) {
      e.target.classList.add("bg-green-500", "text-black");
    }

    setHistory(false);

    historyMethod(index);
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
              {history ? (
                history.map((his, index) => (
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
                ))
              ) : (
                <>
                  <tr className="absolute left-[45%]">
                    <td>
                      <span className="loading loading-bars loading-lg"></span>
                    </td>
                  </tr>
                </>
              )}
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
        <div className="join flex-wrap">
          <button
            onClick={(e) => {
              setPageNumber("back", e);
            }}
            className="join-item btn btn-outline"
          >
            Previous
          </button>
          {totalPages &&
            totalPages.map((page, index) => (
              <div
                key={index}
                onClick={(e) => {
                  setPageNumber(index, e);
                }}
                className="join-item btn btn-outline pagebtns"
              >
                {page}
              </div>
            ))}

          <button
            onClick={(e) => {
              setPageNumber("next", e);
            }}
            className="join-item btn btn-outline"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default WithdrawHistory;
