import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { TextHelpers } from 'hylo-shared'
import ClickCatcher from 'components/ClickCatcher'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import GroupNetworkMap from 'components/GroupNetworkMap'
import HyloHTML from 'components/HyloHTML'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  accessibilityDescription,
  accessibilityIcon,
  accessibilityString,
  visibilityDescription,
  visibilityIcon,
  visibilityString
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import { groupUrl, groupDetailUrl } from 'util/navigation'
import './Groups.scss'

class Groups extends Component {
  static propTypes = {
    childGroups: PropTypes.array,
    group: PropTypes.object,
    parentGroups: PropTypes.array,
    routeParams: PropTypes.object
  }

  render () {
    const {
      childGroups,
      group,
      parentGroups,
      networkData,
      groupRelationshipCount,
      routeParams,
      t
    } = this.props

    return <div styleName='container'>
      <Helmet>
        <title>Groups | {group ? `${group.name} | ` : ''}Hylo</title>
      </Helmet>

      {groupRelationshipCount > 1 &&
        <div styleName='network-map'>
          <div styleName='add-group'>
            <a href='#'>+ Create Group</a>
          </div>
          <GroupNetworkMap networkData={networkData} />
        </div>
      }

      {/* <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSort={setSort} /> */}

      <div styleName='section'>
        <div styleName='banner'>
          {parentGroups.length === 1 ? <h3>{t('{{group.name}} is a part of 1 Group', { group })}</h3> : '' }
          {parentGroups.length > 1 ? <h3>{t('{{group.name}} is a part of {{parentGroups.length}} Groups', { group, parentGroups })}</h3> : '' }
        </div>
        <GroupsList
          groups={parentGroups}
          routeParams={routeParams}
        />
      </div>

      <div styleName='section'>
        <div styleName='banner'>
          {childGroups.length === 1 ? <h3>{t('1 Group is a part of {{group.name}}', { group })}</h3> : ''}
          {childGroups.length > 1 ? <h3>{t('{{childGroups.length}} groups are a part of {{group.name}}', { childGroups, group })}</h3> : ''}
        </div>
        <GroupsList
          groups={childGroups}
          routeParams={routeParams}
        />
      </div>
    </div>
  }
}

export function GroupsList ({ groups, routeParams }) {
  return <div styleName='group-list'>
    {groups.map(c => <GroupCard group={c} key={c.id} routeParams={routeParams} />)}
  </div>
}

export function GroupCard ({ group, routeParams }) {
  const { t } = useTranslation()
  return <Link to={group.memberStatus === 'member' ? groupUrl(group.slug) : groupDetailUrl(group.slug, routeParams)} styleName='group-link'>
    <div styleName='group-card'>
      <div styleName='card-wrapper'>
        <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' square />
        <div styleName='group-details'>
          <span styleName='group-name'>{group.name}</span>
          <div styleName='group-stats'>
            {group.memberCount ? <span styleName='member-count'>{group.memberCount} {t('Members')}</span> : ' '}
            <div styleName='membership-status'>
              <div styleName='group-privacy'>
                <Icon name={visibilityIcon(group.visibility)} styleName='privacy-icon' />
                <div styleName='privacy-tooltip'>
                  <div><strong>{visibilityString(group.visibility)}</strong> - {visibilityDescription(group.visibility)}</div>
                </div>
                <div styleName='group-privacy'>
                  <Icon name={accessibilityIcon(group.accessibility)} styleName='privacy-icon' />
                  <div styleName='privacy-tooltip'>
                    <div><strong>{t(accessibilityString(group.accessibility))}</strong> - {t(accessibilityDescription(group.accessibility))}</div>
                  </div>
                </div>
                {
                  group.memberStatus === 'member' ? <div styleName='status-tag'><Icon name='Complete' styleName='member-complete' /> <b>{t('Member')}</b></div>
                    : group.memberStatus === 'requested' ? <div styleName='status-tag'><b>{t('Membership Requested')}</b></div>
                      : <div styleName='status-tag'><Icon name='CirclePlus' styleName='join-group' /> <b>{t('Join')}</b></div>
                }
              </div>
              {
                group.memberStatus === 'member' ? <div styleName='status-tag'><Icon name='Complete' styleName='member-complete' /> <b>{t('Member')}</b></div>
                  : group.memberStatus === 'requested' ? <div styleName='status-tag'><b>{t('Membership Requested')}</b></div>
                    : <div styleName='status-tag'><Icon name='CirclePlus' styleName='join-group' /> <b>{t('Join')}</b></div>
              }
            </div>
          </div>
        </div>
        <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} styleName='groupCardBackground'><div /></div>
      </div>
    </Link>
  )
}
export default withTranslation()(Groups)
