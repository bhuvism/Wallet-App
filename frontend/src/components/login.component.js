import axios from "axios";
import React, { Component } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

export default class LoginComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMobile = this.onChangeMobile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.changeShowPassword = this.changeShowPassword.bind(this);

    this.state = {
      name: "",
      mobile: 0,
      password: "",
      showPassword: false,
    };
  }

  componentDidMount() {
    axios.get("http://localhost:5000/checkAlive").then((res) => {
      if (res.data.response === "LoggedIn") {
        window.location = "/home";
      }
    });
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value,
    });
  }

  onChangeMobile(e) {
    this.setState({
      mobile: e.target.value,
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value,
    });
  }

  changeShowPassword() {
    if (this.state.showPassword) {
      this.setState({
        showPassword: false,
      });
    } else {
      this.setState({
        showPassword: true,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const user = {
      name: this.state.name,
      mobile: this.state.mobile,
      password: this.state.password,
    };
    console.log(user);
    axios.post("http://localhost:5000/login", user).then((res) => {
      if (res.data.response === "Verified") {
        toast("Login Successful");
        window.location = "/home";
      } else {
        toast("Please enter correct details!");
      }
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#">Login</Navbar.Brand>

            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Don't have an account?: <a href="/">Register</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Name: </label>
            <input
              type="text"
              required
              className="form-control"
              value={this.state.name}
              onChange={this.onChangeName}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Password: </label>
            <input
              type={this.state.showPassword ? "text" : "password"}
              required
              value={this.state.password}
              className="form-control"
              onChange={this.onChangePassword}
            />
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                onClick={this.changeShowPassword}
                label="Show Password"
              />
            </Form.Group>
          </div>
          <br />
          <div className="form-group">
            <input
              type="submit"
              required
              className="btn btn-primary"
              value="Login"
            />
          </div>
        </form>
        <ToastContainer />
      </div>
    );
  }
}
