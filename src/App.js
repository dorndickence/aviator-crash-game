import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home";
import Header from "./Components/Pages/Header";
import Blast from "./Components/Blast";
import Footer from "./Components/Pages/Footer";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="blast" element={<Blast />} />
        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
