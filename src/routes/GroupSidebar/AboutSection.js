import React, { Component } from 'react'
import { string } from 'prop-types'
import { withTranslation } from 'react-i18next'
import { TextHelpers } from 'hylo-shared'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import cx from 'classnames'
import './GroupSidebar.scss'

class AboutSection extends Component {
  static propTypes = {
    name: string,
    description: string
  }

  constructor (props) {
    super(props)
    this.state = { expanded: false }
  }

  render () {
    const { name, description } = this.props
    let { expanded } = this.state

    if (!description) return null

    const onClick = () => this.setState({ expanded: !expanded })
    const showExpandButton = description.length > 155
    if (!showExpandButton) {
      expanded = true
    }

    return (
      <div styleName='about-section'>
        <div styleName='header'>
          {this.props.t('About {{name}}', { name })}
        </div>
        <div styleName={cx('description', { expanded })}>
          {!expanded && <div styleName='gradient' />}
          <ClickCatcher>
            <HyloHTML element='span' html={TextHelpers.markdown(description)} />
          </ClickCatcher>
        </div>
        {showExpandButton && <span styleName='expand-button' onClick={onClick}>
          {expanded ? this.props.t('Show Less') : this.props.t('Read More')}
        </span>}
      </div>
    )
  }
}

export default withTranslation()(AboutSection)
