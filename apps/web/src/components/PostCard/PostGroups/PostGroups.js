import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import { get, isEmpty } from 'lodash/fp'
import cx from 'classnames'
import { Link } from 'react-router-dom'
import { groupUrl } from 'util/navigation'
import GroupsList from 'components/GroupsList'
import Icon from 'components/Icon'
import classes from './PostGroups.module.scss'

class PostGroups extends Component {
  static defaultState = {
    expanded: false
  }

  constructor (props) {
    super(props)
    this.state = PostGroups.defaultState
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded
    })
  }

  render () {
    const { groups, constrained, slug, showBottomBorder, t } = this.props
    const { expanded } = this.state

    // don't show if there are no groups or this isn't cross posted
    if (isEmpty(groups) || (groups.length === 1 && get('0.slug', groups) === slug)) return null

    return <div className={cx(classes.groups, { [classes.constrained]: constrained, [classes.expanded]: expanded, [classes.bottomBorder]: showBottomBorder })} onClick={expanded ? this.toggleExpanded : undefined}>
      <div className={classes.row}>
        <span className={classes.label}>{`${this.props.t('Posted In:')} `}</span>
        {!expanded &&
          <LinkedGroupNameList t={t} groups={groups} maxShown={2} expandFunc={this.toggleExpanded} />}
        <a onClick={this.toggleExpanded} className={classes.expandLink}><Icon name={expanded ? 'ArrowUp' : 'ArrowDown'} className={classes.expandIcon} /></a>
      </div>

      {expanded && <GroupsList groups={groups} />}
    </div>
  }
}

export function LinkedGroupNameList ({ groups, maxShown = 2, expandFunc, t }) {
  const groupsToDisplay = (maxShown && maxShown <= groups.length)
    ? groups.slice(0, maxShown)
    : groups
  const othersCount = groups.length - groupsToDisplay.length

  return <span className={classes.groupList}>
    {groupsToDisplay.map((group, i) =>
      <LinkedGroupName group={group} key={i}>
        <Separator currentIndex={i} displayCount={groupsToDisplay.length} t={t} othersCount={othersCount} />
      </LinkedGroupName>)}
    {othersCount > 0 &&
      <Others othersCount={othersCount} expandFunc={expandFunc} />}
  </span>
}

export function LinkedGroupName ({ group, children }) {
  return <span key={group.id}>
    <Link to={groupUrl(group.slug)} className={classes.groupLink}>{group.name === 'Public' && <Icon name='Public' className={classes.publicGroupIcon} />} {group.name}</Link>
    {children}
  </span>
}

export function Separator ({ currentIndex, displayCount, othersCount, t }) {
  const isLastEntry = currentIndex === displayCount - 1
  const isNextToLastEntry = currentIndex === Math.max(0, displayCount - 2)
  const hasOthers = othersCount > 0

  if (isLastEntry) return null
  if (!hasOthers && isNextToLastEntry) return <span key='and'> {t('and')} </span>

  return <span>, </span>
}

export function Others ({ othersCount, expandFunc }) {
  const { t } = useTranslation()
  if (othersCount < 0) return null

  const phrase = othersCount === 1 ? t('1 other') : t('{{othersCount}} others', { othersCount })

  return <React.Fragment>
    <span key='and'> {t('and')} </span>
    <a key='others' className={classes.groupLink} onClick={expandFunc}>{phrase}</a>
  </React.Fragment>
}

export default withTranslation()(PostGroups)
