import React, { Component } from "react";
import axios from "axios";

class App extends Component {
  // Test proxy between sever and client specified in package.json
  componentDidMount() {
    axios.get("/api/projects").then(response => {
      console.log(response);
    });
  }
  render() {
    return (
      <div className="App">
        <h1>App.js file</h1>
      </div>
    );
  }
}

export default App;
