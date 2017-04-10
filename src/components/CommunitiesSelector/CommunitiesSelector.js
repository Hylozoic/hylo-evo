import React, { Component, PropTypes } from 'react'
import TagInput from 'components/TagInput'
import styles from './CommunitiesSelector.scss'

export default class CommunitiesSelector extends Component {
  static propTypes = {
    communitySuggestions: PropTypes.object,
    findSuggestions: PropTypes.func.isRequired,
    clearSuggestions: PropTypes.func.isRequired,
    onChange: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {selectedCommunities: []}
  }

  handleInputChange = (input) => {
    if (input && input.length > 0) {
      this.props.findSuggestions(input)
    } else {
      this.props.clearSuggestions()
    }
  }

  handleDelete = (community) => {
    const { selectedCommunities } = this.state
    const { onChange } = this.props
    this.setState({
      selectedCommunities: selectedCommunities.filter(c => c.id !== community.id)
    })
    onChange(this.state.selectedCommunities)
  }

  handleAddition = (community) => {
    const { selectedCommunities } = this.state
    const { onChange } = this.props
    this.setState({
      selectedCommunities: selectedCommunities.concat(community)
    })
    this.props.clearSuggestions()
    onChange(this.state.selectedCommunities)
  }

  render () {
    const { communitiesResults } = this.props
    const { selectedCommunities } = this.state
    return (
      <TagInput
        placeholder='Begin typing...'
        tags={selectedCommunities}
        suggestions={communitiesResults}
        handleInputChange={this.handleInputChange}
        handleAddition={this.handleAddition}
        handleDelete={this.handleDelete}
        theme={styles}
      />
    )
  }
}
