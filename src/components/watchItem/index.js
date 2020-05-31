import { h, Component } from 'preact';

export default class WatchItem extends Component {
  state = {
    initializing: true,
    lastResult: null,
    lastChecked: null,
    changed: false, 
    pageData: null,
    error: null,
    timer: null,
  };

  componentDidMount() {
    // start a timer for the clock:
    this.timer = setInterval(() => {
      // TODO: do an initial request initializing (set pageData)
      // TODO: otherwise look for changed, set status
      // TODO: add clear changed status button (resets to initalizing)
      this.setState({
        lastChecked: Date.now()
      });
    }, this.props.checkInterval || 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
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

  markSeen = () => {
    this.setState({
      initializing: true,
      pageData: null,
      changed: false,
    });
  }

  render() {
    return (
      <tr>
        <td>{ this.props.ix }</td>
        <td>{ this.props.url }</td>
        <td>{ this.getChecks() }</td>
        <td>{ this.getStatus() }</td>
        <td>{ this.getLastChecked() }</td>
        <td><button onClick={this.markSeen}>Mark seen</button></td>
      </tr>
    );
  }
}

