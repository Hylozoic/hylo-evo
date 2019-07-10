import React from 'react'
import { storiesOf } from '@storybook/react'
import CommunitiesSelector from './CommunitiesSelector'

class ExampleCommunitiesSelector extends React.Component {
  state = {
    options: [
      { id: 1, name: 'KFC' },
      { id: 2, name: 'Arturo' },
      { id: 3, name: "McDonald's" },
      { id: 4, name: 'StarBucks' }
    ],
    selected: []
  }
  onChange = arraySelected => {
    this.setState({
      selected: arraySelected
    })
  }
  render () {
    return (
      <CommunitiesSelector
        options={this.state.options}
        onChange={this.onChange}
        selected={this.state.selected}
      />
    )
  }
}

storiesOf('CommunitiesSelector', module)
  .add('show', () => (
    <ExampleCommunitiesSelector />
  ),
  { notes: "Search communities, add the selected ones or discard some. The suggestions are KFC, Arturo, McDonald's and StarBucks" }
  )
