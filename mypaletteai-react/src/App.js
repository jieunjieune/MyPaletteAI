import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./layouts/Layout";
import Palettes from "./pages/function/Palettes";
import Make from "./pages/function/Make";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import PaletteDetail from "./pages/function/PaletteDetail";
import MyPalette from "./pages/function/MyPalette";
import ResetPasswordRequest from "./pages/auth/ResetPasswordRequest";

function App() {
  return (
    // <p>Hello! My Palette AI :-)</p>
    <BrowserRouter>
      <Routes>
        <Route pate="/" element={<Layout/>}>
          <Route index element={<Main />} />
          <Route path="/palettes" element={<Palettes />} />
          <Route path="/palettes/my/:id" element={<MyPalette />} />
          <Route path="/palettes/:id" element={<PaletteDetail />} />
          <Route path="/palette/make" element={<Make />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/reset-password-request" element={<ResetPasswordRequest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
