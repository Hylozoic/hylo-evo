import Search, { PersonCard } from './Search'
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
describe('Search', () => {
  it('matches the latest snapshot', () => {
    const props = {
      searchForInput: 'cat',
      fetchMoreSearchResults: () => {},
      setSearchTerm: () => {},
      updateQueryParam: () => {},
      setSearchFilter: () => {},
      showPerson: () => {},
      filter: 'person',
      pending: true,
      searchResults: [
        {
          id: '1'
        }
      ]
    }

    const wrapper = shallow(<Search {...props} />)

    expect(wrapper).toMatchSnapshot()
  })
})

describe('PersonCard', () => {
  const props = {
    person: {
      id: 77,
      name: 'Joe Person',
      avatarUrl: 'me.png',
      location: 'home',
      skills: [{ name: 'crawling' }, { name: 'walking' }]
    },
    highlightProps: {
      terms: ['cat']
    },
    showPerson: () => {}
  }

  it('renders correctly', () => {
    const wrapper = shallow(<PersonCard {...props} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('renders a skill when the search terms match a skill', () => {
    const highlightProps = {
      terms: ['walking']
    }
    const wrapper = shallow(<PersonCard {...{ ...props, highlightProps }} />)

    expect(wrapper).toMatchSnapshot()
  })
})
