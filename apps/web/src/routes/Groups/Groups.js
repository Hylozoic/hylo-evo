import { Link, useParams } from 'react-router-dom'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { createSelector } from 'reselect'
import { TextHelpers } from 'hylo-shared'
import ClickCatcher from 'components/ClickCatcher'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import GroupNetworkMap from 'components/GroupNetworkMap'
import HyloHTML from 'components/HyloHTML'
import { useGetJoinRequests } from 'hooks/useGetJoinRequests'
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
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getMyMemberships from 'store/selectors/getMyMemberships'
import { bgImageStyle } from 'util/index'
import { groupUrl, groupDetailUrl } from 'util/navigation'
import { mapNodesAndLinks } from 'util/networkMap'

import classes from './Groups.module.scss'

function Groups () {
  const { t } = useTranslation()
  const routeParams = useParams()

  const group = useSelector(state => getGroupForSlug(state, routeParams.groupSlug))
  const memberships = useSelector(getMyMemberships)
  const joinRequests = useGetJoinRequests()

  const childGroups = useSelector(
    createSelector(
      state => getChildGroups(state, group),
      (childGroups) => childGroups.map(g => ({
        ...g.ref,
        memberStatus: memberships.find(m => m.group.id === g.id) ? 'member' : joinRequests.find(jr => jr.group.id === g.id) ? 'requested' : 'not'
      }))
    )
  )

  const parentGroups = useSelector(
    createSelector(
      state => getParentGroups(state, group),
      (parentGroups) => parentGroups.map(g => ({
        ...g.ref,
        memberStatus: memberships.find(m => m.group.id === g.id) ? 'member' : joinRequests.find(jr => jr.group.id === g.id) ? 'requested' : 'not'
      }))
    )
  )

  console.log('parentGroups', parentGroups)
  console.log('childGroups', childGroups)

  const networkData = mapNodesAndLinks(parentGroups, childGroups, group)
  console.log('networkData', networkData)
  const groupRelationshipCount = childGroups.length + parentGroups.length

  return (
    <div className={classes.container}>
      <Helmet>
        <title>Groups | {group ? `${group.name} | ` : ''}Hylo</title>
      </Helmet>

      {groupRelationshipCount > 1 &&
        <div className={classes.networkMap}>
          <div className={classes.addGroup}>
            <a href='#'>+ Create Group</a>
          </div>
          <GroupNetworkMap networkData={networkData} />
        </div>
      }

      <div className={classes.section}>
        <div className={classes.banner}>
          {parentGroups.length === 1 ? <h3>{t('{{group.name}} is a part of 1 Group', { group })}</h3> : '' }
          {parentGroups.length > 1 ? <h3>{t('{{group.name}} is a part of {{parentGroups.length}} Groups', { group, parentGroups })}</h3> : '' }
        </div>
        <GroupsList
          groups={parentGroups}
          routeParams={routeParams}
        />
      </div>

      <div className={classes.section}>
        <div className={classes.banner}>
          {childGroups.length === 1 ? <h3>{t('1 Group is a part of {{group.name}}', { group })}</h3> : ''}
          {childGroups.length > 1 ? <h3>{t('{{childGroups.length}} groups are a part of {{group.name}}', { childGroups, group })}</h3> : ''}
        </div>
        <GroupsList
          groups={childGroups}
          routeParams={routeParams}
        />
      </div>
    </div>
  )
}

export function GroupsList ({ groups, routeParams }) {
  return (
    <div className={classes.groupList}>
      {groups.map(c => <GroupCard group={c} key={c.id} routeParams={routeParams} />)}
    </div>
  )
}

export function GroupCard ({ group, routeParams }) {
  const { t } = useTranslation()
  return (
    <Link to={group.memberStatus === 'member' ? groupUrl(group.slug) : groupDetailUrl(group.slug, routeParams)} className={classes.groupLink}>
      <div className={classes.groupCard}>
        <div className={classes.cardWrapper}>
          <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} className={classes.groupImage} size='50px' square />
          <div className={classes.groupDetails}>
            <span className={classes.groupName}>{group.name}</span>
            <div className={classes.groupStats}>
              {group.memberCount ? <span className={classes.memberCount}>{group.memberCount} {t('Members')}</span> : ''}
              <div className={classes.membershipStatus}>
                <div className={classes.groupPrivacy}>
                  <Icon name={visibilityIcon(group.visibility)} className={classes.privacyIcon} />
                  <div className={classes.privacyTooltip}>
                    <div><strong>{t(visibilityString(group.visibility))}</strong> - {t(visibilityDescription(group.visibility))}</div>
                  </div>
                </div>
                <div className={classes.groupPrivacy}>
                  <Icon name={accessibilityIcon(group.accessibility)} className={classes.privacyIcon} />
                  <div className={classes.privacyTooltip}>
                    <div><strong>{t(accessibilityString(group.accessibility))}</strong> - {t(accessibilityDescription(group.accessibility))}</div>
                  </div>
                </div>
                {
                  group.memberStatus === 'member' ? <div className={classes.statusTag}><Icon name='Complete' className={classes.memberComplete} /> <b>{t('Member')}</b></div>
                    : group.memberStatus === 'requested' ? <div className={classes.statusTag}><b>{t('Membership Requested')}</b></div>
                      : <div className={classes.statusTag}><Icon name='CirclePlus' className={classes.joinGroup} /> <b>{t('Join')}</b></div>
                }
              </div>
            </div>
            <div className={classes.groupDescription}>
              <ClickCatcher>
                <HyloHTML element='span' html={TextHelpers.markdown(group.description)} />
              </ClickCatcher>
            </div>
          </div>
        </div>
        <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} className={classes.groupCardBackground}><div /></div>
      </div>
    </Link>
  )
}
export default Groups
