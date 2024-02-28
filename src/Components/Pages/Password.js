import axios from "axios";

const Password = () => {
  const password = () => {
    const inputs = document.querySelectorAll("input");
    const msgfire = document.getElementById("msgfire");
    msgfire.innerHTML = "Please wait...";
    const userObject = {
      privateUsername: inputs[0].value,
    };

    if (inputs[0].value) {
      axios
        .post(`${process.env.REACT_APP_API_URL}password`, userObject)
        .then((data) => {
          msgfire.innerHTML = "";
          if (data.status === 200) {
            const msg = document.createElement("div");
            msg.innerText = `Passsword has been sent to your email`;
            msg.classList.add("text-green-300");
            msgfire.appendChild(msg);
            setTimeout(() => {
              window.location.replace("./login");
            }, 2000);
          } else {
            const msg = document.createElement("div");
            msg.innerText = `Something went wrong #${data.status}`;
            msg.classList.add("text-red-300");
            msgfire.appendChild(msg);
          }
        })
        .catch((error) => {
          msgfire.innerHTML = "";
          const msg = document.createElement("div");
          msg.innerText = error.response.data.message;
          msg.classList.add("text-red-300");
          msgfire.appendChild(msg);
        });
    } else {
      const msg = document.createElement("div");
      msg.innerText = `Please enter private username`;
      msg.classList.add("text-red-300");
      msgfire.appendChild(msg);
    }
  };

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Forgot your password?</h1>
            <p className="py-6">Enter the private username to unlock</p>
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

                <label
                  id="msgfire"
                  className="label text-xs flex items-start"
                ></label>
              </div>

              <div className="form-control mt-6">
                <button onClick={password} className="btn btn-primary">
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
