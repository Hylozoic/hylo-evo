import React from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { indexOf, omit } from 'lodash/fp'
import Icon from 'components/Icon'
import { accessibilityIcon, visibilityIcon } from 'store/models/Group'
import KeyControlledList from './KeyControlledList'
import './KeyControlledItemList.scss'

const { array, func, object, bool, string } = PropTypes

class KeyControlledItemList extends React.Component {
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
            <span>{item.name || item.title}</span>
          </div>
          {tagType && tagType === 'groups' && <div styleName='keyListMemberCount'><div><Icon name='Members' styleName='keyListPrivacyIcon' /> {item.memberCount} {this.props.t('Member', { count: item.memberCount })}</div><div><Icon name={accessibilityIcon(item.accessibility)} styleName='keyListPrivacyIcon' /> <Icon name={visibilityIcon(item.visibility)} styleName='keyListPrivacyIcon' /></div></div>}
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

export default withTranslation()(KeyControlledItemList)
