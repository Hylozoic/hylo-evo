import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'

export function mapStateToProps (state) {
  return {
    currentUser: getMe(state),
//  TODO: move this into actions
    updateThreadReadTime: () => {}
  }
}

export const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
