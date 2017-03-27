import React from 'react'
import './component.scss'

export default class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = () => {
    return this.props.login(this.state.email, this.state.password)
  }

  render () {
    const setState = key => event => this.setState({[key]: event.target.value})
    return <div styleName='container'>
      <h3>Log in to Hylo</h3>
      <div styleName='field'>
        <label>Email</label>
        <input type='text' name='email' onChange={setState('email')} />
      </div>
      <div styleName='field'>
        <label>Password</label>
        <input type='password' name='password' onChange={setState('password')} />
      </div>
      <div>
        <button onClick={this.submit}>Log in</button>
      </div>
    </div>
  }
}
