import React from 'react'
import { shallow } from 'enzyme'
import Template from './Template'

describe('Template', () => {
  const templateId = '1'
  const defaultTopics = ['cheese']
  const communityTemplates = [{ id: 1, displayName: 'Farm' }]
  it('renders correctly', () => {
    const wrapper = shallow(<Template
      communityTemplates={communityTemplates}
      defaultTopics={defaultTopics}
      templateId={templateId}
      addCommunityTemplate={jest.fn()}
      addDefaultTopic={jest.fn()}
      removeDefaultTopic={jest.fn()}
      setDefaultTopics={jest.fn()}
      goToNextStep={jest.fn()}
      goToPreviousStep={jest.fn()}
      fetchCommunityTemplates={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
