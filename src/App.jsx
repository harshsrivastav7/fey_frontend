import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "./homepage";
import CrmDashboard from "./CrmDashboard";
import LeadPage from "./LeadPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/CrmDashboard" element={<CrmDashboard />} />
        <Route path="/LeadPage" element={<LeadPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;