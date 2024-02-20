import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
import { Decimal } from "decimal.js";
import CryptoJS from "crypto-js";
import fly from "../images/fly.png";
import Blast from "./Blast";
import clock from "../sounds/clock.mp3";
import Cookies from "js-cookie";
import crashSoundSrc from "../sounds/crashSound.mp3";
import crashedSoundSrc from "../sounds/crashedSound.mp3";

const Crash = () => {
  // const socket = io("ws://localhost:3001");
  const socket = new WebSocket("ws://localhost:3001");
  const [crashNumber, setCrashNumber] = useState("");
  // const [counter, setCounter] = useState("");
  const [crashed, setCrashed] = useState(true);
  const [timer, setTimer] = useState("0");
  let userInteraction = false;
  const blastRef = useRef(null);

  const callBlastFunction = (type) => {
    if (blastRef.current) {
      blastRef.current.animateNow(type);
    }
  };

  useEffect(() => {
    document.body.addEventListener(
      "click",
      () => {
        userInteraction = true;
      },
      { once: true }
    );

    const animatePlane = document.getElementById("animatePlane");
    const counterBox = document.getElementById("counterBox");
    const blast = document.getElementById("blast");
    const svg = document.getElementById("svg");
    const line = document.getElementById("line");
    const clockSound = document.getElementById("clockSound");
    const crashSound = document.getElementById("crashSound");
    const crashedSound = document.getElementById("crashedSound");
    const crashedBox = document.getElementById("crashedBox");
    function updateLine() {
      const rect = animatePlane.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - svgRect.left;
      const y = rect.top + rect.height / 2 - svgRect.top;
      // line.setAttribute("x1", "0");
      // line.setAttribute("y1", "100%");
      line.setAttribute("x2", x);
      line.setAttribute("y2", y);

      //blast follow the plane too
      blast.style.left = x - 50 + "px";
      blast.style.top = y - 50 + "px";
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

          console.log("hit init ", socketData.crash);
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
        blast.classList.remove("hidden");
        crashedBox.classList.remove("hidden");
        setCrashNumber(convert(socketData.crash));
        console.log("hit crashed");
        callBlastFunction();
        initGame = false;
        if (userInteraction) {
          if (Cookies.get("sound")) {
            crashSound.pause();
            crashSound.currentTime = 0;
            crashedSound.play();
            setTimeout(() => {
              clockSound.play();
            }, 3000);
          }
        }
      }

      if (socketData.type === "timer") {
        setTimer(socketData.timer);
        if (socketData.timer === 2) {
          blast.classList.add("hidden");
          crashedBox.classList.add("hidden");
          callBlastFunction("reset");
        }

        if (socketData.timer === 10) {
          if (userInteraction) {
            if (Cookies.get("sound")) {
              setTimeout(() => {
                crashSound.play();
              }, 3000);
            }
          }
        }
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
      <div className="border-2 w-full h-[200px] md:h-[300px] relative">
        <div>
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
          </div>

          <div id="animatePlane" className="absolute z-10 hidden max-w-[100px]">
            <img className="w-100%" src={fly} />
          </div>
          <div id="blast" className="h-[50px] w-[50px] relative hidden">
            <Blast ref={blastRef} />
          </div>
          <svg
            id="svg"
            className="absolute z-4 hidden bottom-0 left-0 w-full h-[100%]"
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
      <div>
        <audio id="clockSound" src={clock} type="audio/mp3"></audio>
        <audio id="crashSound" src={crashSoundSrc} type="audio/mp3"></audio>
        <audio id="crashedSound" src={crashedSoundSrc} type="audio/mp3"></audio>
      </div>
    </>
  );
};

export default Crash;
