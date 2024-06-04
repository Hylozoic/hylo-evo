import React from 'react'
import './SliderInput.scss'

const SliderInput = ({ percentage = 0, setPercentage = () => {} }) => {
  const handleChange = (e) => {
    const newValue = Math.min(Math.max(0, parseInt(e.target.value)), 100)
    setPercentage(newValue)
  }

  const sliderStyle = {
    background: `linear-gradient(to right, #D9EBF8 ${percentage}%, #c4c4c4 ${percentage}%)`
  }

  return (
    <div styleName='percentage-slider-container'>
      <input
        type='range'
        min='0'
        max='100'
        value={percentage}
        onChange={handleChange}
        styleName='percentage-slider'
        style={sliderStyle}
      />
      <span>{percentage}%</span>
    </div>
  )
}

export default SliderInput
