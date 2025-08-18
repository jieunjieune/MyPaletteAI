import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Layout from "./layouts/Layout";

function App() {
  return (
    // <p>Hello! My Palette AI :-)</p>
    <BrowserRouter>
      <Routes>
        <Route pate="/" element={<Layout/>}>
          <Route index element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
