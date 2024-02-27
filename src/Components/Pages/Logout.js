import Cookies from "js-cookie";
import { useEffect } from "react";

const Logout = () => {
  useEffect(() => {
    Cookies.remove("token");
    Cookies.remove("currency");
  }, []);
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Logged Out</h1>
            <p className="py-6">Logout Successfull</p>
            <a href="./login" className="btn btn-primary">
              Return to login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
