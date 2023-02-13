import React, { Component } from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

const strongRegex = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
);

export default class RegisterComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeMobile = this.onChangeMobile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.changeShowPassword = this.changeShowPassword.bind(this);

    this.state = {
      name: "",
      mobile: 0,
      password: "",
      confirmPassword: "",
      setErrorMessage: "",
      showPassword: false,
    };
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
    var pass = e.target.value;

    var test = strongRegex.test(pass);
    if (test) {
      this.setState({
        password: pass,
      });
      console.log(this.state.password);
    } else {
      this.setState({
        setErrorMessage: "Pleas check the password",
      });
      console.log(!!this.state.password);
    }
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value,
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
    if (!this.state.password) {
      toast("Please check the Password Criteria");
    } else if (this.state.password !== this.state.confirmPassword) {
      toast("Passwords does not match!");
    } else {
      const user = {
        name: this.state.name,
        mobile: this.state.mobile,
        password: this.state.password,
      };
      console.log(user);

      axios.post("http://localhost:5000/register", user).then((res) => {
        toast("Registered Successfully");
        this.setState({
          name: "",
          mobile: 0,
          password: "",
          confirmPassword: "",
        });
      });
    }
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#">Register</Navbar.Brand>

            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Already Registered?: <a href="/login">Login</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <ToastContainer />
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
            <label>Mobile: </label>
            <input
              type="number"
              required
              className="form-control"
              value={this.state.mobile}
              onChange={this.onChangeMobile}
            />
          </div>
          <br />
          <div className="form-group">
            <label>Password: </label>
            <input
              type={this.state.showPassword ? "text" : "password"}
              required
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
            <p>
              <b>
                {" "}
                Note: Password must contain atleast a Uppercase, a LowerCase, a
                Special Character,a Number and minimum length is 8
              </b>
            </p>
          </div>
          <br />
          <div className="form-group">
            <label>Confirm Password: </label>
            <input
              type="password"
              required
              className="form-control"
              value={this.state.confirmPassword}
              onChange={this.onChangeConfirmPassword}
            />
          </div>
          <br />
          <div className="form-group">
            <input
              type="submit"
              required
              className="btn btn-primary"
              value="Register"
            />
          </div>
        </form>
      </div>
    );
  }
}
