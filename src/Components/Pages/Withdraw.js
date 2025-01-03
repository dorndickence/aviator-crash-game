import axios from "axios";
import usdttrc20 from "../../images/usdttrc20.svg";
import trx from "../../images/trx.svg";
import dai from "../../images/dai.svg";
import sol from "../../images/sol.svg";
import bdt from "../../images/bdt.png";
import mpesa from "../../images/mpesa.svg";
import { useState } from "react";
import Cookies from "js-cookie";
import WithdrawHistory from "./WithdrawHistory";
import Mpesatransaction from './Mpesatransaction';
const Withdraw = () => {
  // axios(config)
  //   .then(function (response) {
  //     console.log(JSON.stringify(response.data));
  //   })
  //   .catch(function (error) {
  //     console.log(error);
  //   });
  const [coinIndex, setCoinIndex] = useState(0);
  const [showMpesatransaction, setShowMpesatransaction] = useState(false); // Added state
  const coins = [
    
    {
      name: "M-PESA", // Add M-PESA entry
      symbol: "mpesa",
      image: mpesa, // Ensure you have an appropriate image
      fullName: "Lipa na M-PESA",
      network: "M-PESA",
      colorName: "green",
      payNetwork: "M-PESA",
    },
    
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

  const withdrawModal = (coinIndex) => {
    document.getElementById("my_modal_1").showModal();
    setCoinIndex(coinIndex);
  };

const handleWithdraw = (index) => {
    setCoinIndex(index);
    setShowMpesatransaction(true); // Show M-PESA transaction component
  };
  
  const withdraw = () => {
    const amount = document.getElementById("amount");
    const account = document.getElementById("account");
    const withdrawForm = document.getElementById("withdrawForm");
    const success = document.getElementById("success");
    axios
      .post(`${process.env.REACT_APP_API_URL}withdraw`, {
        token: Cookies.get("token"),
        amount: amount.value,
        account: account.value,
        coin: coins[coinIndex].symbol,
      })
      .then((data) => {
        success.classList.remove("hidden");
        withdrawForm.classList.add("hidden");
      })
      .catch((error) => {
        document.getElementById("closeM").click();

        document.getElementById("errorSG2").classList.remove("hidden");

        setTimeout(() => {
          document.getElementById("errorSG2").classList.add("hidden");
        }, 5000);

        document.getElementById(
          "errorSG2"
        ).childNodes[0].childNodes[0].innerText = error.response.data.message;
      });
  };

  return (
    <>
    
     <div className="min-h-[70vh] my-12">
        <div className="flex flex-col mx-5 md:flex-row justify-around gap-12 flex-wrap">
          {coins.map((coin, index) => (
            <div key={index} className="min-w-[200px]">
              <div
                className="flex mx-auto p-3 gap-3 border border-blue-200 rounded-lg cursor-pointer hover:bg-zinc-700"
                onClick={() => handleWithdraw(index)}
              >
                <div>
                  <img src={coin.image} className="w-12" alt={coin.name} />
                </div>
                <div>
                  <h2 className="text-base">{coin.name}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>

   
        {showMpesatransaction && (
          <Mpesatransaction 
            onClose={() => setShowMpesatransaction(false)} 
            transactionType="withdraw" 
            coin={coins[coinIndex]} 
          />
        )}
      </div>
      
      <div className="min-h-[70vh] my-12">
        <div className="flex flex-col mx-5 md:flex-row justify-around gap-12 flex-wrap">
          {coins.map((coin, index) => {
            return (
              <div key={index} className="min-w-[200px]">
                <div
                  id={`b${index}`}
                  className="flex mx-auto p-3 gap-3 border border-blue-200 rounded-lg cursor-pointer hover:bg-zinc-700"
                  onClick={() => withdrawModal(index)}
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
            <div className="flex justify-between py-5">
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
                  <button id="closeM" className="btn glass">
                    Close
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-3" id="withdrawForm">
              <p className="py-4 text-sm text-rose-300">
                Make sure your address network is{" "}
                <span className="text-red-400 font-bold">
                  {coins[coinIndex].payNetwork.toUpperCase()}
                </span>
                . Sending other network address may result in loss
              </p>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-bold"> Amount:</span>
                <input
                  id="amount"
                  type="number"
                  className="grow"
                  placeholder="0 - 10000"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-bold">Payout:</span>
                <input
                  type="text"
                  className="grow"
                  id="account"
                  placeholder={`${coins[coinIndex].name} account address`}
                />
              </label>

              <button onClick={withdraw} className="btn btn-primary w-full">
                Request
              </button>
            </div>
            <div id="success" className="hidden">
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
          id="errorSG2"
          className="hidden z-50 toast toast-center toast-middle"
        >
          <div className="alert alert-error">
            <span>Withdraw temporary unavailable.</span>
          </div>
        </div>
        <WithdrawHistory />
      </div>
    </>
  );
};

export default Withdraw;
