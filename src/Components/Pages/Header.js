import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
import fly from "../../images/fly.png";
import usdttrc20 from "../../images/usdttrc20.svg";
import trx from "../../images/trx.svg";
import dai from "../../images/dai.svg";
import sol from "../../images/sol.svg";
import bdt from "../../images/bdt2.png";
const Header = () => {
  const [balances, setBalances] = useState([]);
  const getBalanceMethod = (currency) => {
    const btnModal = document.getElementById("btnm");
    const amount = document.querySelector(`.${currency}`).innerText;
    btnModal.classList.toggle("hidden");
    Cookies.set("currency", currency);
    const balanceChange = document.getElementById("balanceChange");
    const amountx = formatAmount(currency, amount);
    balanceChange.innerHTML = ` <div
    class=" rounded text-black  cursor-pointer flex gap-1 items-center justify-between "
  >
  <img class="w-4 h-4" src=${currencyImage[Cookies.get("currency")]}>
    <span class="${currency}">
      ${amountx}
    </span>
  </div>`;
  };
  const currencyImage = {
    usdttrc20: usdttrc20,
    sol: sol,
    dai: dai,
    trx: trx,
    bdt: bdt,
  };
  const getBalance = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}balance`, {
        token: Cookies.get("token"),
      })
      .then((data) => {
        setBalances(data.data.data);

        if (
          Cookies.get("currency") === undefined &&
          Object.keys(data.data.data).length !== 0
        ) {
          setTimeout(() => {
            const balanceChange = document.getElementById("balanceChange");
            // console.log(balanceChange);

            balanceChange.innerHTML = ` <div
            class=" text-black  cursor-pointer flex gap-1 items-center justify-between "
          >
          <img class="w-4 h-4" src=${
            currencyImage[Object.keys(data.data.data)[0]]
          }>
         
            <span class="${Object.keys(data.data.data)[0]}">
            ${formatAmount(
              Object.keys(data.data.data)[0],
              Object.values(data.data.data)[0].$numberDecimal
            )}
            </span>
          </div>`;
          }, 1000);

          Cookies.set("currency", Object.keys(data.data.data)[0]);
        }
        if (
          Cookies.get("currency") !== undefined &&
          Object.keys(data.data.data).length !== 0
        ) {
          setTimeout(() => {
            const balanceChange = document.getElementById("balanceChange");

            balanceChange.innerHTML = ` <div
            class=" rounded text-black cursor-pointer items-center flex gap-1 justify-between "
          >
          <img class="w-4 h-4" src=${currencyImage[Cookies.get("currency")]}>
         
            <span class="${Cookies.get("currency")}">

            ${formatAmount(
              Cookies.get("currency"),
              data.data.data[Cookies.get("currency")].$numberDecimal
            )}
            </span>
          </div>`;
          }, 100);
        }
      })
      .catch(() => {
        setBalances([]);
      });
  };

  const balanceBtm = () => {
    const btnModal = document.getElementById("btnm");
    btnModal.classList.toggle("hidden");
  };
  const formatAmount = (currency, amount) => {
    if (currency === "sol") {
      return parseFloat(amount).toFixed(8);
    }
    return parseFloat(amount).toFixed(2);
  };
  useEffect(() => {
    if (Cookies.get("token")) {
      getBalance();
    }
  }, []);
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          {Cookies.get("token") ? (
            <>
              <div className="dropdown">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost lg:hidden"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h8m-8 6h16"
                    />
                  </svg>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[200] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <a href="./deposit">Deposit</a>
                  </li>

                  <li>
                    <a href="./withdraw">Withdraw</a>
                  </li>
                  <li>
                    <a href="./game-history">Crash Logs</a>
                  </li>
                  <li>
                    <a href="./logout">Logout</a>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <></>
          )}
          <a href="./" className="btn btn-ghost text-xl">
            CrashFly <img src={fly} width="30" />
          </a>
        </div>
        {Cookies.get("token") ? (
          <>
            {" "}
            <div className="navbar-center hidden lg:flex">
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a href="./deposit">Deposit</a>
                </li>

                <li>
                  <a href="./withdraw">Withdraw</a>
                </li>
                <li>
                  <a href="./game-history">Crash Logs</a>
                </li>
                <li>
                  <a href="./logout">Logout</a>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="navbar-end">
          <div className="flex gap-3 mr-5">
            {Cookies.get("token") ? (
              <>
                {/* <div className="gap-5 hidden md:flex">
                  <a href="./withdraw" className="btn glass">
                    Withdraw
                  </a>
                  <a href="./deposit" className="btn glass">
                    Deposit
                  </a>
                </div> */}
                <div className="relative">
                  {balances.length === 0 ? (
                    <div className="badge bg-white">Balance: 00</div>
                  ) : (
                    <>
                      <div
                        onClick={balanceBtm}
                        className="badge cursor-pointer bg-white flex items-center"
                      >
                        <div id="balanceChange"> Balance: 00</div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m19.5 8.25-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </div>
                      <div
                        className="absolute max-w-max hidden space-y-3 z-[100] right-0 top-10 text-black rounded"
                        id="btnm"
                      >
                        {Object.entries(balances).map(([currency, amount]) => (
                          <div
                            className="cursor-pointer bg-white rounded hover:bg-blue-700"
                            onClick={() => getBalanceMethod(currency)}
                            key={currency}
                          >
                            <div className="flex items-center gap-1 p-2">
                              <img
                                className="w-6"
                                src={currencyImage[currency]}
                              />
                              <span className={`${currency} text-xs`}>
                                {formatAmount(currency, amount.$numberDecimal)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="./login" className="link link-hover">
                  Login
                </a>
                <a href="./register" className="link link-hover">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
