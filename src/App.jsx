import { Route, Routes } from "react-router-dom"
import Nav from "./components/Nav"
import Home from "./pages/Home"
import Work from "./pages/Work"
import FocusUpCaseStudy from "./pages/FocusUpCaseStudy"
import StudentBudgetingCaseStudy from "./pages/StudentBudgetingCaseStudy"
import BcoCaseStudy from "./pages/BcoCaseStudy"
import SiteSignalCaseStudy from "./pages/SiteSignalCaseStudy"
import OrderGuardCaseStudy from "./pages/OrderGuardCaseStudy"

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/bco" element={<BcoCaseStudy />} />
        <Route path="/work/focusup" element={<FocusUpCaseStudy />} />
        <Route path="/work/sitesignal" element={<SiteSignalCaseStudy />} />
        <Route path="/work/orderguard" element={<OrderGuardCaseStudy />} />
        <Route path="/work/student-budgeting" element={<StudentBudgetingCaseStudy />} />
        <Route path="/work/:id" element={<Work />} />
      </Routes>
    </>
  )
}
