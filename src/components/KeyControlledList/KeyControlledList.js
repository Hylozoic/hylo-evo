import PropTypes from 'prop-types'
import React from 'react'
import { indexOf, isEmpty, omit } from 'lodash/fp'
import cx from 'classnames'
import { getKeyCode, keyMap } from 'util/textInput'
import Icon from 'components/Icon'
import './KeyControlledList.scss'
import { accessibilityIcon, visibilityIcon } from 'store/models/Group'

const { array, func, object, bool, number, string } = PropTypes

const propsToOmit = ['onChange', 'tabChooses', 'spaceChooses', 'selectedIndex', 'items', 'theme', 'tagType', 'renderListItem']

export default class KeyControlledList extends React.Component {
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
    let { selectedIndex } = props
    this.state = { selectedIndex }
  }

  componentWillReceiveProps (nextProps) {
    var max = nextProps.children.length - 1
    if (this.state.selectedIndex > max) {
      this.setState({ selectedIndex: max })
    }
  }

  changeSelection = delta => {
    if (isEmpty(this.props.children)) return

    var i = this.state.selectedIndex
    var length = React.Children.count(this.props.children)

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

    return <div styleName='keyListContainer'>
      {tagType && tagType === 'groups' && <div styleName='keyListLabel'>Groups</div>}
      <ul {...omit(propsToOmit, props)} className={theme.items} styleName='keyList'>
        {this.childrenWithRefs}
      </ul>
    </div>
  }
}

export class KeyControlledItemList extends React.Component {
  static propTypes = {
    onChange: func.isRequired,
    items: array,
    selected: object,
    tabChooses: bool,
    theme: object,
    className: string,
    renderListItem: func
  }

  static defaultProps = {
    theme: {
      items: null,
      item: null,
      'item-active': null
    }
  }

  // this method is called from other components
  handleKeys = event => {
    return this.refs.kcl.handleKeys(event)
  }

  change = (choice, event) => {
    event.preventDefault()
    this.props.onChange(choice, event)
  }

  onChangeExtractingItem = (element, node, event) => {
    const item = this.props.items[element.ref]
    this.change(item, event)
  }

  // FIXME use more standard props e.g. {label, value} instead of {id, name}, or
  // provide an API for configuring them
  render () {
    const { items, selected, theme, tagType } = this.props
    const selectedIndex = indexOf(selected, items)

    const renderListItem = this.props.renderListItem
      ? item => this.props.renderListItem({ item, handleChoice: this.change })
      : item => <li className={theme.item} key={item.id || 'blank'}>
        <a onClick={event => this.change(item, event)}>
          <div>
            <span>{item.name}</span>
          </div>
          {tagType && tagType === 'groups' && <div styleName='keyListMemberCount'><div><Icon name='Members' styleName='keyListPrivacyIcon' /> {item.memberCount} {item.memberCount !== 1 ? 'Members' : 'Member'}</div><div><Icon name={accessibilityIcon(item.accessibility)} styleName='keyListPrivacyIcon' /> <Icon name={visibilityIcon(item.visibility)} styleName='keyListPrivacyIcon' /></div></div>}
        </a>
      </li>

    const listItems = items.map(renderListItem)

    return <KeyControlledList
      theme={theme}
      tagType={tagType}
      children={listItems}
      ref='kcl'
      tabChooses
      selectedIndex={selectedIndex}
      onChange={this.onChangeExtractingItem}
      {...omit('onChange', this.props)} />
  }
}
