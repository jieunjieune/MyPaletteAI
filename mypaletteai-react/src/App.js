import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./layouts/Layout";
import Palettes from "./pages/function/Palettes";
import Make from "./pages/function/Make";
import Signup from "./pages/auth/Signup";

function App() {
  return (
    // <p>Hello! My Palette AI :-)</p>
    <BrowserRouter>
      <Routes>
        <Route pate="/" element={<Layout/>}>
          <Route index element={<Main />} />
          <Route path="/palettes" element={<Palettes />} />
          <Route path="/palette/make" element={<Make />} />
          <Route path="/auth/signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
