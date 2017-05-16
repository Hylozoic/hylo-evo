import { connect } from 'react-redux'
import { goBack, push } from 'react-router-redux'
import { withRouter } from 'react-router-dom'

export const mapDispatchToProps = {
  goBack,
  push
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { goBack, push } = dispatchProps
  const { history } = ownProps

  const onClose = history.length > 2
    ? () => goBack()
    : () => push('/')

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    onClose
  }
}

export default component => withRouter(connect(null, mapDispatchToProps, mergeProps)(component))
