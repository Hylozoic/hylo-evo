import cx from 'classnames'
import { isEmpty, omit } from 'lodash/fp'
import PropTypes from 'prop-types'
import React from 'react'
import { withTranslation } from 'react-i18next'
import { getKeyCode, keyMap } from 'util/textInput'

import classes from './KeyControlledList.module.scss'

const { array, func, object, bool, number } = PropTypes

const propsToOmit = ['onChange', 'tabChooses', 'spaceChooses', 'selectedIndex', 'items', 'theme', 'tagType', 'renderListItem']

class KeyControlledList extends React.Component {
  static propTypes = {
    onChange: func,
    children: array,
    selectedIndex: number,
    tabChooses: bool,
    spaceChooses: bool,
    theme: object
  }

  static defaultProps = {
    selectedIndex: 0,
    tabChooses: false,
    theme: {
      items: null,
      item: null,
      'item-active': null
    }

  }

  constructor (props) {
    super(props)
    const { selectedIndex } = props
    this.state = { selectedIndex }
  }

  componentWillReceiveProps (nextProps) {
    const max = nextProps.children.length - 1
    if (this.state.selectedIndex > max) {
      this.setState({ selectedIndex: max })
    }
  }

  changeSelection = delta => {
    if (isEmpty(this.props.children)) return

    let i = this.state.selectedIndex
    const length = React.Children.count(this.props.children)

    i += delta
    if (i < 0) i += length
    i = i % length

    this.setState({ selectedIndex: i })
  }

  // this method is called from other components
  // returning true indicates that the event has been handled
  handleKeys = event => {
    const chooseCurrentItem = () => {
      if (isEmpty(this.props.children)) return false

      const elementChoice = this.childrenWithRefs[this.state.selectedIndex]
      if (elementChoice) {
        const nodeChoice = this.refs[elementChoice.ref]
        this.change(elementChoice, nodeChoice, event)
        return true
      }

      event.preventDefault()
      return false
    }

    switch (getKeyCode(event)) {
      case keyMap.UP:
        event.preventDefault()
        this.changeSelection(-1)
        return true
      case keyMap.DOWN:
        event.preventDefault()
        this.changeSelection(1)
        return true
      case keyMap.TAB:
        if (this.props.tabChooses) return chooseCurrentItem()
        break
      case keyMap.SPACE:
        // FIXME we should be consistent with defaults, so either change this or
        // tabChooses above
        if (this.props.spaceChooses !== false) return chooseCurrentItem()
        break
      case keyMap.ENTER:
        return chooseCurrentItem()
    }

    return false
  }

  change = (element, node, event) => {
    event.preventDefault()
    this.props.onChange(element, node, event)
  }

  // FIXME use more standard props e.g. {label, value} instead of {id, name}, or
  // provide an API for configuring them
  render () {
    const { selectedIndex } = this.state

    // FIXME To make this more generic, replace tagType with props for headerText and countText,
    // then check if the item has a .count field to know whether to show a count or not.
    const { tagType, theme, children, ...props } = this.props

    this.childrenWithRefs = React.Children.map(children,
      (element, i) => {
        const active = selectedIndex === i
        const className = cx(
          theme.item,
          { [theme['item-active']]: active }
        )
        return element && element.props
          ? React.cloneElement(element, { ref: i, className })
          : element
      })

    return <div className={classes.keyListContainer}>
      {tagType && tagType === 'groups' && <div className={classes.keyListLabel}>{this.props.t('Groups')}</div>}
      <ul {...omit(propsToOmit, props)} className={cx(theme.items, classes.keyList)}>
        {this.childrenWithRefs}
      </ul>
    </div>
  }
}

export default withTranslation()(KeyControlledList)
