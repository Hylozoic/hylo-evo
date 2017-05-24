import { connect } from 'react-redux'
// import { getMe } from 'store/selectors/getMe'

const sampleTopics = [
  {
    id: '1',
    name: 'announcements',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: false
  },
  {
    id: '2',
    name: 'sustainable',
    followersTotal: 582,
    postsTotal: 1928,
    subscribed: true
  },
  {
    id: '3',
    name: 'climate',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: false
  },
  {
    id: '4',
    name: 'rally2017',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '5',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  }
]

export function mapStateToProps (state, props) {
  return {
    topics: sampleTopics
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
