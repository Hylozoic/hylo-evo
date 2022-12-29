import React from 'react'
import { MemoryRouter } from 'react-router-dom'
import { shallow } from 'enzyme'
import MapExplorer from './MapExplorer'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('MapExplorer', () => {
  it('Matches Snapshot', () => {
    const wrapper = shallow(<MemoryRouter><MapExplorer
      centerLocation={{ lat: 35.442845, lng: 7.916598 }}
      fetchPosts={jest.fn()}
      fetchSavedSearches={jest.fn()}
      filters={{ featureTypes: { request: true, offer: true } }}
      groups={[]}
      hideDrawer={false}
      match={{ params: {} }}
      members={[]}
      postsForDrawer={[]}
      postsForMap={[]}
      routeParams={{}}
      topics={[]}
      zoom={0}
    /></MemoryRouter>)
    expect(wrapper).toMatchSnapshot()
  })

  it('has a TabBar', () => {
    const wrapper = shallow(<MapExplorer
      fetchPosts={jest.fn()}
      fetchSavedSearches={jest.fn()}
      filters={{ featureTypes: { request: true, offer: true } }}
      match={{ params: {} }}
      storeFetchPostsParam={jest.fn()}
    /></MemoryRouter>)
    expect(wrapper.find('TabBar')).toBeTruthy()
  })
})
