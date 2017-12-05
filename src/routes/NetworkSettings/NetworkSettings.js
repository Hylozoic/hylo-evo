import React, { PropTypes, Component } from 'react'
import Autocomplete from 'react-autocomplete'
import cx from 'classnames'
import { times, isEmpty } from 'lodash/fp'

import { bgImageStyle } from 'util/index'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Network'
import FullPageModal from 'routes/FullPageModal'
import Loading from 'components/Loading'
import RemovableListItem from 'components/RemovableListItem'
import SettingsControl from 'components/SettingsControl'

import './NetworkSettings.scss'

const { any, array, bool, func, number, object } = PropTypes

export default class NetworkSettings extends Component {
  static propTypes = {
    // TODO: temp, fix types
    addCommunityToNetwork: func.isRequired,
    addNetworkModeratorRole: func.isRequired,
    communities: array,
    communitiesPage: number,
    communitiesPageCount: number,
    communitiesPending: any,
    fetchCommunityAutocomplete: func.isRequired,
    fetchModeratorAutocomplete: func.isRequired,
    fetchNetworkSettings: func.isRequired,
    isAdmin: bool,
    moderators: array,
    moderatorsPage: number,
    moderatorsPageCount: number,
    moderatorsPending: any,
    network: object,
    removeCommunityFromNetwork: func.isRequired,
    removeNetworkModeratorRole: func.isRequired,
    setCommunitiesPage: func.isRequired,
    setConfirm: func.isRequired,
    updateNetworkSettings: func.isRequired
  }

  state = {
    changed: false,
    communityChoice: null,
    communitySearch: '',
    edits: {},
    moderatorChoice: null,
    moderatorSearch: ''
  }

