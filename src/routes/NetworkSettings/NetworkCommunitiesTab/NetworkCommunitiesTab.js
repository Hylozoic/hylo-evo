import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import Autocomplete from 'react-autocomplete'
import { isEmpty } from 'lodash/fp'
import PaginatedList from '../PaginatedList'
import RoundImage from 'components/RoundImage'
import '../NetworkSettings.scss'
import { DEFAULT_AVATAR } from 'store/models/Community'
import Dropdown from 'components/Dropdown'
import Avatar from 'components/Avatar'
import { Link } from 'react-router-dom'
import { personUrl } from 'util/navigation'

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

  removeCommunityFromNetwork = community => {
    const { id, name } = community
    const { removeCommunityFromNetwork } = this.props
    if (window.confirm(`are you sure you want to remove ${name} from the network?`)) {
      removeCommunityFromNetwork(id)
    }
  }

  renderNetworkCommunityRow = community => {
    const { expandedCommunityId } = this.state
    const { updateCommunityHiddenSetting } = this.props
    const expanded = expandedCommunityId === community.id
    return <NetworkCommunityRow
      community={community}
      expanded={expanded}
      toggleExpanded={this.toggleExpandedMaker(community.id)}
      key={community.id}
      removeCommunityFromNetwork={this.removeCommunityFromNetwork}
      updateCommunityHiddenSetting={updateCommunityHiddenSetting} />
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
      <PaginatedList styleName='communities'
        items={network.communities}
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
    const { community, expanded, toggleExpanded, removeCommunityFromNetwork, updateCommunityHiddenSetting } = this.props
    const { id, hidden, slug } = community
    const dropdownLabel = hidden ? 'Private to members' : 'Visible to network'
    const dropdownItems = [
      {label: 'Visible to network', onClick: () => updateCommunityHiddenSetting(id, false)},
      {label: 'Private to members', onClick: () => updateCommunityHiddenSetting(id, true)}
    ]

    const moderators = community.moderators.toModelArray()

    return <div styleName='networkCommunityRow'>
      <div styleName='topRow'>
        <span onClick={toggleExpanded}>
          {expanded
            ? <Icon name='ArrowDown' styleName='arrowDownIcon' />
            : <Icon name='ArrowForward' styleName='arrowForwardIcon' />}
          <RoundImage url={community.avatarUrl || DEFAULT_AVATAR} medium styleName='communityAvatar' />
        </span>
        <span onClick={toggleExpanded} styleName='communityName'>{community.name}</span>
        <Dropdown styleName='visibilityDropdown' toggleChildren={<span styleName='dropdownLabel'>{dropdownLabel}</span>} items={dropdownItems} />
      </div>
      {expanded && <div styleName='expandedNetworkCommunityRow'>
        <CommunityModeratorSection moderators={moderators} slug={slug} />
        <div styleName='removeButton' onClick={() => removeCommunityFromNetwork(community)}>
          <Icon name='Trash' styleName='trashIcon' /> Remove Community from Network
        </div>
      </div>}
    </div>
  }
}

export function CommunityModeratorSection ({ moderators, slug }) {
  return <div styleName='moderators-section'>
    <div styleName='moderators-header'>Community Moderators</div>
    {moderators.map((m, index) => <CommunityModerator moderator={m} slug={slug} key={index} />)}
  </div>
}

export function CommunityModerator ({ moderator, slug }) {
  const { name, avatarUrl } = moderator
  return <div styleName='moderator'>
    <Avatar url={personUrl(moderator.id, slug)} avatarUrl={avatarUrl} styleName='moderator-image' medium />
    <Link to={personUrl(moderator.id, slug)} styleName='moderator-name'>{name}</Link>
  </div>
}