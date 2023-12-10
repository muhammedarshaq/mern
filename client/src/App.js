import React, { Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Landing } from "./components/layout/Landing";
import { Login } from "./components/auth/Login";
import { Register } from "./components/auth/Register";
import "./App.css";

const App = () => (
  <Router>
    <Fragment>
      <Navbar />
      <Routes>
        <Route exact path="/" Component={Landing} />
        <Route exact path="/register" Component={Register} />
        <Route exact path="/login" Component={Login} />
      </Routes>
    </Fragment>
  </Router>
);
export default App;
