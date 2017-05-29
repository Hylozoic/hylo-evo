import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'
import { setFullPageModalModified } from './FullPageModal.store'

export function mapStateToProps (state, props) {
  return {
    modified: state.FullPageModalModified
  }
}

export const mapDispatchToProps = {
  goBack,
  push,
  setFullPageModalModified
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { goBack, push, setFullPageModalModified } = dispatchProps
  const { history } = ownProps
  const { modified } = stateProps

  const navigate = history.length > 2
    ? () => goBack()
    : () => push('/')

  const onClose = modified
    ? () => {
      if (window.confirm('You have unsaved changes, are you sure you want to leave?')) {
        setFullPageModalModified(false)
        navigate()
      }
    }
    : navigate

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onClose
  }
}

export default component => withRouter(connect(mapStateToProps, mapDispatchToProps, mergeProps)(component))
