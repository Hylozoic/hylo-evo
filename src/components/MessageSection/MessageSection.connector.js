import { connect } from 'react-redux'
import getCurrentUser from 'store/selectors/getCurrentUser'

const updateThreadReadTime = () => {}

export function mapStateToProps (state) {
  return {
    currentUser: getCurrentUser(state)
  }
}

export const mapDispatchToProps = {
  updateThreadReadTime
}
export default connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
