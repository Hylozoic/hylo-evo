import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './AffiliationsWidget.scss'

const { array } = PropTypes

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 2.1,
  arrows: true,
  slidesToScroll: 1
}

export default class AffiliationsWidget extends Component {
  static propTypes = {
    affiliations: array
  }

  render () {
    const { affiliations = [] } = this.props

    return (
      <div styleName='affiliations'>
        <Slider {...settings}>
          {affiliations && affiliations.map(a => <div styleName='affiliation' key={a.id}>
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
