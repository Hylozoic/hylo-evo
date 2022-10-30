import React from 'react'
import cx from 'classnames'
import { TextHelpers } from 'hylo-shared'
import './GroupCard.scss'
import GroupHeader from './GroupHeader'
import HyloHTML from 'components/HyloHTML'
import { Link } from 'react-router-dom'
import { groupUrl, groupDetailUrl } from 'util/navigation'
import Pill from 'components/Pill'
import { capitalize } from 'lodash'

/*
  Each card needs
  - group title
  - group icon
  - group background (tiny, behind the group icon)
  - member sample (for avatars on right )
  - group geography descriptor (indigenous territory, location)

  TODO: Then is contents changed based on group type... perhaps passed in as a Content component
  Default for normie groups is Topics, and if no topics, pass in description

*/

export default function GroupCard ({
  memberships,
  group = {},
  routeParams = {},
  highlightProps = {},
  className,
  expanded = false,
  constrained = false,
  onClick = () => {}
}) {
  const topics = group.groupTopics && group.groupTopics.toModelArray()
  const linkTo = memberships.includes(group.id)
    ? groupUrl(group.slug)
    : groupDetailUrl(group.slug, routeParams)

  return (
    <Link to={linkTo} styleName='group-link'>
      <div
        onClick={onClick}
        styleName={cx('card', { expanded }, { constrained })}
        className={className}>
        <GroupHeader
          {...group}
          group={group}
          routeParams={routeParams}
          highlightProps={highlightProps}
          constrained={constrained}
        />
        {group.description
          ? <div styleName='group-description'>
            <HyloHTML element='span' html={TextHelpers.markdown(group.description)} />
          </div>
          : ''
        }
        {topics.length > 0
          ? <div styleName='group-tags'>
            {topics.map((topic, index) => (
              <Pill
                styleName='tag-pill'
                darkText
                label={capitalize(topic.topic.name.toLowerCase())}
                id={topic.id}
                key={index}
              />
            ))}
          </div>
          : ''
        }
      </div>
    </Link>
  )
}
