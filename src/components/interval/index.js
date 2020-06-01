import { h, Component } from 'preact';

import style from './style';

export default class Interval extends Component {
  state = {
    interval: '',
    showEdit: false,
  };

  toggleEdit = () => {
    this.setState({
      showEdit: !this.state.showEdit
    });
  }

  handleChange = (event) => {
    this.setState({
      interval: event.target.value
    });
  }

  saveInterval = () => {
    this.props.onSave(Number.parseInt(this.state.interval)||this.props.interval);
    this.toggleEdit();
  }

  render() {
    if (!this.state.showEdit) {
      return (
        <span>
          <span>Check interval: { this.props.interval } seconds</span>
          <span class={style.edit} onClick={this.toggleEdit}>[edit]</span>
        </span>
      );
    }
    return (
      <span>
        <span>
          Check interval: 
          <input class={style.intervalEdit} onInput={this.handleChange} value={this.state.interval} />
          {' '} seconds
        </span>
        <span class={style.edit} onClick={this.saveInterval}>[save]</span>
      </span>
    );
  }
}

