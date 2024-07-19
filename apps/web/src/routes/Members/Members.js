import { debounce, isEmpty, some, times } from 'lodash/fp'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import { bool, func, string, arrayOf, shape } from 'prop-types'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import TextInput from 'components/TextInput'
import ScrollListener from 'components/ScrollListener'
import { queryParamWhitelist } from 'store/reducers/queryResults'
import { groupUrl } from 'util/navigation'
import { CENTER_COLUMN_ID } from 'util/scrolling'

import './Members.scss'

class Members extends Component {
  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return
    if (some(key => this.props[key] !== prevProps[key], queryParamWhitelist)) {
      this.fetchOrShowCached()
    }
  }

  fetchOrShowCached = () => {
    const { hasMore, members, fetchMembers } = this.props
    if (isEmpty(members) && hasMore !== false) fetchMembers()
  }

  fetchMore = () => {
    const { members, hasMore, fetchMembers, pending } = this.props
    if (pending || members.length === 0 || !hasMore) return
    fetchMembers(members.length)
  }

  search (term) {
    if (!this.debouncedSearch) {
      this.debouncedSearch = debounce(300, this.props.changeSearch)
    }
    return this.debouncedSearch(term)
  }

  render () {
    const {
      group, memberCount, members, sortBy, changeSort, search, slug, context, canModerate, removeMember, t
    } = this.props

    const sortKeys = sortKeysFactory(context)

    return (
      <div>
        <Helmet>
          <title>{t('Members')} | {group ? `${group.name} | ` : ''}Hylo</title>
        </Helmet>

        <div styleName='header'>
          <div>
            <div styleName='title'>{t('Members')}</div>
            <div styleName='total-members'>
              {t('{{memberCount}} Total Members', { memberCount })}
            </div>
          </div>
          {canModerate && <Link to={groupUrl(slug, 'settings/invite')}>
            <Button styleName='invite'
              color='green-white-green-border'
              narrow >
              <Icon name='Invite' styleName='invite-icon' /> {t('Invite People')}
            </Button>
          </Link>}
        </div>
        <div styleName='content'>
          <div styleName='controls'>
            <TextInput placeholder={t('Search by name or skills & interests')}
              styleName='search'
              defaultValue={search}
              onChange={e => this.search(e.target.value)} />
            <Dropdown styleName='sort-dropdown'
              toggleChildren={<SortLabel text={sortKeys[sortBy]} />}
              alignRight
              items={Object.keys(sortKeys).map(k => ({
                label: t(sortKeys[k]),
                onClick: () => changeSort(k)
              }))} />
          </div>
          <div styleName='members'>
            {twoByTwo(members).map(pair => <div styleName='member-row' key={pair[0].id}>
              {pair.map(m => <Member
                group={group}
                canModerate={canModerate}
                removeMember={removeMember}
                member={m} key={m.id}
                context={context}
              />)}
              {pair.length === 1 && <div />}
            </div>)}
          </div>
        </div>
        <ScrollListener onBottom={this.fetchMore}
          elementId={CENTER_COLUMN_ID} />
      </div>
    )
  }
}
Members.propTypes = {
  slug: string,
  sortBy: string,
  members: arrayOf(shape({
    id: string,
    name: string,
    location: string,
    tagline: string,
    avatarUrl: string
  })),
  hasMore: bool,
  changeSort: func,
  changeSearch: func,
  canModerate: bool
}

function SortLabel ({ text }) {
  const { t } = useTranslation()
  return <div styleName='sort-label'>
    <span>{t('Sort by')} <strong>{text}</strong></span>
    <Icon name='ArrowDown' styleName='sort-icon' />
  </div>
}

// these keys must match the values that hylo-node can handle
function sortKeysFactory (context) {
  const sortKeys = {
    name: 'Name',
    location: 'Location'
  }
  return sortKeys
}

export function twoByTwo (list) {
  return times(i => list.slice(i * 2, i * 2 + 2), (list.length + 1) / 2)
}
export default withTranslation()(Members)
