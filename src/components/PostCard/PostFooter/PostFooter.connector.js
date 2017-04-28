import { connect } from 'react-redux'
import { voteOnPost } from './PostFooter.store.js'
// import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  return {}
}

export function mapDispatchToProps (dispatch, props) {
  return {
    vote: () => dispatch(voteOnPost(props.id))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
