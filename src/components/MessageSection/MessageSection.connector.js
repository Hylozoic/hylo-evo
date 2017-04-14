import { connect } from 'react-redux'
import { getMe } from 'store/selectors/getMe'

const updateThreadReadTime = () => {}

export function mapStateToProps (state) {
  return {
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = {
  updateThreadReadTime
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
