import { BrowserRouter, Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/home";
import PoliticaDePrivacidade from "./pages/PoliticaDePrivacidade";
import ProblemReportPage from "./pages/ProblemReportPage";
import ContactPage from "./pages/Contact";
import Introducao from "./pages/Introduction";
import IntroctionPage from "./pages/Introduction";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/politica-de-privacidade"
          element={<PoliticaDePrivacidade />}
        />
        <Route path="reportar-problema" element={<ProblemReportPage />} />
        <Route path="contato" element={<ContactPage />} />
        <Route path="introducao" element={<IntroctionPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
