import { h, Component } from 'preact';

export default class WatchItem extends Component {
  state = {
    initializing: true,
    lastResult: null,
    lastChecked: null,
    changed: false, 
    pageData: null,
    error: null,
  };

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
      return 'initializing...';
    }
    if (this.state.lastResult === "failure") {
      return `${this.state.lastResult}: ${this.state.error}`;
    }
    return this.state.lastResult;
  }

  render() {
    return (
      <tr>
        <td>{ this.props.ix }</td>
        <td>{ this.props.url }</td>
        <td>{ this.getChecks() }</td>
        <td>{ this.getStatus() }</td>
        <td>{ this.state.lastChecked || 'Never' }</td>
      </tr>
    );
  }
}

