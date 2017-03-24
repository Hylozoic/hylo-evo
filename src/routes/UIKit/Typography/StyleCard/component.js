import React, { PropTypes } from 'react'
import hyloAppTypographyStyles from '../../../../css/typography.scss'
import s from './component.scss' // eslint-disable-line no-unused-vars

const SAMPLE_TEXT_OPTIONS = {
  short: 'Five quacking zephyrs jolt my wax bed.',
  medium: 'Apparently we had reached a great height in the atmosphere, for the sky was a dead black.',
  long: 'Apparently we had reached a great height in the atmosphere, for the sky was a dead black, and the stars had ceased to twinkle.'
}

export default function StyleCard (
  { styleClassName, name, description, sampleKey, sample, children, noBottomBorder, ...props }
) {
  const sampleTextOptions = SAMPLE_TEXT_OPTIONS
  const sampleText = children || sample || sampleTextOptions[sampleKey]
  let styleName = noBottomBorder ? 's.card s.no-bottom-border' : 's.card'
  let nameText = '.' + styleClassName
  if (name) nameText = `${name} (.${styleClassName})`
  function handleClick (event) {
    console.log(hyloAppTypographyStyles[styleClassName])
  }
  return (
    <div styleName={styleName} onClick={handleClick} {...props}>
      <div styleName='s.name'>
        {nameText}
      </div>
      <div styleName='s.attributes'>
        {description}
      </div>
      <div styleName='s.sample' className={hyloAppTypographyStyles[styleClassName]}>
        {sampleText}
      </div>
    </div>
  )
}
StyleCard.propTypes = {
  styleClassName: PropTypes.string,
  name: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.string,
  noBottomBorder: PropTypes.bool
}