  componentDidMount () {
    this.props.fetchNetworkSettings()
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.network !== this.props.network) {
      this.props.fetchNetworkSettings()
      this.setEditState()
    }
    if (prevProps.moderatorsPage !== this.props.moderatorsPage &&
      isEmpty(this.props.moderators)) {
      this.props.fetchModerators()
    }
    if (prevProps.communitiesPage !== this.props.communitiesPage &&
      isEmpty(this.props.communities)) {
      this.props.fetchCommunities()
    }
  }

  setEditState () {
    const { network } = this.props

    if (!network) return

    const {
      name, description, avatarUrl, bannerUrl
    } = network

    this.setState({
      edits: {
        name: name || '',
        description: description || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER
      }
    })
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

  addModerator = () => {
    const { moderatorChoice } = this.state
    if (moderatorChoice) {
      this.props.addNetworkModeratorRole(moderatorChoice.id)
      this.setState({
        moderatorChoice: null,
        moderatorSearch: ''
      })
    }
  }

  chooseCommunity = (_, community) => {
    this.setState({
      communityChoice: community,
      communitySearch: community.name
    })
  }

  chooseModerator = (_, person) => {
    this.setState({
      moderatorChoice: person,
      moderatorSearch: person.name
    })
  }

  communityAutocomplete = ({ target: { value } }) => {
    this.setState({ communitySearch: value })
    this.props.fetchCommunityAutocomplete(value)
  }

  moderatorAutocomplete = ({ target: { value } }) => {
    this.setState({ moderatorSearch: value })
    this.props.fetchModeratorAutocomplete(value)
  }

  render () {
    const {
      communities,
      communitiesPage,
      communitiesPageCount,
      communitiesPending,
      communityAutocompleteCandidates,
      isAdmin,
      moderators,
      moderatorsPage,
      moderatorsPageCount,
      moderatorsPending,
      moderatorAutocompleteCandidates,
      network,
      removeCommunityFromNetwork,
      removeNetworkModeratorRole,
      setCommunitiesPage,
      setConfirm,
      setModeratorsPage,
      updateNetworkSettings
    } = this.props
    if (!network) return <FullPageModal><Loading /></FullPageModal>
    if (!isAdmin) {
      return <FullPageModal goToOnClose={`/n/${network.slug}`}>
        Sorry, you must be an admin to access this page.
      </FullPageModal>
    }

    const { edits, changed } = this.state
    const {
      name, description, avatarUrl, bannerUrl
    } = edits

    const updateSetting = (key, setChanged = true) => event => {
      const { edits, changed } = this.state
      setChanged && setConfirm('You have unsaved changes, are you sure you want to leave?')
      this.setState({
        changed: setChanged ? true : changed,
        edits: {
          ...edits,
          [key]: event.target.value
        }
      })
    }

    const updateSettingDirectly = (key, changed) => value =>
      updateSetting(key, changed)({target: {value}})

    const save = () => {
      this.setState({changed: false})
      setConfirm(false)
      updateNetworkSettings(edits)
    }

    return <FullPageModal narrow goToOnClose={`/n/${network.slug}`}>
      <div>
        <input type='text' styleName='name' onChange={updateSetting('name')} value={name || ''} />
        <div style={bgImageStyle(bannerUrl)} styleName='banner'>
          <ChangeImageButton
            update={updateSettingDirectly('bannerUrl')}
            uploadSettings={{type: 'networkBanner', id: network.id}}
            styleName='change-banner-button' />
        </div>
        <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
          <ChangeImageButton
            update={updateSettingDirectly('avatarUrl')}
            uploadSettings={{type: 'networkAvatar', id: network.id}}
            styleName='change-avatar-button' />
        </div>
        <SettingsControl label='Description' onChange={updateSetting('description')} value={description} type='textarea' />
        <div styleName='button-row'>
          <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='button' />
        </div>
        <PaginatedList styleName='moderators'
          isAdmin={isAdmin}
          items={network.moderators}
          label={'Moderators'}
          page={moderatorsPage}
          pageCount={moderatorsPageCount}
          pending={moderatorsPending}
          removeItem={removeNetworkModeratorRole(network.id)}
          setPage={setModeratorsPage} />
        <div styleName='autocomplete'>
          <Autocomplete
            getItemValue={person => person.name}
            inputProps={{
              placeholder: "Start typing a person's name",
              style: {
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '3px',
                width: '400px'
              }
            }}
            items={moderatorAutocompleteCandidates}
            renderItem={(person, isHighlighted) =>
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {person.name}
              </div>
            }
            value={this.state.moderatorSearch}
            onChange={this.moderatorAutocomplete}
            onSelect={this.chooseModerator}
          />
          <Button label='Add Moderator' color={'green'} onClick={this.addModerator} styleName='button' />
        </div>
        <PaginatedList styleName='communities'
          isAdmin={isAdmin}
          items={network.communities}
          itemProps={{square: true, size: 40}}
          label={'Communities'}
          page={communitiesPage}
          pageCount={communitiesPageCount}
          pending={communitiesPending}
          removeItem={removeCommunityFromNetwork(network.id)}
          setPage={setCommunitiesPage} />
        <div styleName='autocomplete'>
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
              <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                {community.name}
              </div>
            }
            value={this.state.communitySearch}
            onChange={this.communityAutocomplete}
            onSelect={this.chooseCommunity}
          />
          <Button label='Add Community' color={'green'} onClick={this.addCommunity} styleName='button' />
        </div>
      </div>
    </FullPageModal>
  }
}

export class PaginatedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      prevItems: []
    }
  }

  updatePrevItems () {
    const { pending, items } = this.props
    const { prevItems } = this.state
    if (pending || items === prevItems || isEmpty(items)) return
    this.setState({prevItems: items})
  }

  componentDidMount () {
    this.updatePrevItems()
  }

  componentDidUpdate () {
    this.updatePrevItems()
  }

  render () {
    const {
      className,
      items,
      itemProps,
      label,
      page,
      pageCount,
      pending,
      removeItem,
      setPage
    } = this.props
    const { prevItems } = this.state
    const visibleItems = pending ? prevItems : items

    return <div styleName={cx('paginated-list', {loading: pending})} className={className}>
      <div styleName='section-label'>{label}</div>
      {visibleItems.map(m => <RemovableListItem
        item={m}
        key={m.id}
        removeItem={removeItem}
        {...itemProps} />)}
      <PaginationLinks page={page} pageCount={pageCount} setPage={setPage} />
    </div>
  }
}

export function PaginationLinks ({ pageCount, setPage, page }) {
  if (pageCount < 2) return null

  function PageLink ({ i }) {
    const current = i === page
    return <span styleName={current ? 'page-current' : 'page-link'} onClick={() => !current && setPage(i)}>{i + 1}</span>
  }

  return <div styleName='pagination-links'>
    {times(i => <PageLink key={i} i={i} />, pageCount)}
  </div>
}
