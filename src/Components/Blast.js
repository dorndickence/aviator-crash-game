import { useImperativeHandle, forwardRef } from "react";
import "../css/blast.css";
const Blast = forwardRef((props, ref) => {
  const animateNow = (type) => {
    const flames = document.querySelectorAll(".flame");
    if (type === "reset") {
      for (let index = 0; index < flames.length; index++) {
        // console.log(index);
        const flame = flames[index];

        flame.style.left = 0;
        flame.style.top = 0;
        // flame.style.opacity = 1;
      }
    } else {
      for (let index = 0; index < flames.length; index++) {
        // console.log(index);
        const flame = flames[index];

        const randomNumberTop = Math.round(Math.random() * 100);
        const randomNumberLeft = Math.round(Math.random() * 100);
        flame.style.top = randomNumberTop + "%";
        flame.style.left = randomNumberLeft + "%";
        // flame.style.opacity = 0;
      }
    }
  };
  useImperativeHandle(ref, () => ({
    animateNow,
  }));

  return (
    <>
      <div className="flame"></div>
      <div className="flame"></div>
      <div className="flame"></div>
      <div className="flame"></div>
      <div className="flame"></div>
      <div className="flame"></div>
      <div className="flame"></div>
      <div className="flame"></div>
    </>
  );
});

export default Blast;
