import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import Home from "./pages/home";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/politica-de-privacidade"
          element={<PoliticaDePrivacidade />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
