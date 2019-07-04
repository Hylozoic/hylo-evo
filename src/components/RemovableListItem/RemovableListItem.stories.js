import React from 'react'
import { storiesOf } from '@storybook/react'
import RemovableListItem from './RemovableListItem'

class ExampleRemoveItem extends React.Component {
  state = {
    items: [
      { id: 1, name: 'item1' },
      { id: 2, name: 'item2', avatarUrl: 'http://www.xat.com/web_gear/chat/av/41.png' },
      { id: 3, name: 'item3' }
    ]
  }

  removeItem = (IDItemToDelete) => {
    this.setState({
      items: this.state.items.filter(item => (
        item.id !== IDItemToDelete
      ))
    })
  }

  render () {
    return (
      <>
        <br />
        <br />
        {this.state.items.map((item, i) =>
          <RemovableListItem
            item={item}
            removeItem={this.removeItem}
            key={i}
            skipConfirm
          />
        )
        }
      </>
    )
  }
}

storiesOf('RemovableListItem', module)
  .add('show', () => (
    <ExampleRemoveItem />
  ))
