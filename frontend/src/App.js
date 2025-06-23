import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import AdminRoutes from "./routes/AdminRoutes";
import { side_nav } from "./routes/data_link";

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AdminLayout />}>
          {/* render side_nav routes */}
          {renderRoutes(side_nav)}

          {/* render thêm AdminRoutes nếu cần */}
          <Route path="*" element={<AdminRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
