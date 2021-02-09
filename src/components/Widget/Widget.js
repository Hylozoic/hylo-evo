import React, { useState } from 'react'
import Icon from 'components/Icon'
import VisibilityToggle from 'components/VisibilityToggle'
import './Widget.scss'

export default class Widget extends React.Component {
  constructor(props) {
    super(props)
    this.state = { editing: false }
  }

  setEditing = () => this.setState({ editing: !this.state.editing })
  
  render() {
    const { toggleVisibility, id, isVisible, name } = this.props
    const { editing } = this.state

    return (
      <div styleName='widget'>
        <div styleName='header'>
          <div>{name}</div>
          <div styleName='more'>
            <Icon name='More' styleName={`more ${editing ? 'selected' : ''}`} onClick={this.setEditing} />
            <div styleName={`edit-section ${editing ? 'visible' : ''}`}>
              <span styleName='triangle'>&nbsp;</span>
              <VisibilityToggle id={id} checked={isVisible} onChange={toggleVisibility} backgroundColor={isVisible ? '#0DC39F' : '#8B96A4'} /> Visibility: Visible
            </div>
          </div>
        </div>

        <div styleName={`content ${isVisible ? '' : 'hidden'}`}>
          {isVisible ? this.props.children : <HiddenWidget isVisible={isVisible} name={name}/>}
        </div>
      </div>
    )
  }
}

const HiddenWidget = ({ isVisible, name }) => {
  return (
    <div>
      <div>Visibility: {!!isVisible ? 'Visible' : 'Hidden'}</div>
      <div>The {name} section is not visible to members of this community</div>
    </div>
  )
}