import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import PeopleSelector from 'components/PeopleSelector'
import ThreadList from 'components/ThreadList'
import Thread from 'components/Thread'
import './Messages.scss'

export default class Messages extends React.Component {
  constructor (props) {
    super(props)
    this.state = {onCloseURL: props.onCloseURL}
  }

  render () {
    const { onCloseURL } = this.state

    return <div styleName='modal'>
      <div styleName='content'>
        <ThreadList styleName='left-column' />
        <div styleName='right-column'>
          <Switch>
            <Route path='/t/new' component={props => <PeopleSelector {...props} onCloseURL={onCloseURL} />} />
            <Route path='/t/:threadId' component={props => <Thread {...props} onCloseURL={onCloseURL} />} />
            <Redirect to='/t/new' />
          </Switch>
        </div>
      </div>
    </div>
  }
}
