import axios from "axios";
import usdttrc20 from "../../images/usdttrc20.svg";
import trx from "../../images/trx.svg";
import dai from "../../images/dai.svg";
import sol from "../../images/sol.svg";
import bdt from "../../images/bdt.png";
import { useState } from "react";
import Cookies from "js-cookie";
import DepositHistory from "./DepositHistory";
const Deposit = () => {
  // axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  const [coinIndex, setCoinIndex] = useState(0);
  const [depositId, setDepositId] = useState("");

  const copy = (e) => {
    const addressBox = document.getElementById("addressBox");

    if (navigator.clipboard.writeText(addressBox.childNodes[0].innerText)) {
      addressBox.childNodes[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 text-green-400">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
    </svg>
    `;
      setTimeout(() => {
        addressBox.childNodes[1].innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
    </svg>
    `;
      }, 5000);
    }
  };

  const coins = [
    {
      name: "USDT",
      symbol: "usdttrc20",
      image: usdttrc20,
      fullName: "Tether USD (Tron)",
      network: "TRX",
      colorName: "red",
      payNetwork: "Trc20",
    },
    {
      name: "TRX",
      symbol: "trx",
      image: trx,
      fullName: "Tron",
      network: "TRX",
      colorName: "red",
      payNetwork: "Trc20",
    },
    {
      name: "DAI",
      symbol: "dai",
      image: dai,
      fullName: "DAI",
      network: "ETH",
      colorName: "blue",
      payNetwork: "Erc20",
    },
    {
      name: "SOL",
      symbol: "sol",
      image: sol,
      fullName: "SOLANA",
      network: "SOLANA",
      colorName: "blueviolet",
      payNetwork: "SOLANA",
    },
  ];

  const deposit = (network, coinIndex) => {
    const button = document.getElementById(`b${coinIndex}`);
    const buttonWait = document.getElementById(`w${coinIndex}`);

    button.classList.add("hidden");
    buttonWait.classList.remove("hidden");
    setCoinIndex(coinIndex);

    axios
      .post(`${process.env.REACT_APP_API_URL}deposit`, {
        token: Cookies.get("token"),
        coin: network,
      })
      .then((data) => {
        setDepositId(data.data.depositId);
        document.getElementById("my_modal_1").showModal();
        document.getElementById("address").innerText = data.data.data;
        document.getElementById("minimumDeposit").innerText = data.data.minimum;
        setTimeout(() => {
          button.classList.remove("hidden");
          buttonWait.classList.add("hidden");
        }, 300);
      })
      .catch((error) => {
        document.getElementById("errorSG").classList.remove("hidden");
        setTimeout(() => {
          document.getElementById("errorSG").classList.add("hidden");
        }, 5000);
        document.getElementById("errorSG").childNodes[0].innerText =
          error.response.data.message;
        setTimeout(() => {
          button.classList.remove("hidden");
          buttonWait.classList.add("hidden");
        }, 300);
      });
  };

  return (
    <>
      <div className="min-h-[70vh] my-12">
        <div className="flex flex-col mx-5 md:flex-row justify-around gap-12 flex-wrap">
          {coins.map((coin, index) => {
            return (
              <div key={index} className="min-w-[200px]">
                <div
                  id={`w${index}`}
                  className="hidden p-3 gap-3 border border-blue-200 bg-slate-700 rounded-lg flex items-center"
                >
                  <div>
                    <img src={coin.image} className="w-12" />
                  </div>
                  Please Wait
                </div>
                <div
                  id={`b${index}`}
                  className="flex mx-auto p-3 gap-3 border border-blue-200 rounded-lg cursor-pointer hover:bg-zinc-700"
                  onClick={() => deposit(coin.symbol, index)}
                >
                  <div>
                    <img src={coin.image} className="w-12" />
                  </div>
                  <div>
                    <div className="text-white flex gap-1 items-center">
                      <h2 className="text-base"> {coin.name}</h2>
                      <p
                        className={`text-xs px-2 rounded-sm`}
                        style={{ backgroundColor: coin.colorName }}
                      >
                        {coin.network}
                      </p>
                    </div>
                    <p>{coin.fullName}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* BDT */}
          <div className="min-w-[200px]">
            <div
              className="flex mx-auto p-3 gap-3 border border-blue-200 rounded-lg cursor-pointer hover:bg-zinc-700"
              onClick={() =>
                (window.location.href = "https://t.me/crashflybdt")
              }
            >
              <div>
                <img src={bdt} className="w-44" />
              </div>
              <div>
                <div className="text-white flex gap-1 items-center">
                  <h2 className="text-base"> BDT </h2>
                  <p className={`text-xs px-2 rounded-sm bg-sky-600`}>
                    Telegram
                  </p>
                </div>
                <p>@crashflybdt</p>
              </div>
            </div>
          </div>

          {/* BDT END */}
        </div>
        {/* Open the modal using document.getElementById('ID').showModal() method */}

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <div className="flex justify-between">
              <div className="text-white flex gap-1 items-center">
                <h2 className="text-base"> {coins[coinIndex].name}</h2>
                <p
                  style={{ backgroundColor: coins[coinIndex].colorName }}
                  className={`text-xs px-2 rounded-sm`}
                >
                  {coins[coinIndex].network}
                </p>
              </div>
              <div className="modal-action">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn glass">Close</button>
                </form>
              </div>
            </div>
            <div id="deposistForm">
              <p className="py-4 text-sm text-rose-300">
                Select network{" "}
                <span className="text-red-400 font-bold">
                  {coins[coinIndex].payNetwork.toUpperCase()}
                </span>
                . Sending to other network may result in loss
              </p>
              <p>
                Minimum: <span id="minimumDeposit">1</span>
              </p>

              <div className="space-y-6">
                <div
                  id="addressBox"
                  className="flex justify-center"
                  onClick={copy}
                >
                  <p
                    id="address"
                    className="overflow-ellipsis overflow-hidden  mr-2 text-xs sm:text-base"
                  ></p>
                  <p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                      />
                    </svg>
                  </p>
                </div>
                <img
                  className="mx-auto"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${coins[coinIndex].name}`}
                />
              </div>

              <div className="py-6">
                <p className="py-4 text-sm text-rose-300">
                  <span className="font-bold text-rose-500">
                    Warning for multiple deposit:{" "}
                  </span>
                  Please refrain from sending multiple deposits to the same
                  address. Our system processes only one deposit per account
                  address. Once your deposit is completed, a new address will be
                  generated for any subsequent deposits. Sending multiple
                  deposits to the same address may result in loss.
                </p>
                <p className="py-4 text-sm text-green-300">
                  <span className="font-bold  text-green-500">
                    Hint for multiple deposit:{" "}
                  </span>
                  Please make your deposit once and wait for it to reflect in
                  your account balance before depositing again. Once the deposit
                  has been processed, you can revisit this page to make another
                  deposit. Thank you for your cooperation.
                </p>
              </div>
            </div>
            <div id="succcess" className="hidden">
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-32 h-32 text-green-400 mx-auto"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <div className="text-center">
                Withdraw request sent. Please wait for the payout to be proceed.
                Payout processing average time 1 hour and maximum 24 hours.
              </div>
            </div>
          </div>
        </dialog>
        <div
          id="errorSG"
          className="hidden z-50 toast toast-center toast-middle"
        >
          <div className="alert alert-error">
            <span>deposit unavailable.</span>
          </div>
        </div>
        <div>
          <DepositHistory />
        </div>
      </div>
    </>
  );
};

export default Deposit;
