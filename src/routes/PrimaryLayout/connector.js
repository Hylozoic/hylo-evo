import { connect } from 'react-redux'
import { SAMPLE_COMMUNITY } from 'routes/Feed/sampleData'

const SAMPLE_USER = {
  id: '1',
  firstName: 'Axolotl',
  lastName: 'Jones',
  avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/user/13986/avatar/1444260480878_AxolotlPic.png'
}

function mapStateToProps (state) {
  return {
    community: SAMPLE_COMMUNITY,
    currentUser: SAMPLE_USER
  }
}

function mapDispatchToProps (dispatch, props) {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)
