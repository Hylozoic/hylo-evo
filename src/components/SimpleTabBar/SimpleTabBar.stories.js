import React from 'react'
import { storiesOf } from '@storybook/react'
import SimpleTabBar from './SimpleTabBar'

class ExampleSimpleTabBar extends React.Component {
  state = {
    tabs: [ 'Wombats', 'Aardvarks', 'Ocelots' ],
    currentTab: 'Wombats'
  }
  selectTab = tabName => {
    this.setState({
      currentTab: tabName
    })
  }
  render () {
    return <SimpleTabBar
      tabNames={this.state.tabs}
      selectTab={this.selectTab}
      currentTab={this.state.currentTab}
    />
  }
}

storiesOf('SimpleTabBar', module)
  .add('show', () => (
    <ExampleSimpleTabBar />
  ),
  { notes: 'A simple tab bar with three texts' }
  )
