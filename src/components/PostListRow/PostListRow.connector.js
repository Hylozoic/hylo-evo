import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl } from 'util/navigation'

export function mapDispatchToProps (dispatch, props) {
  const { post, routeParams, querystringParams } = props

  return {
    showDetails: () => dispatch(push(postUrl(post.id, routeParams, querystringParams))),
  }
}

export default connect(() => ({}), mapDispatchToProps)
