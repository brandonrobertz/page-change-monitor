import { h, Component } from 'preact';

import Header from './header';
import AddWatch from './addWatch';
import WatchItem from './watchItem';

import style from './style';

export default class App extends Component {
  state = {
    watchPages: [],
    time: Date.now(),
    checkInterval: 300,
    newUrl: '',
    newCheckExact: false,
    newCheckCSSShow: false,
    newCheckSelector: '',
  };

  // update the current time
  updateTime = () => {
    this.setState({ time: Date.now() });
  };

  componentDidMount() {
    // start a timer for the clock:
    this.timer = setInterval(this.updateTime, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  renderWatchList() {
    if (!this.state.watchPages || !this.state.watchPages.length) {
      return null;
    }
    const watchRows = this.state.watchPages.map((wp, ix) => {
      return <WatchItem ix={ix} url={wp.url} checks={wp.checks}
                        checkInterval={this.state.checkInterval} />;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>&nbsp;</th>
            <th>URL</th>
            <th>Checks</th>
            <th>Status</th>
            <th>Last checked</th>
          </tr>
        </thead>
        <tbody>
          { watchRows }
        </tbody>
      </table>
    );
  }

  updateInput = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  updateCheck = (event) => {
    this.setState({
      [event.target.id]: event.target.checked,
    });
  }

  validURL(url) {
    if (!url.match(/^https?:\/\/[A-Za-z0-9\.]+/)) return false;
    return true;
  }

  isWatchInvalid = () => {
    const { newUrl, newCheckExact, newCheckCSSShow, newCheckSelector } = this.state;
    if (!newUrl || !this.validURL(newUrl)) return true;
    if (newCheckCSSShow && !newCheckSelector) return true;
    if (!newCheckExact && !newCheckSelector) return true;
    return false;
  }

  removeItem(array, action) {
      let newArray = array.slice()
      newArray.splice(action.index, 1)
      return newArray
  }

  watchAdded = (newWatch) => {
    this.setState({
      watchPages: this.state.watchPages.concat(newWatch)
    });
  }

  // Note: `user` comes from the URL, courtesy of our router
  render = () => {
    const { watchPages, time, lastCheck, checkInterval} = this.state;
    return (
      <div id="app">
        <Header />
        <div class={style.main}>
          <div>Current time: {new Date(time).toLocaleString()}</div>
          <div>Check interval: { checkInterval } seconds</div>
          { this.renderWatchList() }
          <AddWatch watchAdded={this.watchAdded} />
        </div>
      </div>
    );
  }
}
