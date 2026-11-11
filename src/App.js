import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import SellFlow from "@/pages/SellFlow";
import BuyFlow from "@/pages/BuyFlow";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sell" element={<SellFlow />} />
          <Route path="/buy" element={<BuyFlow />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
