import { connect } from 'react-redux'
// import { getMe } from 'store/selectors/getMe'

const sampleTopics = [
  {
    name: 'announcements',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: false
  },
  {
    name: 'sustainable',
    followersTotal: 582,
    postsTotal: 1928,
    subscribed: true
  },
  {
    name: 'climate',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: false
  },
  {
    name: 'rally2017',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
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
