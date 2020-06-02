import { h, Component } from 'preact';

import Header from './header';
import AddWatch from './addWatch';
import WatchItem from './watchItem';
import Interval from './interval';
import {loadFromStore, saveToStore} from '../storage';

import style from './style';

export default class App extends Component {
  state = {
    watchPages: loadFromStore(),
    time: Date.now(),
    checkInterval: 60,
    newUrl: '',
    newCheckExact: false,
    newCheckCSSShow: false,
    newCheckSelector: '',
    showAddWatch: false,
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

  removeWatch = (ix) => {
    const watchPages = this.state.watchPages.slice();
    watchPages.splice(ix, 1);
    saveToStore(watchPages);
    this.setState({
      watchPages: watchPages
    });
  }

  watchAdded = (newWatch) => {
    const watchPages = this.state.watchPages.concat(newWatch);
    saveToStore(watchPages);
    this.setState({
      watchPages: watchPages
    });
  }

  renderWatchList() {
    if (!this.state.watchPages || !this.state.watchPages.length) {
      return null;
    }
    const watchRows = this.state.watchPages.map((wp, ix) => {
      return <WatchItem ix={ix} url={wp.url} checks={wp.checks}
                        removeWatch={this.removeWatch}
                        checkInterval={this.state.checkInterval} />;
    });
    return (
      <table>
        <thead>
          <tr>
            <th>URL</th>
            <th>Checks</th>
            <th>Changed?</th>
            <th class="status">Last fetch status</th>
            <th>Last checked</th>
            <th>&nbsp;</th>
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

  onIntervalChange = (interval) => {
    this.setState({
      checkInterval: interval
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

  toggleWatchAdd = () => {
    this.setState({
      showAddWatch: !this.state.showAddWatch
    });
  }

  renderAddWatch() {
    if (this.state.showAddWatch) {
      return (<div class={style.watchWrap}>
        <AddWatch watchAdded={this.watchAdded} onCancel={this.toggleWatchAdd} />
      </div>);
    }
    return (<div class={style.watchWrap} style={{"text-align": "center"}}>
      <button style={style.addWatch} onClick={this.toggleWatchAdd}>+ Add page</button>
    </div>);
  }

  render = () => {
    const { watchPages, time, lastCheck, checkInterval} = this.state;
    return (
      <div id="app">
        <div class={style.header}>
          <span class={style.headSection}>Brandon's Page Change Detector</span>
          <span class={style.headSection}>Current time: <b>{new Date(time).toLocaleString()}</b></span>
          <span class={style.headSection}>
            <Interval interval={checkInterval} onSave={this.onIntervalChange} />
          </span>
        </div>
        <div class={style.main}>
          { this.renderWatchList() }
          { this.renderAddWatch() }
        </div>
      </div>
    );
  }
}
