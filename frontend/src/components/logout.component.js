import axios from "axios";
import { Component } from "react";

export default class LogOut extends Component {
  componentDidMount() {
    axios.get("http://localhost:5000/logout").then((res) => {
      console.log(res.data);
      if (res.data.response === "LoggedOut") {
        window.location = "/login";
      }
    });
  }
  render() {
    return;
  }
}
