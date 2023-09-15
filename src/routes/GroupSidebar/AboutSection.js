import { isEmpty } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { string } from 'prop-types'
import { withTranslation } from 'react-i18next'
import { TextHelpers } from 'hylo-shared'
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import cx from 'classnames'
import './GroupSidebar.scss'

function AboutSection (props) {
  const { description, purpose, t } = props
  const [showExpandButton, setShowExpandButton] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (container) {
      setShowExpandButton(container.scrollHeight > container.clientHeight)
    }
  }, [containerRef.current, purpose, description])

    return <div styleName='about-section'>
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
  }
}

export default withTranslation()(AboutSection)
