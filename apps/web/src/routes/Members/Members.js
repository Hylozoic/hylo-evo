import { debounce, get, isEmpty, some, times } from 'lodash/fp'
import React, { useEffect, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import { RESP_ADD_MEMBERS } from 'store/constants'
import { queryParamWhitelist } from 'store/reducers/queryResults'
import { groupUrl } from 'util/navigation'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import { FETCH_MEMBERS, fetchMembers, getMembers, getHasMoreMembers, removeMember } from './Members.store'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'

import classes from './Members.module.scss'

const defaultSortBy = 'name'

function Members (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const routeParams = useParams()
  const location = useLocation()

  const context = props.context
  const slug = routeParams.groupSlug

  // State selectors
  const group = useSelector(state => getGroupForSlug(state, slug))
  const sortBy = useSelector(state => getQuerystringParam('s', { location }) || defaultSortBy)
  const search = useSelector(state => getQuerystringParam('q', { location }))
  const memberCount = useSelector(state => get('memberCount', group))
  const members = useSelector(state => getMembers(state, { slug, search, sortBy }))
  const hasMore = useSelector(state => getHasMoreMembers(state, { slug, search, sortBy }))
  const pending = useSelector(state => state.pending[FETCH_MEMBERS])
  const myResponsibilities = useSelector(state => getResponsibilitiesForGroup(state, { groupId: group.id }))
  const myResponsibilityTitles = useMemo(() => myResponsibilities.map(r => r.title), [myResponsibilities])

  // Action creators
  const changeSearch = useCallback(term =>
    dispatch(changeQuerystringParam({ slug }, 'q', term)), [dispatch, slug])
  const changeSort = useCallback(sort =>
    dispatch(changeQuerystringParam({ slug }, 's', sort, 'name')), [dispatch, slug])
  const removeMemberAction = useCallback((id) =>
    dispatch(removeMember(id, group.id)), [dispatch, group.id])
  const fetchMembersAction = useCallback((offset = 0) =>
    dispatch(fetchMembers({ slug, sortBy, offset, search })), [dispatch, slug, sortBy, search])

  useEffect(() => {
    if (isEmpty(members) && hasMore !== false) fetchMembersAction()
  }, [members, hasMore, fetchMembersAction])

  useEffect(() => {
    if (some(key => queryParamWhitelist.includes(key), [sortBy, search])) {
      fetchMembersAction()
    }
  }, [sortBy, search, fetchMembersAction])

  const fetchMore = () => {
    if (pending || members.length === 0 || !hasMore) return
    fetchMembersAction(members.length)
  }

  const debouncedSearch = debounce(300, changeSearch)

  const sortKeys = sortKeysFactory(context) // You might need to adjust this based on your needs

  return (
    <div>
      <Helmet>
        <title>{t('Members')} | {group ? `${group.name} | ` : ''}Hylo</title>
      </Helmet>

      <div className={classes.header}>
        <div>
          <div className={classes.title}>{t('Members')}</div>
          <div className={classes.totalMembers}>
            {t('{{memberCount}} Total Members', { memberCount })}
          </div>
        </div>
        {myResponsibilityTitles.includes(RESP_ADD_MEMBERS) && (
          <Link to={groupUrl(slug, 'settings/invite')}>
            <Button
              className={classes.invite}
              color='green-white-green-border'
              narrow
            >
              <Icon name='Invite' className={classes.inviteIcon} /> {t('Invite People')}
            </Button>
          </Link>
        )}
      </div>
      <div className={classes.content}>
        <div className={classes.controls}>
          <TextInput
            placeholder={t('Search by name or skills & interests')}
            className={classes.search}
            defaultValue={search}
            onChange={e => debouncedSearch(e.target.value)} />
          <Dropdown
            className={classes.sortDropdown}
            toggleChildren={<SortLabel text={sortKeys[sortBy]} />}
            alignRight
            items={Object.keys(sortKeys).map(k => ({
              label: t(sortKeys[k]),
              onClick: () => changeSort(k)
            }))} />
        </div>
        <div className={classes.members}>
          {twoByTwo(members).map(pair => (
            <div className={classes.memberRow} key={pair[0].id}>
              {pair.map(m => (
                <Member
                  group={group}
                  removeMember={removeMemberAction}
                  member={m} key={m.id}
                  context={context}
                />
              ))}
              {pair.length === 1 && <div />}
            </div>
          ))}
        </div>
      </div>
      <ScrollListener
        onBottom={fetchMore}
        elementId={CENTER_COLUMN_ID}
      />
    </div>
  )
}

function SortLabel ({ text }) {
  const { t } = useTranslation()
  return (
    <div className={classes.sortLabel}>
      <span>{t('Sort by')} <strong>{text}</strong></span>
      <Icon name='ArrowDown' className={classes.sortIcon} />
    </div>
  )
}

function sortKeysFactory (context) {
  // TODO: why are we passing in context here?
  const sortKeys = {
    name: 'Name',
    location: 'Location'
  }
  return sortKeys
}

export function twoByTwo (list) {
  return times(i => list.slice(i * 2, i * 2 + 2), (list.length + 1) / 2)
}

export default Members
