import React, { Component, PropTypes } from 'react'
import { reject } from 'lodash/fp'
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

    this.state = {
      selectedCommunities: [
        {id: 1, name: 'Stop Kinder Morgan'},
        {id: 2, name: 'David Suzuki Foundation'}
      ]
    }
  }

  handleInputChange = (input) => {
    this.props.findCommunities(input)
  }

  handleDelete = (community) => {
    const { selectedCommunities } = this.state
    console.log('handleDelete', community, selectedCommunities)
    this.setState({selectedCommunities: reject(community)(selectedCommunities)})
  }

  handleAddition = (community) => {
    const { selectedCommunities } = this.state
    selectedCommunities.concat(community)
    console.log('handleAddition', community, selectedCommunities)
    this.setState({ selectedCommunities })
  }

  render () {
    const { communitiesResults } = this.props
    const { selectedCommunities } = this.state
    return (
      <TagInput
        placeholder='Begin typing...'
        tags={selectedCommunities}
        choices={communitiesResults}
        handleInputChange={this.handleInputChange}
        handleAddition={this.handleAddition}
        handleDelete={this.handleDelete}
        classNames={styles}
      />
    )
  }
}

// import React, { Component, PropTypes } from 'react'
// import { reject, concat } from 'lodash/fp'
// import ReactTags from 'react-tag-autocomplete'
// import styles from './CommunitiesSelector.scss'
//
// export default class CommunitiesSelector extends Component {
//   static propTypes = {
//     communitySuggestions: PropTypes.object
//   }
//
//   constructor (props) {
//     super(props)
//
//     this.state = {
//       selectedCommunities: [
//         {id: 1, name: 'Stop Kinder Morgan'},
//         {id: 2, name: 'David Suzuki Foundation'}
//       ]
//     }
//   }
//
//   handleInputChange = (input) => {
//     return this.props.findCommunities(input)
//   }
//
//   handleDelete = (index) => {
//     const { selectedCommunities } = this.state
//     selectedCommunities.splice(index, 1)
//     console.log('handleDelete', index, selectedCommunities)
//     this.setState({ selectedCommunities })
//   }
//
//   handleAddition = (community) => {
//     const { selectedCommunities } = this.state
//     selectedCommunities.concat(community)
//     console.log('handleAddition', community, selectedCommunities)
//     this.setState({ selectedCommunities })
//   }
//
//   render () {
//     const { communitiesResults } = this.props
//     return (
//       <ReactTags
//         placeholder='Begin typing...'
//         tags={this.state.selectedCommunities}
//         suggestions={communitiesResults}
//         handleInputChange={this.handleInputChange}
//         handleDelete={this.handleDelete}
//         handleAddition={this.handleAddition}
//         classNames={styles}
//       />
//     )
//   }
// }
