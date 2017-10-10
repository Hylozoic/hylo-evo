import React from 'react'
import { shallow } from 'enzyme'
import Domain from './Domain'

describe('Domain', () => {
  it('renders correctly', () => {
    const communityDomain = 'communityDomain'
    const wrapper = shallow(<Domain
      communityDomain={communityDomain}
      goToNextStep={jest.fn()}
      goToPreviousStep={jest.fn()}
      addCommunityDomain={jest.fn()}
      fetchCommunity={jest.fn()}
      goHome={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('handleDomainChange', () => {
    it('tests uniqueness only if the slug is not valid', () => {
      const fetchCommunityExists = jest.fn()
      const node = shallow(<Domain {...{fetchCommunityExists}} />)
      const instance = node.instance()
      instance.handleDomainChange({
        target: {value: 'i am the greatest!'}
      })
      expect(fetchCommunityExists).not.toBeCalled()
      expect(node.state('communityDomainInvalid')).toBeTruthy()

      instance.handleDomainChange({
        target: {value: 'the-greatest'}
      })
      expect(fetchCommunityExists).toBeCalled()
      expect(node.state('communityDomainInvalid')).toBeFalsy()
    })
  })
})
