import { connect } from 'react-redux'
// import { getMe } from 'store/selectors/getMe'

const sampleCommunity = {
  name: 'Hylo on Hylo',
  slug: 'hylo'
}

export function mapStateToProps (state, props) {
  return {
    community: sampleCommunity
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchCommunitySettings: () => console.log('fetchCommunitySettings')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
