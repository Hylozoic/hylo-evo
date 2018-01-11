import { mapDispatchToProps, mergeProps } from './NetworkCommunitiesTab.connector'

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    const dispatch = jest.fn()
    const props = mapDispatchToProps(dispatch)
    expect(props).toMatchSnapshot()
    const networkId = 123
    props.createCommunity(networkId)()
    expect(dispatch.mock.calls).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('returns no-ops for addCommunityToNetwork and createCommunity with no network', () => {
    const dispatchProps = {
      addCommunityToNetwork: jest.fn(),
      createCommunity: jest.fn()
    }
    const ownProps = {
      network: {}
    }
    const mergedProps = mergeProps({}, dispatchProps, ownProps)
    mergedProps.addCommunityToNetwork()
    mergedProps.createCommunity()
    expect(dispatchProps.addCommunityToNetwork).not.toHaveBeenCalled()
    expect(dispatchProps.createCommunity).not.toHaveBeenCalled()
  })

  it('returns maps network id for addCommunityToNetwork and createCommunity with a network', () => {
    const dispatchProps = {
      addCommunityToNetwork: jest.fn(),
      createCommunity: jest.fn()
    }
    const networkId = 321
    const ownProps = {
      network: {
        id: networkId
      }
    }
    mergeProps({}, dispatchProps, ownProps)
    expect(dispatchProps.addCommunityToNetwork).toHaveBeenCalledWith(networkId)
    expect(dispatchProps.createCommunity).toHaveBeenCalledWith(networkId)
  })
})
