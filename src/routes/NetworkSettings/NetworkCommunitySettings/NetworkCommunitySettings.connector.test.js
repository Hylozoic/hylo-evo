import { mapStateToProps, mapDispatchToProps, mergeProps } from './NetworkCommunitySettings.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const props = {
      network: {
        slug: 'nslug'
      }
    }
    expect(mapStateToProps({}, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('matches snapshot', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})

describe('mergeProps', () => {
  it('binds community.slug to fetchCommunitySettings', () => {
    const dispatchProps = {
      fetchCommunitySettings: jest.fn()
    }
    const slug = 'seaslug'
    const stateProps = {
      community: {
        slug
      }
    }

    const mergedProps = mergeProps(stateProps, dispatchProps)
    mergedProps.fetchCommunitySettings()
    expect(dispatchProps.fetchCommunitySettings).toHaveBeenCalledWith(slug)
  })

  it('binds community.id to updateCommunitySettings', () => {
    const dispatchProps = {
      updateCommunitySettings: jest.fn()
    }
    const id = 456
    const stateProps = {
      community: {
        id
      }
    }

    const mergedProps = mergeProps(stateProps, dispatchProps)
    const changes = {hidden: true}
    mergedProps.updateCommunitySettings(changes)
    expect(dispatchProps.updateCommunitySettings).toHaveBeenCalledWith(id, changes)
  })
})
