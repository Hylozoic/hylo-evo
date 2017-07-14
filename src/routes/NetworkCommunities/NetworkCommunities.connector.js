import { connect } from 'react-redux'
import {
  setSearch,
  setSort,
  getSearch,
  getSort
} from './NetworkCommunities.store'
// import getMe from 'store/selectors/getMe'

const network = {
  name: 'Lawyers For Good Government'
}

const communities = [
  {
    id: 1,
    name: 'Climate Change',
    memberCount: 4681,
    avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png'
  },
  {
    id: 2,
    name: 'Save the Bees',
    memberCount: 4681,
    avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png'
  },
  {
    id: 3,
    name: 'Stop Big Oil',
    memberCount: 4681,
    avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png'
  },
  {
    id: 4,
    name: "Women's March",
    memberCount: 4681,
    avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/community/1944/avatar/1489438401225_face.png'
  }
]

export function mapStateToProps (state, props) {
  const search = getSearch(state, props)
  const sortOption = getSort(state, props)
  return {
    network,
    communities,
    search,
    sortOption
  }
}

export const mapDispatchToProps = {
  setSearch,
  setSort
}

export default connect(mapStateToProps, mapDispatchToProps)
