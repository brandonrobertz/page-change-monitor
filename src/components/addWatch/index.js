import { h, Component } from 'preact';

export default class AddWatch extends Component {
  state = {
    newUrl: '',
    newCheckExact: false,
    newCheckCSSShow: false,
    newCheckSelector: '',
  };

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

  addWatch = (event) => {
    const checks = [];
    if (this.state.newCheckExact) {
      checks.push("strictEq");
    }
    if (this.state.newCheckCSSShow) {
      checks.push(this.state.newCheckSelector);
    }
    const newWatch = {
      url: this.state.newUrl,
      checks: checks,
      changed: false,
      error: null,
    };
    this.props.watchAdded(newWatch);
    this.setState({
      newUrl: '',
      newCheckExact: false,
      newCheckCSSShow: false,
      newCheckSelector: '',
    });
  }

  render = () => {
    return (
      <div>
        <div>
          <label forName="newUrl">URL: </label>
          <input id="newUrl" type="text" onInput={this.updateInput}
                 value={this.state.newUrl} />
        </div>
        <div>
          <label forName="newCheckExact">
            <input id="newCheckExact" type="checkbox"
                   onChange={this.updateCheck}
                   checked={this.state.newCheckExact} />
            Exact HTML match
          </label>
        </div>
        <div>
          <label forName="newCheckCSSShow">
            <input id="newCheckCSSShow" type="checkbox"
                   onChange={this.updateCheck}
                   checked={this.state.newCheckCSSShow} />
            Compare specific elements
          </label>
          { this.state.newCheckCSSShow && (
            <span>
              <input id="newCheckSelector" type="text" onInput={this.updateInput}
                     placeholder="CSS Selector, e.g.: table"
                     value={this.state.newCheckSelector} />
            </span>
          )}
        </div>
        <button disabled={this.isWatchInvalid()} onClick={this.addWatch}>Watch this page</button>
      </div>
    );
  }
}
