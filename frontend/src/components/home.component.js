import axios from "axios";
import React, { Component } from "react";

import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default class HomeComponent extends Component {
  constructor(props) {
    super(props);

    this.onChangeAmount = this.onChangeAmount.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangeamountToBeTranferred =
      this.onChangeamountToBeTranferred.bind(this);
    this.onTransferMoney = this.onTransferMoney.bind(this);
    this.onAddMoney = this.onAddMoney.bind(this);
    this.onChangeComment = this.onChangeComment.bind(this);
    this.onChangeTransferComment = this.onChangeTransferComment.bind(this);

    this.state = {
      currentUser: "",
      amount: 0,
      username: "",
      users: [],
      comment: "",
      balance: 0,
      amountToBeTranferred: 0,
      transferComment: "",
    };
  }

  componentDidMount() {
    axios.get("http://localhost:5000/checkAlive").then((res) => {
      if (res.data.response === "LoggedOut") {
        window.location = "/login";
      } else if (res.data.response === "LoggedIn") {
        this.setState({
          currentUser: res.data.user,
        });
      }
    });
    axios.get("http://localhost:5000/getUsers").then((res) => {
      let bal_arr = res.data.filter(
        (item) => item.name === this.state.currentUser
      );

      this.setState({
        balance: bal_arr[0].balance,
      });

      res.data = res.data.filter(
        (item) => item.name !== this.state.currentUser
      );

      console.log(res.data);

      this.setState({
        users: res.data,
        username: res.data[0].name,
      });
    });
  }

  onChangeAmount(e) {
    this.setState({
      amount: e.target.value,
    });
  }

  onChangeComment(e) {
    this.setState({
      comment: e.target.value,
    });
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value,
    });
  }

  onChangeamountToBeTranferred(e) {
    this.setState({
      amountToBeTranferred: e.target.value,
    });
  }

  onChangeTransferComment(e) {
    this.setState({
      transferComment: e.target.value,
    });
  }

  onAddMoney(e) {
    e.preventDefault();
    const data = {
      amount: this.state.amount,
      comment: this.state.comment,
    };
    console.log(data);

    axios.post("http://localhost:5000/addMoney", data).then((res) => {
      if (res.data.response === "Please enter amount greater than 0") {
        toast(res.data.response);
      } else {
        toast(res.data.response);
        setTimeout(function () {
          window.location.reload(true);
        }, 2000);

        this.setState({
          amount: 0,
        });
      }
    });
  }

  onTransferMoney(e) {
    e.preventDefault();
    const data = {
      to: this.state.username,
      amount: this.state.amountToBeTranferred,
      comment: this.state.transferComment,
    };
    console.log(data);
    axios.post("http://localhost:5000/transferMoney", data).then((res) => {
      if (res.data.response === "Please enter amount greater than 0") {
        toast(res.data.response);
      } else if (res.data.response === "Insufficient Balance!") {
        toast(res.data.response);
      } else {
        toast(res.data.response);
        setTimeout(function () {
          window.location.reload(true);
        }, 2000);
      }
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#home">Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav className="me-auto">
                <Nav.Link href="/transactions">Transactions</Nav.Link>
              </Nav>
            </Navbar.Collapse>

            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Navbar.Text>Balance: {this.state.balance}</Navbar.Text>
            </Navbar.Collapse>
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Navbar.Text>
                Signed in as: {this.state.currentUser}
                <br />
                <a href="/logout">Logout</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <h3>Add Money</h3>

        <form onSubmit={this.onAddMoney}>
          <FloatingLabel
            controlId="floatingInput"
            label="Amount"
            className="mb-3"
          >
            <Form.Control
              type="number"
              required
              value={this.state.amount}
              onChange={this.onChangeAmount}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Comment"
            className="mb-3"
          >
            <Form.Control
              type="text"
              required
              value={this.state.comment}
              onChange={this.onChangeComment}
            />
          </FloatingLabel>

          <Button type="submit" variant="primary">
            Add Money
          </Button>
        </form>
        <ToastContainer />
        <br />
        <hr />
        <br />
        <h3>Transfer Money</h3>
        <form onSubmit={this.onTransferMoney}>
          <FloatingLabel
            controlId="floatingInput"
            label="Select the User"
            className="mb-3"
          >
            <Form.Select
              required
              value={this.state.username}
              onChange={this.onChangeUsername}
              aria-label="Default select example"
            >
              {this.state.users.map(function (user) {
                return (
                  <option key={user.name} value={user.name}>
                    {user.name}
                  </option>
                );
              })}
            </Form.Select>
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Amount to be Transferred"
            className="mb-3"
          >
            <Form.Control
              type="number"
              required
              value={this.state.amountToBeTranferred}
              onChange={this.onChangeamountToBeTranferred}
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Comment"
            className="mb-3"
          >
            <Form.Control
              type="text"
              required
              value={this.state.transferComment}
              onChange={this.onChangeTransferComment}
            />
          </FloatingLabel>

          <div className="form-group">
            <input
              type="submit"
              required
              className="btn btn-primary"
              value="Transfer Money"
            />
          </div>
        </form>
      </div>
    );
  }
}
