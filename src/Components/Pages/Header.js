import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState } from "react";
const Header = () => {
  const [balances, setBalances] = useState([]);
  const getBalanceMethod = (currency, amount) => {
    const btnModal = document.getElementById("btnm");
    btnModal.classList.toggle("hidden");
    Cookies.set("currency", currency);
    const balanceChange = document.getElementById("balanceChange");
    const amountx = parseFloat(amount.$numberDecimal).toFixed(8);
    balanceChange.innerHTML = ` <div
    class="bg-primary  cursor-pointer flex gap-2 justify-between "
  >
 
    <span class="${currency}">
      ${amountx}
    </span>
  </div>`;
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

            balanceChange.innerHTML = ` <div
            class="bg-primary  cursor-pointer flex gap-2 justify-between "
          >
         
            <span class="${Object.keys(data.data.data)[0]}">
              ${parseFloat(
                Object.values(data.data.data)[0].$numberDecimal
              ).toFixed(8)}
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
            class="bg-primary  cursor-pointer flex gap-2 justify-between "
          >
         
            <span class="${Cookies.get("currency")}">
              ${parseFloat(
                data.data.data[Cookies.get("currency")].$numberDecimal
              ).toFixed(8)}
            </span>
          </div>`;
          }, 1000);
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
  useEffect(() => {
    getBalance();
  }, []);
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
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
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">daisyUI</a>
        </div>
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
          </ul>
        </div>
        <div className="navbar-end">
          <div className="flex gap-5">
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
                    <div className="badge badge-primary">Balance: 00</div>
                  ) : (
                    <>
                      <div
                        onClick={balanceBtm}
                        className="badge cursor-pointer badge-primary flex items-center"
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
                        className="absolute hidden  z-[100] right-0 p-3 top-10 bg-primary text-black rounded"
                        id="btnm"
                      >
                        {Object.entries(balances).map(([currency, amount]) => (
                          <div
                            className="cursor-pointer hover:bg-blue-700 p-3 flex gap-2 justify-between "
                            onClick={() => getBalanceMethod(currency, amount)}
                            key={currency}
                          >
                            <span> {currency.toUpperCase()}: </span>
                            <span className={currency}>
                              {parseFloat(amount.$numberDecimal).toFixed(8)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <a href="./login" className="btn glass">
                  Login
                </a>
                <a href="./register" className="btn glass">
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
