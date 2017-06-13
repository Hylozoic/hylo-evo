import Search from './Search'
import { shallow } from 'enzyme'
import React from 'react'

describe('Search', () => {
  it('matches the latest snapshot', () => {
    const props = {
      searchForInput: 'cat',
      fetchMoreSearchResults: () => {},
      showPostDetails: () => {},
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
