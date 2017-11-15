import { partitionCommunities, mapStateToProps } from './Drawer.connector'

describe('partitionCommunities', () => {
  it('separates independent communities from networked communities', () => {
    const memberships = [
      {
        community: {
          ref: {
            id: '1',
            name: 'one'
          },
          network: {
            ref: {
              id: '1',
              name: 'networkOne'
            }
          }
        }
      },
      {
        community: {
          ref: {
            id: '2',
            name: 'two'
          }
        }
      },
      {
        community: {
          ref: {
            id: '3',
            name: 'three'
          },
          network: {
            ref: {
              id: '2',
              name: 'networkTwo'
            }
          }
        }
      },
      {
        community: {
          ref: {
            id: '4',
            name: 'four'
          },
          network: {
            ref: {
              id: '1',
              name: 'networkOne'
            }
          }
        }
      },
      {
        community: {
          ref: {
            id: '5',
            name: 'five'
          }
        }
      }
    ]
    expect(partitionCommunities(memberships)).toMatchSnapshot()
  })
})

describe('mapStateToProps', () => {
  it('returns the right keys, adding All Communities link', () => {
    expect(mapStateToProps({})).toMatchSnapshot()
  })
})
