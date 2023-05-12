import RemovableListItem from './RemovableListItem'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('RemovableListItem', () => {
  it('renders correctly', () => {
    const item = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<RemovableListItem item={item} url={'/happy/place'} removeItem={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('does not render as links when no URL specified', () => {
    const item = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<RemovableListItem item={item} removeItem={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('doesnt render a remove link', () => {
    const item = {
      id: 7,
      name: 'Zeus',
      avatarUrl: 'zeus.png'
    }
    const wrapper = shallow(<RemovableListItem item={item} url={'/happy/place'} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('remove item', () => {
    it('calls remove', () => {
      const props = {
        item: {
          id: 7,
          name: 'Zeus',
          avatarUrl: 'zeus.png'
        },
        url: '/happy/place',
        removeItem: jest.fn(),
        confirmMessage: 'Are you sure?'
      }

      global.confirm = jest.fn(() => true)

      const wrapper = shallow(<RemovableListItem {...props} />)
      wrapper.find('[data-stylename="remove-button"]').simulate('click')
      expect(global.confirm).toHaveBeenCalledWith(props.confirmMessage)
      expect(props.removeItem).toHaveBeenCalledWith(props.item.id)
    })

    it('skips confirm', () => {
      const props = {
        item: {
          id: 7,
          name: 'Zeus',
          avatarUrl: 'zeus.png'
        },
        skipConfirm: true,
        url: '/happy/place',
        removeItem: jest.fn(),
        confirmMessage: 'Are you sure?'
      }

      global.confirm = jest.fn(() => true)

      const wrapper = shallow(<RemovableListItem {...props} />)
      wrapper.find('[data-stylename="remove-button"]').simulate('click')
      expect(global.confirm).not.toHaveBeenCalledWith(props.confirmMessage)
      expect(props.removeItem).toHaveBeenCalledWith(props.item.id)
    })
  })
})
