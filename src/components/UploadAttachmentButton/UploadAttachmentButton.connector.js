import { connect } from 'react-redux'
import uploadAttachment from 'store/actions/uploadAttachment'

export function mapStateToProps (state, props) {
  return {}
}

export const mapDispatchToProps = {
  uploadAttachment
}

export default connect(mapStateToProps, mapDispatchToProps)
