import React, { Suspense } from "react";
import { Box } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import MiniDrawer from "./components/NavDrawer/NavDrawer";
import Article from "./components/Article/Article";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import Home from "./pages/Home";

function App() {
  const navigate = useNavigate();
  const links = {
    home: "/",
    // about: "/about",
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "home":
        return HomeIcon;
      case "about":
        return InfoIcon;
      default:
        return DisabledByDefaultIcon;
    }
  };
  const getLink = (path: string) => {
    return () => {
      navigate(path);
    };
  };

  const Drawer = () => {
    const props: { [key: string]: any } = {};
    Object.entries(links).map(
      ([name, path]) =>
        (props[name] = { Icon: getIcon(name), onClick: getLink(path) })
    );
    return <MiniDrawer items={props} />;
  };
  return (
    <div className="App">
      <Box sx={{ display: "flex" }}>
        <Drawer />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense fallback={<div className="container">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/about" element={<Article />} /> */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </div>
  );
}

export default App;
