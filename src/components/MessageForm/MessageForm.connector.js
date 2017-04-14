import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import {
  getTextForMessageThread,
  createMessage,
  updateText
} from './MessageForm.store'

export function mapStateToProps (state, props) {
  return {
    text: getTextForMessageThread(state, props),
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = {
  createMessage,
  updateText
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
