import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
import { Decimal } from "decimal.js";
import CryptoJS from "crypto-js";
import fly from "../images/fly.png";

const Crash = () => {
  // const socket = io("ws://localhost:3001");
  const socket = new WebSocket("ws://localhost:3001");
  // const [crashNumber, setCrashNumber] = useState("");
  // const [counter, setCounter] = useState("");
  const [crashed, setCrashed] = useState(true);
  const [timer, setTimer] = useState("0");

  useEffect(() => {
    const animatePlane = document.getElementById("animatePlane");
    const counterBox = document.getElementById("counterBox");
    const svg = document.getElementById("svg");
    const line = document.getElementById("line");
    function updateLine() {
      const rect = animatePlane.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - svgRect.left;
      const y = rect.top + rect.height / 2 - svgRect.top;
      // line.setAttribute("x1", "0");
      // line.setAttribute("y1", "100%");
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);
    }
    let initGame = false;
    // Subscribe to the 'crash' event

    socket.onmessage = function (event) {
      const socketData = decrypt(event.data);
      if (socketData.type === "crash") {
        counterBox.innerText = convert(socketData.crash) + "x";
        updateLine();

        if (!initGame && timer === "0") {
          animatePlane.classList.add("animate-plane");
          animatePlane.classList.remove("hidden");
          counterBox.classList.remove("hidden");
          svg.classList.remove("hidden");
          console.log("hit", socketData.crash);
          setCrashed(false);
          initGame = true;
          if (socketData.crash > 1.3) {
            animatePlane.style.animationDuration = "3s";
          }
        }
      }

      if (socketData.type === "crashed") {
        setCrashed(socketData.crashed);
        animatePlane.classList.remove("animate-plane");
        animatePlane.classList.add("hidden");
        counterBox.classList.add("hidden");
        svg.classList.add("hidden");
        initGame = false;
      }

      if (socketData.type === "timer") {
        setTimer(socketData.timer);
      }
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
      <div className="border-2 min-w-[500px] w-full h-[300px] relative">
        <div>
          <div className="absolute z-40 top-[40%] left-[40%]">
            <span id="counterBox" className="hidden text-4xl"></span>
          </div>

          <div id="animatePlane" className="absolute z-10 hidden max-w-[100px]">
            <img className="w-100% animate-bounce" src={fly} />
          </div>
          <svg
            id="svg"
            className="absolute z-4 hidden bottom-0 left-0 w-full h-[300px]"
          >
            <line
              id="line"
              className="stroke-2 stroke-cyan-500"
              x1="0"
              y1="100%"
              x2="0"
              y2="0"
            ></line>
          </svg>

          <div className="absolute z-50 right-12 bottom-12 text-2xl">
            {crashed ? (
              <div className="countdown font-mono text-6xl">
                <span style={{ "--value": timer }}></span>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Crash;
