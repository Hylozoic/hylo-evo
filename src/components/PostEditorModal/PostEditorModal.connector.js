import { connect } from 'react-redux'
import { push } from 'react-router-redux'

export const mapDispatchToProps = (dispatch, props) => {
  const { match, forNew } = props
  let closeUrl
  if (match && forNew) {
    // go back to the feed
    closeUrl = match.url.replace('/p/new', '')
    closeUrl = match.url.replace('/project/new', '/project')
  } else if (match) {
    // go back to the feed + expanded post
    closeUrl = match.url.replace('/edit', '')
  }
  return {
    hidePostEditor: () => dispatch(push(closeUrl))
  }
}

export default connect(null, mapDispatchToProps)
