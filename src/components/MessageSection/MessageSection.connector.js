import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'
import { updateThreadReadTime } from './MessageSection.store'

export function mapStateToProps (state) {
  return {
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = {
  updateThreadReadTime
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
