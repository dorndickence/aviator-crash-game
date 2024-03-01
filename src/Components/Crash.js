import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
import CryptoJS from "crypto-js";
import fly from "../images/fly.png";
import blastImg from "../images/blast.png";
import clock from "../sounds/clock.mp3";
import Cookies from "js-cookie";
import crashSoundSrc from "../sounds/crashSound.mp3";
import crashedSoundSrc from "../sounds/crashedSound.mp3";
import AnimeLeft from "./AnimeLeft";
import AnimeBottom from "./AnimeBottom";
import bgsky from "../images/bgsky.jpg";
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

  let userInteraction = false;
  // const blastRef = useRef(null);

  // const callBlastFunction = (type) => {
  //   if (blastRef.current) {
  //     blastRef.current.animateNow(type);
  //   }
  // };

  useEffect(() => {
    document.body.addEventListener(
      "click",
      () => {
        userInteraction = true;
      },
      { once: true }
    );

    const animateBox = document.getElementById("animateBox");
    const animatePlane = document.getElementById("animatePlane");
    const counterBox = document.getElementById("counterBox");
    const bgsky = document.getElementById("bgsky");
    const blast = document.getElementById("blast");
    const svg = document.getElementById("svg");
    const line = document.getElementById("line");
    const clockSound = new Audio(clock);
    const crashSound = new Audio(crashSoundSrc);
    const crashedSound = new Audio(crashedSoundSrc);
    const crashedBox = document.getElementById("crashedBox");
    const placeBetBox = document.getElementById("placeBetBox");
    const connectionMsg = document.getElementById("connectionMsg");
    //in bet.js
    const betRow = document.getElementById("betRow");
    const totalWinnings = document.getElementById("totalWinnings");
    const totalPlayers = document.getElementById("totalPlayers");
    const totalBets = document.getElementById("totalBets");
    //in bet.js end
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

    const socketConnect = () => {
      let socketUrl = `ws://localhost:3001`;
      if (Cookies.get("socketuserId")) {
        socketUrl = `ws://localhost:3001?socketuserId=${Cookies.get(
          "socketuserId"
        )}`;
      }

      socket = new WebSocket(socketUrl);
      socket.onclose = () => {
        connectionMsg.innerText = "Connection lost";
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
          connectionMsg.innerText = "";
        }, 1000);

        socket.onmessage = function (event) {
          const socketData = decrypt(event.data);
          if (socketData.type === "crash") {
            counterBox.innerText = convert(socketData.crash) + "x";
            updateLine();

            if (!initGame && timer === "0") {
              line.setAttribute("x2", 0);
              line.setAttribute("y2", 0);
              clockSound.pause();
              clockSound.currentTime = 0;
              animateBox.classList.add("animate-plane");
              animateBox.style.animationPlayState = "running";
              animatePlane.classList.remove("hidden");
              counterBox.classList.remove("hidden");
              svg.classList.remove("hidden");
              styleButton("bet", "disable");
              console.log("hit init ", socketData.crash);
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
            styleButton("cashout", "disabled");

            setCrashed(socketData.crashed);
            animateBox.style.animationPlayState = "paused";
            animatePlane.classList.add("hidden");
            counterBox.classList.add("hidden");
            svg.classList.add("hidden");
            blast.classList.remove("hidden");
            crashedBox.classList.remove("hidden");
            setCrashNumber(convert(socketData.crash));
            console.log("hit crashed");
            styleButton("bet", "disable");
            styleButton("cashout", "disable");
            // callBlastFunction();
            animateBottomStop();
            initGame = false;

            if (userInteraction) {
              if (Cookies.get("sound")) {
                crashSound.pause();
                crashSound.currentTime = 0;
                crashedSound.play();
                setTimeout(() => {
                  clockSound.play();
                }, 2000);
              }
            }
          }

          if (socketData.type === "timer") {
            setTimer(socketData.timer);
            if (socketData.timer === 2) {
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
              placeBetBox.classList.add("hidden");

              styleButton("bet", "disable");
              if (userInteraction) {
                if (Cookies.get("sound")) {
                  setTimeout(() => {
                    crashSound.play();
                  }, 1000);
                }
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
            newbetRowTdForAmount.innerText = socketData.betData.amount;
            newbetRowTdForWin.innerText = socketData.betData.win;
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
                console.log("insert");
                break;
              }
            }

            if (!inserted) {
              console.log("append");
              betRow.appendChild(newBewRow);
            }

            totalPlayers.innerText = parseInt(totalPlayers.innerText) + 1;

            totalBets.innerText =
              parseInt(totalBets.innerText) +
              parseFloat(socketData.betData.amount);
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

            winElement.classList.add("text-green-300");
            winElement.childNodes[3].innerText = socketData.amount;
            winElement.childNodes[1].innerText = `${socketData.odds}x`;

            totalWinnings.innerText = parseFloat(
              parseFloat(totalWinnings.innerText) +
                parseFloat(socketData.amount)
            ).toFixed(2);
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

  const resetCrashTemporary = () => {
    // Emit a message to the server
    const message = "Hello, world!";
    // socket.emit("cashout", message);
    console.log("Message sentd:", message);
  };

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

            <div
              id="connectionMsg"
              className="absolute top-0 left-[50%] translate-x-[-50%]"
            >
              Connecting...
            </div>
            <div className="absolute z-40 right-12 bottom-12">
              <span id="counterBox" className="hidden text-4xl"></span>
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
                className="text-1xl  text-white md:text-2xl lg:text-4xl hidden"
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

            <div className="absolute z-50 right-12 bottom-12 text-2xl">
              {crashed && timer < 11 ? (
                <div className="countdown font-mono text-6xl">
                  <span style={{ "--value": timer }}></span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Crash;
