import React, { Suspense } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Box } from "@mui/material";
import { Route, Routes, useNavigate } from "react-router-dom";
import MiniDrawer, { MiniDrawerProp } from "./components/NavDrawer/NavDrawer";
import MyTimeline from "./components/MyTimeline/MyTimeline";
import Article from "./components/Article/Article";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";

function App() {
  const navigate = useNavigate();
  const links = {
    home: "/",
    about: "/about",
  };

  const getIcon = (name: string) => {
    switch (name) {
      case "home":
        return <HomeIcon />;
      case "about":
        return <InfoIcon />;
      default:
        return <DisabledByDefaultIcon />;
    }
  };
  const getLink = (path: string) => {
    return () => {
      navigate(path);
    };
  };
  const drawerProps: () => MiniDrawerProp = () => {
    const props: MiniDrawerProp = { items: {} };
    Object.entries(links).map(([name, path]) => {
      if (props.items)
        props.items[name] = {
          Icon: getIcon(name),
          onClick: getLink(path),
        };
    });
    return props;
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>

      <Box sx={{ display: "flex" }}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense fallback={<div className="container">Loading...</div>}>
            <Routes>
              <Route path="/" element={<MyTimeline />} />
              <Route path="/about" element={<Article />} />
              <Route path="*" element={<Article />} />
            </Routes>
          </Suspense>
        </Box>
      </Box>
    </div>
  );
}

export default App;
