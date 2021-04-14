import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './GroupsWidget.scss'

const { array } = PropTypes

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 2.1,
  arrows: true,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1.1,
        slidesToScroll: 1
      }
    }
  ]
}

export default class GroupsWidget extends Component {
  static propTypes = {
    groups: array
  }

  render () {
    const { groups = [] } = this.props

    return (
      <div styleName='groups'>
        <Slider {...settings}>
          {groups && groups.map(a => <div styleName='group' key={a.id}>
            <div>
              <div styleName='content'>
                <div styleName='group-avatar'><img src={a.groupAvatar} /></div>
                <div styleName='group-name'>{a.groupName}</div>
                <div styleName='member-count'>{a.memberCount}</div>
                <div styleName='group-description'>{a.groupDescription}</div>
                {a.isMember
                  ? <div styleName='is-member'><Link to='#'>Member</Link></div>
                  : <div styleName='isnt-member'><Link to='#'>View</Link></div>
                }
              </div>
            </div>
            <div styleName='background' style={{ backgroundImage: `url(${a.groupBackground})` }} ><div styleName='fade' /></div>
          </div>)}
          <div styleName='createGroup'>
            <div>
              <Link to='#'>+ Create Group</Link>
            </div>
          </div>
        </Slider>
      </div>
    )
  }
}
