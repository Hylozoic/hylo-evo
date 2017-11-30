import React, { PropTypes, Component } from 'react'
import './NetworkSettings.scss'
import Loading from 'components/Loading'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import RemovableListItem from 'components/RemovableListItem'
import SettingsControl from 'components/SettingsControl'
import FullPageModal from 'routes/FullPageModal'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Network'
import { times, isEmpty } from 'lodash/fp'
import cx from 'classnames'

const { object, func } = PropTypes

export default class NetworkSettings extends Component {
  static propTypes = {
    network: object,
    updateNetworkSettings: func,
    fetchNetworkSettings: func,
    setConfirm: func
  }

  constructor (props) {
    super(props)
    this.state = {edits: {}, changed: false}
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

  render () {
    const {
      communities,
      communitiesPage,
      communitiesPageCount,
      communitiesPending,
      isAdmin,
      moderators,
      moderatorsPage,
      moderatorsPageCount,
      moderatorsPending,
      network,
      setCommunitiesPage,
      setConfirm,
      setModeratorsPage,
      updateNetworkSettings
    } = this.props
    if (!isAdmin) return <FullPageModal>Sorry, you must be an admin to access this page. {isAdmin}</FullPageModal>
    if (!network) return <FullPageModal><Loading /></FullPageModal>

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
        <div>isAdmin: {isAdmin}</div>
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
          <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='save-button' />
        </div>
        <PaginatedList
          label={'Moderators'}
          items={moderators}
          page={moderatorsPage}
          pageCount={moderatorsPageCount}
          setPage={setModeratorsPage}
          pending={moderatorsPending} />
        <PaginatedList
          styleName='communities'
          label={'Communities'}
          items={communities}
          page={communitiesPage}
          pageCount={communitiesPageCount}
          setPage={setCommunitiesPage}
          pending={communitiesPending}
          itemProps={{square: true, size: 40}} />
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
      items, page, pageCount, setPage, pending, label, itemProps, className
    } = this.props
    const { prevItems } = this.state

    const visibleItems = pending ? prevItems : items

    return <div styleName={cx('paginated-list', {loading: pending})} className={className}>
      <div styleName='section-label'>{label}</div>
      {visibleItems.map(m => <RemovableListItem item={m} key={m.id} {...itemProps} />)}
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
