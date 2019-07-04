import React from 'react'
import { storiesOf } from '@storybook/react'
import PillBox from './Pillbox'

class ExamplePillBox extends React.Component {
  state = {
    pills: [
      { id: 1, label: 'Pill 1' },
      { id: 2, label: 'Pill 2' }
    ],
    listSuggestions: this.props.listSuggestions,
    suggestions: []
  }
  handleDelete = (IDPillToDelete) => {
    let pills = this.state.pills
    pills = pills.filter(pill => pill.id !== IDPillToDelete)
    this.setState({
      pills
    })
  }
  handleAddition = pillToAdd => {
    const pill = {
      id: pillToAdd.id,
      label: pillToAdd.name
    }
    let pills = this.state.pills
    pills.push(pill)
    this.setState({ pills })
  }
  handleInputChange = (value) => {
    if (value) {
      let listSuggestions = this.state.listSuggestions
      let suggestions = listSuggestions.filter((suggestions) => {
        return suggestions.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      })
      this.setState({
        suggestions
      })
    }
  }
  filter = (event) => {}
  render () {
    return (
      <PillBox
        pills={this.state.pills}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        editable={this.props.editable}
        handleInputChange={this.handleInputChange}
        filter={this.filter}
        suggestions={this.state.suggestions}
      />
    )
  }
}

storiesOf('Pillbox', module)
  .add('basic',
    () => <ExamplePillBox />,
    { notes: 'PillBox on basic mode, displays only a pill list' }
  )
  .add('editable',
    () => <ExamplePillBox editable />,
    { notes: 'PillBox on editable mode, can add and delete pills' }
  )
  .add('editable with suggestions',
    () => <ExamplePillBox
      editable
      listSuggestions={
        [
          { id: 'KFC', name: 'KFC' },
          { id: "McDonal's", name: "McDonal's" },
          { id: 'StarBucks', name: 'StarBucks' },
          { id: 'Arturo', name: 'Arturo' }
        ]
      }
    />,
    { notes: 'PillBox on editable mode with suggestions' }
  )
