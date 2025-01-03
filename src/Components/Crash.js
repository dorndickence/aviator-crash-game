import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
import CryptoJS from "crypto-js";
import fly from "../images/fly.png";
import blastImg from "../images/blast.png";

import Cookies from "js-cookie";
import crashSoundSrc from "../sounds/crashSound.mp3";
import crashedSoundSrc from "../sounds/crashedSound.mp3";
import clock from "../sounds/clock.mp3";
import AnimeLeft from "./AnimeLeft";
import AnimeBottom from "./AnimeBottom";
import bgsky from "../images/bgsky.jpg";
import usdttrc20 from "../images/usdttrc20.svg";
import trx from "../images/trx.svg";
import dai from "../images/dai.svg";
import sol from "../images/sol.svg";
import bdt from "../images/bdt2.png";

const Crash = ({
  crashNumber,
  setCrashNumber,
  crashed,
  setCrashed,
  setAlert,
  timer,
  setTimer,
  setBets,
  setWinnings,
  setPlayers,
  styleButton,
}) => {
  // const socket = io("ws://localhost:3001");
  let socket, socketInterval;

  // const [counter, setCounter] = useState("");

  //animation
  const currencyImage = {
    usdttrc20: usdttrc20,
    sol: sol,
    dai: dai,
    trx: trx,
    bdt: bdt,
  };

  const sortTable = (columnIndex) => {
    const table = document.getElementById("myTable");
    const tbody = table.querySelector("tbody");
    const rows = Array.from(tbody.getElementsByTagName("tr"));
    const isNumeric = !isNaN(
      parseFloat(rows[0].getElementsByTagName("td")[columnIndex].innerText)
    );

    rows.sort((a, b) => {
      const aValue = isNumeric
        ? parseFloat(a.getElementsByTagName("td")[columnIndex].innerText)
        : a.getElementsByTagName("td")[columnIndex].innerText.toLowerCase();
      const bValue = isNumeric
        ? parseFloat(b.getElementsByTagName("td")[columnIndex].innerText)
        : b.getElementsByTagName("td")[columnIndex].innerText.toLowerCase();
      return aValue > bValue ? 1 : -1;
    });

    tbody.innerHTML = "";
    rows.forEach((row) => tbody.appendChild(row));
  };

  const animateBottom = () => {
    const aniteBot = document.querySelectorAll(".animated-divs-2 div");
    aniteBot.forEach((abite) => {
      abite.style.animation = "moveLeft 1s linear infinite";
    });

    const aniteBot2 = document.querySelectorAll(".animated-divs div");
    aniteBot2.forEach((abite) => {
      abite.style.animation = "moveDown 1s linear infinite";
    });

    // moveLeft 1s linear infinite
  };
  const animateBottomStop = () => {
    const aniteBot = document.querySelectorAll(".animated-divs-2 div");
    aniteBot.forEach((abite) => {
      abite.style.animation = "none";
    });

    const aniteBot2 = document.querySelectorAll(".animated-divs div");
    aniteBot2.forEach((abite) => {
      abite.style.animation = "none";
    });

    // moveLeft 1s linear infinite
  };
  //animation end

  //let userInteraction = false;
  const [userInteraction, setUserInteraction] = useState(false);
  // const blastRef = useRef(null);

  // const callBlastFunction = (type) => {
  //   if (blastRef.current) {
  //     blastRef.current.animateNow(type);
  //   }
  // };

  /*useEffect(() => {
    document.body.addEventListener(
      "click",
      () => {
        userInteraction = true;
      },
      { once: true }
    );
*/
  useEffect(() => {
    const handleUserInteraction = () => {
      setUserInteraction(true);
      document.body.removeEventListener("click", handleUserInteraction);
    };

    document.body.addEventListener("click", handleUserInteraction, { once: true });



    const animateBox = document.getElementById("animateBox");
    const animatePlane = document.getElementById("animatePlane");
    const counterBox = document.getElementById("counterBox");
    const bgsky = document.getElementById("bgsky");
    const blast = document.getElementById("blast");
    const svg = document.getElementById("svg");
    const line = document.getElementById("line");

    const crashedBox = document.getElementById("crashedBox");
    const placeBetBox = document.getElementById("placeBetBox");
    const connectionMsg = document.getElementById("connectionMsg");
    const clockTimer = document.getElementById("clockTimer");
    //in bet.js
    const betRow = document.getElementById("betRow");
    const totalWinnings = document.getElementById("totalWinnings");
    const totalPlayers = document.getElementById("totalPlayers");
    const totalBets = document.getElementById("totalBets");
    //in bet.js end

    const clockSound = new Audio(clock);
    const crashSound = new Audio(crashSoundSrc);
    const crashedSound = new Audio(crashedSoundSrc);

    function updateLine() {
      const rect = animateBox.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - svgRect.left;
      const y = rect.top + rect.height / 2 - svgRect.top;
      // line.setAttribute("x1", "0");
      // line.setAttribute("y1", "100%");
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);

      //blast follow the plane too
      // blast.style.left = x - 50 + "px";
      // blast.style.top = y - 50 + "px";
    }
    let initGame = false;
    // Subscribe to the 'crash' event

    let setGameInterval, setClockInterval;

    const gameRunner = (interval = 120, starting = 1.0, clear = false) => {
      if (clear) {
        clearInterval(setGameInterval);
      } else {
        counterBox.innerText = starting + "x";
        clearInterval(setGameInterval);
        // console.log(interval);
        setGameInterval = setInterval(() => {
          const insert = convert(parseFloat(counterBox.innerText) + 0.01);
          counterBox.innerText = insert + "x";
          updateLine();
        }, interval);
      }
    };

    const clockRunner = (interval = 50, starting = 0, clear = false) => {
      if (clear) {
        clearInterval(setClockInterval);
        clockTimer.innerText = "0.00";
      } else {
        // console.log(interval);
        if (starting < 11) {
          clearInterval(setClockInterval);
          clockTimer.innerText = parseFloat(starting).toFixed(2);
          setClockInterval = setInterval(() => {
            clockTimer.innerText = (
              parseFloat(clockTimer.innerText) + 0.01
            ).toFixed(2);
          }, interval);
        }
      }
    };

    const socketConnect = () => {
      let socketUrl = process.env.REACT_APP_SOCKET;
      if (Cookies.get("socketuserId")) {
        socketUrl = `${process.env.REACT_APP_SOCKET}?socketuserId=${Cookies.get(
          "socketuserId"
        )}`;
      }

      socket = new WebSocket(socketUrl);

      socket.onclose = () => {
        connectionMsg.innerText = "Connection lost";
        connectionMsg.classList.remove("hidden");
        // socketInterval = setInterval(socketConnect, 5000);

        crashSound.pause();
        crashSound.currentTime = 0;
        crashedSound.pause();
        crashedSound.currentTime = 0;
        clockSound.pause();
        clockSound.currentTime = 0;
        animatePlane.classList.add("hidden");
        blast.classList.add("hidden");
        initGame = false;
      };
      socket.onopen = () => {
        // clearInterval(socketInterval);

        setTimeout(() => {
          connectionMsg.classList.add("hidden");
        }, 1000);

        socket.onmessage = function (event) {
          connectionMsg.classList.add("hidden");
          const socketData = decrypt(event.data);
          if (socketData.type === "crash") {
            // console.log("coming", socketData.speed);
            gameRunner(socketData.speed, socketData.crash);

            if (!initGame && timer === "0") {
              clockTimer.classList.add("hidden");
              line.setAttribute("x2", 0);
              line.setAttribute("y2", 0);
              clockSound.pause();
              clockSound.currentTime = 0;
              animateBox.classList.add("animate-plane");
              placeBetBox.classList.add("hidden");
              animateBox.style.animationPlayState = "running";
              animatePlane.classList.remove("hidden");
              counterBox.classList.remove("hidden");
              svg.classList.remove("hidden");
              styleButton("bet", "disable");
              // console.log("hit init ", socketData.crash);

              bgsky.classList.add("bgskyAnimate");
              animateBottom();
              setAlert(false);
              setCrashed(false);
              initGame = true;

              if (socketData.crash > 1.3) {
                animateBox.style.animationDuration = "3s";
              }
              if (socketData.crash < 1.3) {
                animateBox.style.animationDuration = "10s";
              }
            }
          }

          if (socketData.type === "crashed") {
            gameRunner(200, 1.0, true);
            styleButton("cashout", "disabled");

            setCrashed(socketData.crashed);
            animateBox.style.animationPlayState = "paused";
            animatePlane.classList.add("hidden");
            counterBox.classList.add("hidden");
            svg.classList.add("hidden");
            blast.classList.remove("hidden");
            crashedBox.classList.remove("hidden");
            betRow.classList.add("bg-rose-900", "text-white", "border-red-500");
            setCrashNumber(convert(socketData.crash));
            // console.log("hit crashed");
            styleButton("bet", "disable");
            styleButton("cashout", "disable");
            // callBlastFunction();
            animateBottomStop();
            initGame = false;

            /*
              if (userInteraction) {
              if (Cookies.get("sound")) {
                crashSound.pause();
                crashSound.currentTime = 0;
                crashedSound.play().catch(err => {
              console.error("Playback failed:", err);
            });
                setTimeout(() => {
                  clockSound.play();
                }, 2000);
              } else {
                if (crashSound.currentTime > 0) {
                  crashSound.pause();
                  crashSound.currentTime = 0;
                }
                if (clockSound.currentTime > 0) {
                  clockSound.pause();
                  clockSound.currentTime = 0;
                }
                if (crashedSound.currentTime > 0) {
                  crashedSound.pause();
                  crashedSound.currentTime = 0;
                }
              }
            }
            clockTimer.classList.remove("hidden");
          }
*/

      if (userInteraction) {
    if (Cookies.get("sound")) {
      // Stop and reset sounds before playing new ones
      if (crashSound.currentTime > 0) {
        crashSound.pause();
        crashSound.currentTime = 0;
      }
      if (crashedSound.currentTime > 0) {
        crashedSound.pause();
        crashedSound.currentTime = 0;
      }
      crashedSound.play().catch(err => {
        console.error("Playback failed:", err);
      });
      setTimeout(() => {
        clockSound.play().catch(err => {
          console.error("Playback failed:", err);
        });
      }, 2000);
    }
  }
}


          if (socketData.type === "timer") {
            setTimer(socketData.timer);
            clockRunner(7, socketData.timer, false);
            // setTimer(socketData.timer);
            if (socketData.timer === 2) {
              betRow.classList.remove(
                "bg-rose-900",
                "text-white",
                "border-red-500"
              );
              blast.classList.add("hidden");
              animateBox.classList.remove("animate-plane");
              crashedBox.classList.add("hidden");
              bgsky.classList.remove("bgskyAnimate");
              placeBetBox.classList.remove("hidden");
              // callBlastFunction("reset");
              setAlert(false);
              betRow.innerHTML = "";
              setWinnings(0);
              setBets(0);
              setPlayers(0);
              totalPlayers.innerText = 0;
              totalWinnings.innerText = 0;
              totalBets.innerText = 0;
              styleButton("bet", "active");
            }

            if (socketData.timer === 10) {
              clockRunner(600, socketData.timer, true);
              placeBetBox.classList.add("hidden");

              styleButton("bet", "disable");
              /*if (userInteraction) {
                if (Cookies.get("sound")) {
                  setTimeout(() => {
                    crashSound.play();
                  }, 1000);
                } else {
                  if (crashSound.currentTime > 0) {
                    crashSound.pause();
                    crashSound.currentTime = 0;
                  }
                  if (clockSound.currentTime > 0) {
                    clockSound.pause();
                    clockSound.currentTime = 0;
                  }
                  if (crashedSound.currentTime > 0) {
                    crashedSound.pause();
                    crashedSound.currentTime = 0;
                  }
                }
              }
            }
          }
*/        
          if (userInteraction) {
    if (Cookies.get("sound")) {
      // Stop and reset the crash sound before playing it again
      if (crashSound.currentTime > 0) {
        crashSound.pause();
        crashSound.currentTime = 0;
      }
      // Manage the clock sound
      if (clockSound.currentTime > 0) {
        clockSound.pause();
        clockSound.currentTime = 0;
      }
      clockSound.play().catch(err => {
        console.error("Playback failed:", err);
      });
    }
  }
}
          if (socketData.type === "betData") {
            const newBewRow = document.createElement("tr");

            newBewRow.classList.add(`bet${socketData.betData._id}`);
            const newbetRowTdForUsername = document.createElement("td");
            const newbetRowTdForWin = document.createElement("td");
            const newbetRowTdForOdds = document.createElement("td");
            const newbetRowTdForAmount = document.createElement("td");
            newbetRowTdForAmount.innerHTML = `<div class="flex gap-1 items-center justify-center">${
              socketData.betData.amount
            } <img class="w-3"  src=${
              currencyImage[socketData.betData.currency]
            }></div>`;
            newbetRowTdForWin.innerHTML = `<div class="flex gap-1 items-center justify-center">${
              socketData.betData.win
            } <img class="w-3"  src=${
              currencyImage[socketData.betData.currency]
            }></div>`;
            newbetRowTdForOdds.innerText = `x${socketData.betData.odds}`;
            newbetRowTdForUsername.innerText =
              socketData.betData.publicUsername;
            newBewRow.appendChild(newbetRowTdForUsername);
            newBewRow.appendChild(newbetRowTdForOdds);
            newBewRow.appendChild(newbetRowTdForAmount);
            newBewRow.appendChild(newbetRowTdForWin);

            // setBetData(socketData.betData);

            let inserted = false;

            for (let i = 0; i < betRow.childNodes.length; i++) {
              if (
                parseFloat(betRow.childNodes[i].childNodes[2].innerText) <
                  parseFloat(socketData.betData.amount) &&
                !inserted
              ) {
                betRow.insertBefore(newBewRow, betRow.childNodes[i]);
                inserted = true;
                // console.log("insert");
                break;
              }
            }

            if (!inserted) {
              // console.log("append");
              betRow.appendChild(newBewRow);
            }

            totalPlayers.innerText = parseInt(totalPlayers.innerText) + 3;

            totalBets.innerText =
              parseInt(totalBets.innerText) +
              parseFloat(socketData.betData.amountInUSD);
          }

          if (socketData.type === "notifyBetPlaced") {
            if (Cookies.get("token")) {
              if (socketData.betData.token === Cookies.get("token")) {
                setTimeout(() => {
                  styleButton("cashout", "active");
                }, socketData.betData.timeout);
              }
            }
          }

          if (socketData.type === "winData") {
            const winElement = document.querySelector(`.bet${socketData._id}`);
            if (winElement) {
              winElement.classList.add(
                "text-white",
                "bg-green-900",
                "border-green-500"
              );
              winElement.childNodes[3].innerHTML = `<div class="flex gap-1 items-center justify-center">${
                socketData.amount
              } <img class="w-3"  src=${
                currencyImage[socketData.currency]
              }></div>`;
              winElement.childNodes[1].innerText = `${socketData.odds}x`;

              totalWinnings.innerText = parseFloat(
                parseFloat(totalWinnings.innerText) +
                  parseFloat(socketData.amountInUSD)
              ).toFixed(2);
            }
          }

          if (socketData.type === "notifyBetWon") {
            if (Cookies.get("token")) {
              if (socketData.token === Cookies.get("token")) {
                styleButton("cashout", "disabled");
              }
            }
          }

          if (socketData.type === "socketuserId") {
            Cookies.set("socketuserId", socketData.data);
          }
        };
      };
    };
    socketConnect();

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        socketConnect();
      }
    });

    return () => {
      // Close WebSocket connection
      socket.close();
    };
  }, []); // Run this effect only once on component mount

  // const resetCrashTemporary = () => {
  //   // Emit a message to the server
  //   const message = "Hello, world!";
  //   // socket.emit("cashout", message);
  //   console.log("Message sentd:", message);
  // };

  const decrypt = (object) => {
    const encryptedData = object;
    const key = "secret key";
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedData, key);
    const decryptedString = decryptedBytes.toString(CryptoJS.enc.Utf8);
    const decryptedObj = JSON.parse(decryptedString);
    return decryptedObj;
  };

  const convert = (numberAsString) => {
    return parseFloat(numberAsString).toFixed(2);
  };

  //   return socket;
  return (
    <>
      <div className="container ">
        <div
          id="connectionMsg"
          className="absolute text-3xl flex pt-48 justify-center z-[60] bg-black w-full h-full"
        >
          Connecting...
        </div>
        <div className="absolute w-[fit-content] h-[200px]">
          <AnimeLeft />
          <AnimeBottom />
        </div>
        <div className="h-[200px] relative ml-[10px] overflow-hidden">
          <div className="w-full h-full  ">
            <div className=" ">
              <div id="bgsky" className="absolute bgsky">
                <img className="w-full h-full" src={bgsky} />
              </div>
            </div>

            <div className="absolute z-40 right-12 bottom-12">
              <span id="counterBox" className="hidden text-4xl">
                1.00x
              </span>
            </div>
            <div className="absolute z-20 left-[50%] bottom-[50%] translate-x-[-50%] translate-y-[-50%]">
              <span
                id="crashedBox"
                className="text-1xl md:text-2xl lg:text-4xl hidden"
              >
                Crashed {crashNumber}x
              </span>
              <span
                id="placeBetBox"
                className="text-1xl  text-white md:text-2xl lg:text-4xl"
              >
                Place Your Bet
              </span>
            </div>

            <div id="animateBox" className="absolute z-10">
              <div
                id="animatePlane"
                className="hidden h-[50px] w-[50px] max-w-[100px]"
              >
                <img className="w-[100%]" src={fly} />
              </div>
              <div id="blast" className="hidden">
                <img className="w-24" src={blastImg} />
              </div>
            </div>
            <svg
              id="svg"
              className="absolute z-4 hidden bottom-0 left-0 w-full h-[100%]"
            >
              <line
                id="line"
                className="stroke-2 stroke-yellow-500"
                x1="0"
                y1="105%"
                x2="0"
                y2="0"
              ></line>
            </svg>

            <div
              id="clockTimer"
              className="absolute z-50 right-12 bottom-12 text-3xl"
            >
              0.00
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crash;
