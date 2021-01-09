import React from 'react'
import { shallow } from 'enzyme'
import Domain from './Domain'

describe('Domain', () => {
  it('renders correctly', () => {
    const groupDomain = 'groupDomain'
    const wrapper = shallow(<Domain
      groupDomain={groupDomain}
      goToNextStep={jest.fn()}
      goToPreviousStep={jest.fn()}
      addGroupDomain={jest.fn()}
      fetchGroup={jest.fn()}
      goHome={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('handleDomainChange', () => {
    it('tests uniqueness only if the slug is not valid', () => {
      const fetchGroupExists = jest.fn()
      const node = shallow(<Domain {...{ fetchGroupExists }} />)
      const instance = node.instance()
      instance.handleDomainChange({
        target: { value: 'i am the greatest!' }
      })
      expect(fetchGroupExists).not.toBeCalled()
      expect(node.state('groupDomainInvalid')).toBeTruthy()

      instance.handleDomainChange({
        target: { value: 'the-greatest' }
      })
      expect(fetchGroupExists).toBeCalled()
      expect(node.state('groupDomainInvalid')).toBeFalsy()
    })
  })
})
