import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Slider from 'react-slick'
import Icon from 'components/Icon'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './MembersWidget.scss'

const { array } = PropTypes

const settings = {
  dots: true,
  slidesToShow: 3,
  slidesToScroll: 3,
  infinite: false,
  variableWidth: true
}

export default class MembersWidget extends Component {
  static propTypes = {
    members: array
  }

  render () {
    const { members } = this.props
    return (
      <div styleName='active-users'>
        <Slider {...settings}>
          {members && members.map(m => <div key={m.id} styleName='active-user'>
            <div styleName='user-name'>{m.name.split(' ')[0]}</div>
            <div styleName='user-controls'>
              <Link to='#'><Icon name='Messages' styleName='user-message-icon' /></Link>
              <Link to='#'><Icon name='Person' styleName='user-profile-icon' /></Link>
            </div>
            <div styleName='user-background' />
            <div styleName='user-image' style={{ backgroundImage: `url(${m.avatarUrl})` }} />
          </div>)}
          <div styleName='members-link'>
            <div>
              <Link to='#'>All</Link>
            </div>
          </div>
        </Slider>
        <div styleName='right-fade' />
      </div>
    )
  }
}
