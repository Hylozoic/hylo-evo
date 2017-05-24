import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'

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
  },
  {
    id: '6',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '7',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '8',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '9',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '10',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '11',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  },
  {
    id: '12',
    name: 'organics',
    followersTotal: 671,
    postsTotal: 2171,
    subscribed: true
  }
]

export function mapStateToProps (state, props) {
  return {
    topics: sampleTopics,
    slug: getParam('slug', state, props),
    totalTopics: 25
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
