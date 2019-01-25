import React, { Component } from "react";
import styles from "./App.module.css";

class App extends Component {
  state = {
    from: "",
    to: "",
    list: []
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.get("list");
    }
  }

  componentDidMount() {
    this.get("list");
  }

  get = key => {
    window.chrome.storage.sync.get([key], result => {
      if (!result || !result[key]) {
        return;
      }

      this.setState({ [key]: result[key] });
    });
  };

  set = (key, value) => {
    window.chrome.storage.sync.set({
      [key]: value
    });
  };

  handleInputChange = evt => {
    const node = evt.target;

    this.setState({ [node.name]: node.value });
  };

  add = () => {
    const { from, to, list } = this.state;

    list.push({ from, to });

    this.setState({ from: "", to: "" });
    this.set("list", list);
  };

  delete = index => {
    const { list } = this.state;

    return () => {
      list.splice(index, 1);

      this.set("list", list);
    };
  };

  render() {
    const { from, to, list } = this.state;

    return (
      <div className={styles.container}>
        <h1>Referer-Setter</h1>

        <input
          type="text"
          name="from"
          value={from}
          onChange={this.handleInputChange}
        />
        <span>　=>　</span>
        <input
          type="text"
          name="to"
          value={to}
          onChange={this.handleInputChange}
        />
        <span>　</span>
        <button onClick={this.add}>add</button>

        <div className={styles.content}>
          {list.map((item, index) => {
            return (
              <p key={index} className={styles.row}>
                {`${item.from} => ${item.to}`}
                <span>　</span>
                <button onClick={this.delete(index)}>remove</button>
              </p>
            );
          })}
        </div>
      </div>
    );
  }
}

export default App;
