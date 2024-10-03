import { connect } from 'react-redux'
import { push } from 'redux-first-history'
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

export default component => connect(mapStateToProps, mapDispatchToProps)(component)
