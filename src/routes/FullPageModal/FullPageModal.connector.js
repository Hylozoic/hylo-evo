import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { withRouter } from 'react-router-dom'
import { get } from 'lodash/fp'
import getPreviousLocation from 'store/selectors/getPreviousLocation'
import { setConfirmBeforeClose } from './FullPageModal.store'

export function mapStateToProps (state, props) {
  return {
    confirmMessage: get('FullPageModal.confirm', state),
    previousLocation: getPreviousLocation(state)
  }
}

export const mapDispatchToProps = {
  navigate: push,
  setConfirmBeforeClose
}

export default component => withRouter(connect(mapStateToProps, mapDispatchToProps)(component))
