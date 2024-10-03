import { connect } from 'react-redux'
import { push } from "redux-first-history";
import { postUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  return { }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    showDetails: () =>
      dispatch(push(postUrl(props.comment.post.id, props.routeParams)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
