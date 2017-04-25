import React, { PropTypes, Component } from 'react'
import Loading from 'components/Loading'
import './CommunitySidebar.scss'
const { object, string } = PropTypes
import cx from 'classnames'

export default class CommunitySidebar extends Component {
  static propTypes = {
    commmunity: object
  }

  render () {
    const { community } = this.props
    if (!community) return <Loading />
    const { name, description } = community

    return <div styleName='community-sidebar'>
      <AboutSection name={name} description={description} />
    </div>
  }
}

export class AboutSection extends Component {
  static propTypes = {
    name: string,
    description: string
  }

  constructor (props) {
    super(props)
    this.state = {expanded: false}
  }

  render () {
    const { name, description } = this.props
    const { expanded } = this.state

    const onClick = () => this.setState({expanded: !expanded})

    return <div styleName='about-section'>
      <div styleName='about-header'>
        About {name}
      </div>
      <div styleName={cx('about', {expanded})}>
        {!expanded && <div styleName='gradient' />}
        {description}
      </div>
      <span styleName='expand-button' onClick={onClick}>
        {expanded ? 'Show Less' : 'Read More'}
      </span>
    </div>
  }
}
