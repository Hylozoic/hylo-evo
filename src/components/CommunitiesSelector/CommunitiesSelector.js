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
    const { onChange } = this.props
    let selectedCommunities = this.state.selectedCommunities.filter(c => c.id !== community.id)
    this.setState({ selectedCommunities })
    onChange(selectedCommunities)
  }

  handleAddition = (community) => {
    const { onChange } = this.props
    let selectedCommunities = this.state.selectedCommunities.concat(community)
    this.setState({ selectedCommunities })
    this.props.clearSuggestions()
    onChange(selectedCommunities)
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
