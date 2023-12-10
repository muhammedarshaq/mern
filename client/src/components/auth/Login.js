import React, { Fragment, useState } from "react";
import { Link } from "react-router-dom";

export const Login = () => {
  // Using the hook to take form data as an object
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Accessing form data parameters
  const { email, password } = formData;

  // Function for take inputs
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Function for submit the form
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Successfully Logged!");
  };
  return (
    <Fragment>
      <section className="container">
        {/* <div className="alert alert-danger">Invalid credentials</div> */}
        <h1 className="large text-primary">Sign In</h1>
        <p className="lead">
          <i className="fas fa-user"></i> Sign into Your Account
        </p>
        <form className="form" onSubmit={(e) => onSubmit(e)}>
          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              value={email}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={(e) => onChange(e)}
              required
            />
          </div>
          <input type="submit" className="btn btn-primary" value="Login" />
        </form>
        <p className="my-1">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </section>
      a
    </Fragment>
  );
};
