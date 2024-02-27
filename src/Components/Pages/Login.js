import axios from "axios";
import Cookies from "js-cookie";

const Login = () => {
  const login = () => {
    const inputs = document.querySelectorAll("input");
    const msgfire = document.getElementById("msgfire");
    msgfire.innerHTML = "";
    const userObject = {
      privateUsername: inputs[0].value,
      password: inputs[1].value,
    };

    if (inputs[1].value && inputs[0].value) {
      axios
        .post(`${process.env.REACT_APP_API_URL}login`, userObject)
        .then((data) => {
          if (data.status === 200) {
            const msg = document.createElement("div");
            msg.innerText = `Login success. Redirecting to game...`;
            msg.classList.add("text-green-300");
            msgfire.appendChild(msg);
            Cookies.set("token", data.data.data.token);
            setTimeout(() => {
              window.location.replace("./");
            }, 2000);
          } else {
            const msg = document.createElement("div");
            msg.innerText = `Something went wrong #${data.status}`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          }
        })
        .catch((error) => {
          if (error.response.status === 409) {
            const msg = document.createElement("div");
            msg.innerText = error.response.data.message;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          } else if (error.response.status === 422) {
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
      const msg = document.createElement("div");
      msg.innerText = `All fields required`;
      msg.classList.add("text-red-300");
      msgfire.appendChild(msg);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Login now!</h1>
            <p className="py-6">Enter the game</p>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <div className="card-body">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Private Username</span>
                </label>
                <input
                  type="text"
                  placeholder="username"
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input
                  type="password"
                  placeholder="password"
                  className="input input-bordered"
                  required
                />
                <label className="label">
                  <a
                    href="/password-recovery"
                    className="label-text-alt link link-hover"
                  >
                    Forgot password?
                  </a>
                </label>

                <label
                  id="msgfire"
                  className="label text-xs flex items-start"
                ></label>
              </div>
              <div className="form-control mt-6">
                <button onClick={login} className="btn btn-primary">
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
