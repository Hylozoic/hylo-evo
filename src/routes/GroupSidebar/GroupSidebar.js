import cx from 'classnames'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { isEmpty } from 'lodash/fp'
import { personUrl, groupUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import BadgeEmoji from 'components/BadgeEmoji'
import Loading from 'components/Loading'
import RoundImageRow from 'components/RoundImageRow'
import Button from 'components/Button'
import Icon from 'components/Icon'
import AboutSection from './AboutSection'
import { RESP_ADD_MEMBERS, RESP_ADMINISTRATION } from 'store/constants'
import getRolesForGroup from 'store/selectors/getRolesForGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'

import classes from './GroupSidebar.module.scss'

function GroupSidebar (props) {
  const params = useParams()
  const slug = params.groupSlug
  const group = useSelector(state => getGroupForCurrentRoute(state, slug))
  const members = group ? group.members.toModelArray().slice(0, 8) : []
  const stewards = group ? group.stewards.toModelArray() : []
  const responsibilities = useSelector(state => getResponsibilitiesForGroup(state, { groupId: group?.id }))
  const myResponsibilities = useMemo(() => responsibilities.map(r => r.title), [responsibilities])

  if (!group || isEmpty(members)) return <Loading />

  const { description, memberCount, stewardDescriptorPlural, purpose } = group.ref

  return (
    <div className={classes.groupSidebar}>
      <AboutSection description={description} purpose={purpose} />
      <SettingsLink canAdmin={myResponsibilities.includes(RESP_ADMINISTRATION)} group={group.ref} />
      <MemberSection
        members={members}
        memberCount={memberCount}
        slug={slug}
        canInvite={myResponsibilities.includes(RESP_ADD_MEMBERS)}
      />
      <GroupStewardsSection stewards={stewards} slug={slug} descriptor={stewardDescriptorPlural} groupId={group.id} />
    </div>
  )
}

export function SettingsLink ({ canAdmin, group }) {
  const { t } = useTranslation()
  if (!canAdmin) return null
  return (
    <Link className={classes.settingsLink} to={groupUrl(group.slug, 'settings')}>
      <Icon name='Settings' className={classes.settingsIcon} /> {t('Group Settings')}
    </Link>
  )
}

export function MemberSection ({ members, memberCount, slug, canInvite }) {
  const { t } = useTranslation()
  const formatTotal = total => {
    if (total < 1000) return `+${total}`
    return `+${Number(total / 1000).toFixed(1)}k`
  }

  const showTotal = memberCount - members.length > 0

  return (
    <div className={classes.memberSection}>
      <Link to={groupUrl(slug, 'members')} className={classes.membersLink}>
        <div className={classes.header}>{t('Members')}</div>
        <div className={classes.imagesAndCount}>
          <RoundImageRow imageUrls={members.map(m => m.avatarUrl)} className={classes.imageRow} />
          {showTotal &&
            <span className={classes.membersTotal}>
              {formatTotal(memberCount - members.length)}
            </span>}
        </div>
      </Link>
      {canInvite &&
        <Link to={groupUrl(slug, 'settings/invite')} className={classes.inviteLink}>
          <Button className={classes.settingsLink}><Icon name='Invite' className={classes.inviteIcon} /> {t('Invite People')}</Button>
        </Link>}
    </div>
  )
}

export function GroupStewardsSection ({ descriptor, stewards, groupId, slug }) {
  const { t } = useTranslation()
  return (
    <div className={classes.leaderSection}>
      <div className={cx(classes.header, classes.leaderHeader)}>{t('Group {{locationDescriptor}}', { locationDescriptor: descriptor })}</div>
      {stewards.map(s => <GroupSteward steward={s} slug={slug} key={s.id} groupId={groupId} />)}
    </div>
  )
}

export function GroupSteward ({ groupId, steward, slug }) {
  const { name, avatarUrl } = steward
  const roles = useSelector(state => getRolesForGroup(state, { person: steward, groupId }))
  return (
    <div className={classes.leader}>
      <Avatar url={personUrl(steward.id, slug)} avatarUrl={avatarUrl} className={classes.leaderImage} medium />
      <Link to={personUrl(steward.id, slug)} className={classes.leaderName}>{name}</Link>
      <div className={classes.badges}>
        {roles.map(role => (
          <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={steward.id} />
        ))}
      </div>
    </div>
  )
}

export default GroupSidebar
