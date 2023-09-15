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

  const onClick = () => setExpanded(!expanded)

  if (!purpose && !description) return null

  return (
    <div styleName='about-section'>
      <div styleName={cx({ 'about-content': true, expanded })} ref={containerRef}>
        {showExpandButton && !expanded && <div styleName='gradient' />}
        {!isEmpty(purpose) &&
          <ClickCatcher>
            <h2>{t('Our Purpose')}</h2>
            <HyloHTML element='span' html={TextHelpers.markdown(purpose)} />
          </ClickCatcher>}
        {!isEmpty(description) &&
          <ClickCatcher>
            <h2>{t('Group Description')}</h2>
            <HyloHTML element='span' html={TextHelpers.markdown(description)} />
          </ClickCatcher>}
      </div>
      {showExpandButton &&
        <span styleName='expand-button' onClick={onClick}>
          {expanded ? t('Show Less') : t('Read More')}
        </span>}
    </div>
  )
}

AboutSection.propTypes = {
  description: string,
  purpose: string
}

export default withTranslation()(AboutSection)
