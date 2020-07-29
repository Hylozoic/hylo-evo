import { mapDispatchToProps, mapStateToProps } from './Template.connector'

const dispatch = jest.fn(x => x)
const props = { match: { params: { networkId: '1' } } }
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Template.connector', () => {
  it('should call fetchCommunityTemplates from mapDispatchToProps', () => {
    expect(dispatchProps.fetchCommunityTemplates()).toMatchSnapshot()
  })

  it('should call goToNextStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToNextStep()).toMatchSnapshot()
  })

  it('should call goToPreviousStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToPreviousStep()).toMatchSnapshot()
  })

  it('should call addCommunityTemplate from mapDispatchToProps', () => {
    expect(dispatchProps.addCommunityTemplate(1)).toMatchSnapshot()
  })

  it('should call addDefaultTopic from mapDispatchToProps', () => {
    expect(dispatchProps.addDefaultTopic('food')).toMatchSnapshot()
  })

  it('should call removeDefaultTopic from mapDispatchToProps', () => {
    expect(dispatchProps.removeDefaultTopic('food')).toMatchSnapshot()
  })

  it('should call setDefaultTopics from mapDispatchToProps', () => {
    expect(dispatchProps.setDefaultTopics(['food', 'cheese'])).toMatchSnapshot()
  })

  it('should have communityTemplates, defaultTopics and templateId in mapStateToProps', () => {
    const communityTemplates = [{ id: 1, displayName: 'Farm' }]
    const templateId = 1
    const defaultTopics = ['food']
    const state = {
      CreateCommunity: {
        templateId,
        defaultTopics,
        communityTemplates
      }
    }
    expect(mapStateToProps(state, props).defaultTopics).toBe(defaultTopics)
    expect(mapStateToProps(state, props).templateId).toBe(templateId)
    expect(mapStateToProps(state, props).communityTemplates).toEqual(communityTemplates.concat({ id: -1, displayName: 'Other' }))
  })
})
