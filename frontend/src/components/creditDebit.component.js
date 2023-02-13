import axios from "axios";
import React, { Component } from "react";

import Table from "react-bootstrap/Table";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

export default class CreditDebit extends Component {
  constructor(props) {
    super(props);

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
    this.onChangeFromDate = this.onChangeFromDate.bind(this);
    this.onChangeToDate = this.onChangeToDate.bind(this);

    this.state = {
      currentUser: "",
      transactions: [],
      finalArr: [],
      from_date: new Date(new Date().toDateString()),
      to_date: new Date(new Date().toDateString()),
      type: "All",
      types: [],
    };
  }

  componentDidMount() {
    this.setState({
      types: ["All", "Credit", "Debit"],
    });
    axios.get("http://localhost:5000/checkAlive").then((res) => {
      if (res.data.response === "LoggedOut") {
        window.location = "/login";
      } else if (res.data.response === "LoggedIn") {
        this.setState({
          currentUser: res.data.user,
        });
        axios.get("http://localhost:5000/transactions").then((res) => {
          console.log(res.data);

          this.setState({
            transactions: res.data,
            finalArr: res.data,
          });
        });
      }
    });
  }

  onChangeFromDate(e) {
    this.setState({
      from_date: new Date(new Date(e.target.value).toDateString()),
    });
  }

  onChangeToDate(e) {
    this.setState({
      to_date: new Date(new Date(e.target.value).toDateString()),
    });
  }

  onChangeType(e) {
    this.setState({
      type: e.target.value,
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    console.log(this.state.from_date, this.state.to_date);

    let arr = this.state.transactions.filter((item) => {
      if (this.state.type === "Credit") {
        let newDate = new Date(new Date(item.DateTime).toDateString());
        console.log(
          "new Date => " + newDate,
          this.state.from_date,
          this.state.to_date
        );
        console.log(newDate.getTime(), this.state.from_date.getTime());
        return (
          item.to_user === this.state.currentUser &&
          newDate.getTime() >= this.state.from_date.getTime() &&
          newDate.getTime() <= this.state.to_date.getTime()
        );
      } else if (this.state.type === "Debit") {
        let newDate = new Date(new Date(item.DateTime).toDateString());
        return (
          item.from_user === this.state.currentUser &&
          item.to_user !== this.state.currentUser &&
          newDate.getTime() >= this.state.from_date.getTime() &&
          newDate.getTime() <= this.state.to_date.getTime()
        );
      } else {
        let newDate = new Date(new Date(item.DateTime).toDateString());
        return (
          newDate.getTime() >= this.state.from_date.getTime() &&
          newDate.getTime() <= this.state.to_date.getTime()
        );
      }
    });

    console.log(arr);

    this.setState({
      finalArr: arr,
    });
  }

  render() {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="#">Transactions</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/home">Home</Nav.Link>
            </Nav>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as: {this.state.currentUser}
                <br />
                <a href="/logout">Logout</a>
              </Navbar.Text>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <br />
        <Form onSubmit={this.onFormSubmit}>
          <Row>
            <Col>
              <Form.Control type="date" onChange={this.onChangeFromDate} />
            </Col>
            <Col>
              <Form.Control type="date" onChange={this.onChangeToDate} />
            </Col>
            <Col>
              <Form.Select
                defaultValue="Choose..."
                onChange={this.onChangeType}
              >
                {this.state.types.map((type) => {
                  return <option key={type}>{type}</option>;
                })}
              </Form.Select>
            </Col>
            <Col>
              <input
                type="submit"
                required
                className="btn btn-primary"
                value="Filter"
              />
            </Col>
          </Row>
        </Form>
        <br />
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
              <th>Comment</th>
              <th>Type</th>
              <th>Date-Time</th>
            </tr>
          </thead>
          <tbody>
            {this.state.finalArr.map((transac) => {
              return (
                <tr>
                  <td>{transac.from_user}</td>
                  <td>{transac.to_user}</td>
                  <td>{transac.amount}</td>
                  <td>{transac.comment}</td>
                  <td>
                    {transac.from_user === this.state.currentUser &&
                    transac.to_user !== this.state.currentUser ? (
                      <div>Debit</div>
                    ) : transac.from_user === this.state.currentUser &&
                      transac.to_user === this.state.currentUser ? (
                      <div>Cr to your own ACC</div>
                    ) : (
                      <div>Credit</div>
                    )}
                  </td>
                  <td>
                    {new Date(transac.DateTime).getDate() +
                      "-" +
                      (new Date(transac.DateTime).getMonth() + 1) +
                      "-" +
                      new Date(transac.DateTime).getFullYear() +
                      " " +
                      new Date(transac.DateTime).getHours() +
                      ":" +
                      new Date(transac.DateTime).getMinutes()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
