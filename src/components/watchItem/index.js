import { h, Component } from 'preact';
import axios from 'axios';

import style from './style';

const API_HOST = "http://localhost:3000";

export default class WatchItem extends Component {
  state = {
    initializing: true,
    lastResult: null,
    lastChecked: null,
    changed: false, 
    changedAt: null,
    pageData: null,
    error: null,
    timer: null,
  };

  checkPage() {
    const data = {
      url: this.props.url,
      checks: this.props.checks,
    };
    if (this.state.initializing) {
      data.isInit = true;
    }
    if (this.state.pageData) {
      data.pageData = this.state.pageData;
    }
    axios.post(`${API_HOST}/check-page`, data)
      .then((response) => {
        const nextState = {
          error: response.data.error || null,
          lastResult: response.data.result,
          lastChecked: Date.now(),
          initializing: false,
        };
        if (!this.state.pageData) {
          console.log("Setting page data");
          nextState.pageData = response.data.pageData;
        }
        if (response.data.changed && !this.state.changed) {
          console.log("Setting changed!");
          nextState.changed = true;
          nextState.changedAt = Date.now();
        }
        this.setState(nextState);
      })
      .catch((error) => {
        this.setState({
          lastResult: "failure",
          changed: false,
          error: error.message,
        });
      })
      .finally(() => {
        this.scheduleCheck();
      });
  }

  scheduleCheck() {
    // start a timer for the clock:
    this.timer = setTimeout(() => {
      // TODO: do an initial request initializing (set pageData)
      // TODO: otherwise look for changed, set status
      // TODO: add clear changed status button (resets to initalizing)
      this.checkPage();
    }, this.props.checkInterval * 1000 || 30000);
  }

  componentDidMount() {
    this.checkPage();
    this.scheduleCheck();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  getChecks() {
    return this.props.checks.map((c) => {
      if (c == "strictEq") {
        return "exact HTML";
      }
      return c;
    }).join(", ");
  }

  getStatus() {
    if (this.state.initializing) {
      return 'getting reference page...';
    }
    if (this.state.lastResult === "failure") {
      return `${this.state.lastResult}: ${this.state.error}`;
    }
    return this.state.lastResult;
  }

  getLastChecked() {
    if (!this.state.lastChecked) {
      return 'Never';
    }
    return new Date(this.state.lastChecked).toLocaleString();
  }

  getChanged() {
    if (!this.state.changed || !this.state.changedAt) {
      return 'no';
    }
    const changeTime = new Date(this.state.changedAt).toLocaleString()
    return `changed at ${changeTime}`;
  }

  markSeen = () => {
    this.setState({
      initializing: true,
      pageData: null,
      changed: false,
      changedAt: null,
      lastResult: null,
      lastChecked: null,
      error: null,
    });
  }

  render() {
    return (
      <tr class={style.watchItem}>
        <td class={style.url}>{ this.props.url }</td>
        <td class={style.checks}>{ this.getChecks() }</td>
        <td class={style.changed} style={{"background-color": this.state.changed ? 'yellow' : 'white'}}>{ this.getChanged() }</td>
        <td class={style.status}>{ this.getStatus() }</td>
        <td class={style.lastChecked}>{ this.getLastChecked() }</td>
        <td class={style.markSeen}>
          <button onClick={this.markSeen}>Reset</button>
          <button onClick={this.props.removeWatch.bind(this, this.props.ix)}>Delete</button>
        </td>
      </tr>
    );
  }
}

