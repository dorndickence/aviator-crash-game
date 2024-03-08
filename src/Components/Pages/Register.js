import axios from "axios";
import Cookies from "js-cookie";
const Register = () => {
  //validation method
  const validation = async (inputs, msgfire) => {
    let empty = 0;
    await inputs.forEach((input) => {
      if (!input.value && input.placeholder !== "Promo Code") {
        const msg = document.createElement("div");
        msg.innerText = `${input.placeholder} is required`;
        msg.classList.add("text-red-300");
        msgfire.appendChild(msg);
        empty++;
      } else {
        if (input.placeholder.toLowerCase() === "email") {
          if (!input.value.includes("@") || !input.value.includes(".")) {
            const msg = document.createElement("div");
            msg.innerText = `${input.placeholder} is not a valid email address`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
            empty++;
          }
        }

        if (input.placeholder.toLowerCase() === "private username") {
          if (input.value.includes(" ")) {
            const msg = document.createElement("div");
            msg.innerText = `${input.placeholder} should not have space`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
            empty++;
          }
        }

        if (input.placeholder.toLowerCase() === "password") {
          if (input.value.length < 8) {
            const msg = document.createElement("div");
            msg.innerText = `${input.placeholder} must be 8 characters`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
            empty++;
          }
        }
      }
    });
    return empty;
  };

  const register = async () => {
    const inputs = document.querySelectorAll("input");
    const msgfire = document.getElementById("msgfire");
    msgfire.innerHTML = "";
    const promoObject = {
      code: inputs[4].value,
      type: "promo",
    };

    if (Cookies.get("partner")) {
      promoObject.code = Cookies.get("partner");
      promoObject.type = "partnerId";
    }

    const userData = {
      publicUsername: inputs[0].value,
      privateUsername: inputs[1].value,
      email: inputs[2].value,
      password: inputs[3].value,
      promo: promoObject,
    };

    const erorrs = await validation(inputs, msgfire);
    if (erorrs === 0) {
      // Hero goes connection with backend

      axios
        .post(`${process.env.REACT_APP_API_URL}register`, userData)
        .then((data) => {
          if (data.status === 200) {
            const msg = document.createElement("div");
            msg.innerText = `Account created successfully. Login & Enjoy :)`;
            msg.classList.add("text-green-300");
            msgfire.appendChild(msg);
            setTimeout(() => {
              window.location.replace("./login");
            }, 5000);
          } else {
            const msg = document.createElement("div");
            msg.innerText = `Something went wrong #${data.status}`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          }
        })
        .catch((error) => {
          if (error.response.status === 422) {
            const msg = document.createElement("div");
            msg.innerText = `All fields are required`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          } else if (error.response.status === 409) {
            const msg = document.createElement("div");
            msg.innerText = error.response.data.message;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          } else {
            const msg = document.createElement("div");
            msg.innerText = `Uncaught error #${error.response.status}`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          }
        });
    } else {
      //if any unknown errors happens during validation
      const msg = document.createElement("div");
      msg.innerText = `Please check all the fields and try agan`;
      msg.classList.add("text-red-300");
      msgfire.appendChild(msg);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Register now!</h1>
            <p className="py-6">Create your new account and enjoy the game</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Public username*
                    <span className="text-xs">
                      (In game live stats will show)
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Public username"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Private username*
                    <span className="text-xs">
                      (Used to login into account)
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="Private username"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email*</span>
                </label>
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password*</span>
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  className="input input-bordered"
                  required
                />
              </div>
              {!Cookies.get("partner") ? (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Promo</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Promo Code"
                    className="input input-bordered"
                  />
                </div>
              ) : (
                <></>
              )}
              <label
                id="msgfire"
                className="label text-xs flex items-start flex-col"
              ></label>
              <div className="form-control mt-6">
                <button onClick={register} className="btn btn-primary">
                  Register
                </button>
              </div>

              <label className="label text-xs">
                <div
                  tabIndex={0}
                  className="collapse collapse-arrow border border-base-300 bg-base-200"
                >
                  <div className="collapse-title font-medium">
                    🔒 Protect Your Privacy: Keep Your Account Information
                    Confidential Your privacy and security matter to us.
                  </div>
                  <div className="collapse-content">
                    <p>
                      Please remember to keep your account information private
                      and secure. This includes your Private username,
                      password,email, and any personal data associated with your
                      account. Sharing your account details can lead to
                      unauthorized access and potential misuse of your
                      information. Help us maintain a safe and secure
                      environment by safeguarding your account information at
                      all times. Thank you for your cooperation in keeping our
                      platform secure.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
