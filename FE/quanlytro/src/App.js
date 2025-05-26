import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { side_nav } from "./navigation/data_link";
import StartPage from "./pages/StartPage";

function renderRoutes(routes) {
  return routes.map((route, index) => {
    if (route.children && route.children.length > 0) {
      return (
        <React.Fragment key={index}>
          <Route path={route.path} element={route.element} />
          {route.children.map((child, idx) => (
            <Route
              key={`${index}-${idx}`}
              path={child.path}
              element={child.element}
            />
          ))}
        </React.Fragment>
      );
    }
    return <Route key={index} path={route.path} element={route.element} />;
  });
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />}>
          {renderRoutes(side_nav)}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
