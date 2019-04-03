import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Autocomplete from 'react-autocomplete'
import { isEmpty } from 'lodash/fp'
import SimplePaginatedList from '../SimplePaginatedList'
import RoundImage from 'components/RoundImage'
import '../NetworkSettings.scss'
import { DEFAULT_AVATAR } from 'store/models/Community'

const { any, array, bool, func, number, object } = PropTypes

export default class NetworkCommunitiesTab extends Component {
  static propTypes = {
    addCommunityToNetwork: func.isRequired,
    communities: array,
    isAdmin: bool,
    isModerator: bool,
    communitiesPage: number,
    communitiesPageCount: number,
    communitiesPending: any,
    fetchCommunityAutocomplete: func.isRequired,
    network: object,
    removeCommunityFromNetwork: func.isRequired,
    setCommunitiesPage: func.isRequired
  }

  state = {
    changed: false,
    communityChoice: null,
    communitySearch: '',
    expandedCommunityId: null
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.communitiesPage !== this.props.communitiesPage &&
    isEmpty(this.props.communities)) {
      this.props.fetchCommunities()
    }
  }

  addCommunity = () => {
    const { communityChoice } = this.state
    if (communityChoice) {
      this.props.addCommunityToNetwork(communityChoice.id)
      this.setState({
        communityChoice: null,
        communitySearch: ''
      })
    }
  }

  addNewCommunity = () => {
    this.props.createCommunity()
  }

  chooseCommunity = (_, community) => {
    this.setState({
      communityChoice: community,
      communitySearch: community.name
    })
  }

  communityAutocomplete = ({ target: { value } }) => {
    this.setState({ communitySearch: value })
    this.props.fetchCommunityAutocomplete(value)
  }

  toggleExpandedMaker = communityId => () => {
    const { expandedCommunityId } = this.state
    if (expandedCommunityId === communityId) {
      this.setState({expandedCommunityId: null})
    } else {
      this.setState({expandedCommunityId: communityId})
    }
  }

  renderNetworkCommunityRow = community => {
    const { removeCommunityFromNetwork } = this.props
    const { expandedCommunityId } = this.state
    const expanded = expandedCommunityId === community.id
    return <NetworkCommunityRow
      community={community}
      expanded={expanded}
      toggleExpanded={this.toggleExpandedMaker(community.id)}
      key={community.id}
      removeCommunityFromNetwork={removeCommunityFromNetwork} />
  }

  render () {
    const {
      isModerator,
      isAdmin,
      communitiesPage,
      communitiesPageCount,
      communitiesPending,
      communityAutocompleteCandidates,
      network,
      setCommunitiesPage
    } = this.props

    if (!network) return <Loading />

    const header = <div styleName='section-label'><span>communities</span><span style={{marginLeft: 'auto'}}>visibility to network</span></div>

    return <div styleName='communities-tab'>
      <SimplePaginatedList styleName='communities'
        items={network.communities}
        itemProps={{square: true, size: 40}}
        header={header}
        page={communitiesPage}
        pageCount={communitiesPageCount}
        pending={communitiesPending}
        setPage={setCommunitiesPage} 
        renderItem={this.renderNetworkCommunityRow} />
      {isAdmin && <div styleName='autocomplete'>
        <Autocomplete
          getItemValue={community => community.name}
          inputProps={{
            placeholder: 'Start typing a community name',
            style: {
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '3px',
              width: '400px'
            }
          }}
          items={communityAutocompleteCandidates}
          renderItem={(community, isHighlighted) =>
            <div key={community.id} style={{background: isHighlighted ? 'lightgray' : 'white'}}>
              {community.name}
            </div>
          }
          value={this.state.communitySearch}
          onChange={this.communityAutocomplete}
          onSelect={this.chooseCommunity}
        />
        <Button label='Add Existing Community' color={'green'} onClick={this.addCommunity} styleName='button' />
      </div>
      }
      {isModerator && <Button label='Add New Community' color={'green'} onClick={this.addNewCommunity} styleName='button' />}
    </div>
  }
}

export class NetworkCommunityRow extends Component {
  render () {
    const { community, expanded, toggleExpanded } = this.props
    return <div styleName='networkCommunityRow'>
      <span onClick={() => console.log('clicked community', community.name)}>
        <RoundImage url={community.avatarUrl || DEFAULT_AVATAR} medium styleName='communityAvatar' />
      </span>
      <span onClick={toggleExpanded} styleName='communityName'>{community.name}</span>
      {expanded && <span>This boy is expanded</span>}
  </div>
  }
}

