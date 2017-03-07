import React, { PropTypes } from 'react'
import hyloAppTypographyStyles from 'app/css/typography.scss'

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
  let styleName = noBottomBorder ? 'card card--no-bottom-border' : 'card'
  let nameText = '.' + styleClassName
  if (name) nameText = `${name} (.${styleClassName})`
  function handleClick (event) {
    console.log(hyloAppTypographyStyles[styleClassName])
  }
  return (
    <div styleName={styleName} onClick={handleClick} {...props}>
      <div styleName='name'>
        {nameText}
      </div>
      <div styleName='attributes'>
        {description}
      </div>
      <div styleName='sample' className={hyloAppTypographyStyles[styleClassName]}>
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
