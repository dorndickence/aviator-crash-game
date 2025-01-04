import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Header from "./Components/Pages/Header";
import Footer from "./Components/Pages/Footer";
import Login from "./Components/Pages/Login";
import Register from "./Components/Pages/Register";
import Cookies from "js-cookie";
import Deposit from "./Components/Pages/Deposit";
import Withdraw from "./Components/Pages/Withdraw";
import GameHistory from "./Components/Pages/GameHistory";
import Logout from "./Components/Pages/Logout";
import Logout2 from "./Components/Pages/Logout2";
import Contact from "./Components/Pages/Contact";
import Password from "./Components/Pages/Password";
import Table from "./Components/Pages/Table";

function App() {
  const currentPath = window.location.pathname;

  const play = currentPath.split("/");

  if (play[1] === "play") {
    Cookies.set("partner", play[2]);
    window.location.replace("../");
    return;
  }

  return (
    <BrowserRouter>
      <GameHistory/>
      {currentPath !== "/logout" && <Header />}
      <Routes>
        <Route index element={<Home />} />
        {Cookies.get("token") ? (
          <>
            <Route path="logout" element={<Logout />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="game-history" element={<GameHistory />} />
          </>
        ) : (
          <>
            <Route path="logout" element={<Logout2 />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="password-recovery" element={<Password />} />
          </>
        )}
        <Route path="contact" element={<Contact />} />
        <Route path="table" element={<Table />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
      {currentPath !== "/logout" && <Footer />}
    </BrowserRouter>
  );
}

export default App;
