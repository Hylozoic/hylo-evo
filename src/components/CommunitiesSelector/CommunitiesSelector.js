import React, { Component, PropTypes } from 'react'
import TagInput from 'components/TagInput'
import styles from './CommunitiesSelector.scss'

export default class CommunitiesSelector extends Component {
  static propTypes = {
    communitySuggestions: PropTypes.object,
    findCommunities: PropTypes.func.isRequired,
    clearCommunities: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {selectedCommunities: []}
  }

  handleInputChange = (input) => {
    if (input && input.length > 0) {
      this.props.findCommunities(input)
    } else {
      this.props.clearCommunities()
    }
  }

  handleDelete = (community) => {
    const { selectedCommunities } = this.state
    this.setState({
      selectedCommunities: selectedCommunities.filter(c => c.id !== community.id)
    })
  }

  handleAddition = (community) => {
    const { selectedCommunities } = this.state
    this.setState({
      selectedCommunities: selectedCommunities.concat(community)
    })
    this.props.clearCommunities()
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
