import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { get, omit } from 'lodash/fp'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { addQuerystringToPath, baseUrl, postUrl } from 'util/navigation'

export const mapDispatchToProps = (dispatch, props) => {
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)

  if (!routeParams) return {}

  const { postId } = routeParams
  const urlParams = omit(['postId', 'action'], routeParams)
  const closeUrl = postId
    ? postUrl(postId, urlParams, querystringParams)
    : addQuerystringToPath(baseUrl(urlParams), querystringParams)
  const closeModal = () => dispatch(push(closeUrl))

  return {
    closeModal,
    confirmLeaveCreateModal: () => {
      if (window.confirm(`Are you sure you want to exit? You will lose all the information you have entered`)) {
        closeModal()
      }
    }
  }
}

export default connect(null, mapDispatchToProps)
