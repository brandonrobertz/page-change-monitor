import { h, Component } from 'preact';

import style from './style';

export default class AddWatch extends Component {
  state = {
    newUrl: '',
    newCheckExact: false,
    newCheckPageText: false,
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
    const { newUrl, newCheckExact, newCheckPageText,
            newCheckCSSShow, newCheckSelector } = this.state;
    if (!newUrl || !this.validURL(newUrl)) return true;
    if (newCheckCSSShow && !newCheckSelector) return true;
    if (!newCheckExact && !newCheckSelector && !newCheckPageText) return true;
    return false;
  }

  randId() {
    return new Date().getTime();
  }

  addWatch = (event) => {
    const checks = [];
    if (this.state.newCheckExact) {
      checks.push("strictEq");
    }
    if (this.state.newCheckPageText) {
      checks.push("pageText");
    }
    if (this.state.newCheckCSSShow) {
      checks.push(this.state.newCheckSelector);
    }
    const newWatch = {
      id: this.randId(),
      url: this.state.newUrl,
      checks: checks,
      changed: false,
      error: null,
    };
    this.props.watchAdded(newWatch);
    this.setState({
      newUrl: '',
      newCheckExact: false,
      newCheckPageText: false,
      newCheckCSSShow: false,
      newCheckSelector: '',
    });
  }

  render = () => {
    return (
      <div>
        <p>
        Enter a URL and a page change detection method below.
        </p>
        <div>
          <label forName="newUrl">URL: </label>
          <input id="newUrl" type="text" onInput={this.updateInput}
                 class={style.watchUrl}
                 value={this.state.newUrl} />
        </div>
        <div>
          <p>
          <b>Page change detection methods:</b><br/>
          <ul>          
            <li>"Page text match" looks at just the displayed text of a page to
          determine if a page has changed.</li>
            <li>"Exact HTML match" checks to see if the HTML code of a page has changed.</li>
            <li>"Compare specific elements" takes a CSS Selector, pulls the matching
          elements from each page version and checks to see if the HTML of all the
          elements are identical. Use this one if you're getting false positives
          with the other options.</li>
          </ul>
          </p>
          <div>
            <label forName="newCheckPageText">
              <input id="newCheckPageText" type="checkbox"
                     onChange={this.updateCheck}
                     checked={this.state.newCheckPageText} />
              Page text match
            </label>
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
                     class={style.newCheckSelector}
                     value={this.state.newCheckSelector} />
            </span>
          )}
          </div>
        </div>
        <button disabled={this.isWatchInvalid()} onClick={this.addWatch}>Add</button>
        <button onClick={this.props.onCancel}>Cancel</button>
      </div>
    );
  }
}
