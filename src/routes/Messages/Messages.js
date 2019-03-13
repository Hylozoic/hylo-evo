import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import PeopleSelector from './PeopleSelector'
import ThreadList from './ThreadList'
import Thread from './Thread'
import './Messages.scss'

export default class Messages extends React.Component {
  constructor (props) {
    super(props)
    this.state = {onCloseURL: props.onCloseURL}
  }

  render () {
    const { onCloseURL } = this.state
    const { holoMode } = this.props

    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList styleName='left-column' holoMode={holoMode} />
        <div styleName='right-column'>
          <Switch>
            <Route path='/t/new' component={props => <PeopleSelector {...props} onCloseURL={onCloseURL} holoMode={holoMode} />} />
            <Route path='/t/:threadId' component={props => <Thread {...props} onCloseURL={onCloseURL} holoMode={holoMode} />} />
            <Redirect to='/t/new' />
          </Switch>
        </div>
      </div>
    </div>
  }
}
