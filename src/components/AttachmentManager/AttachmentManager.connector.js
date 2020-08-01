import { connect } from 'react-redux'
import getUploadPending from 'store/selectors/getUploadPending'
import getAttachmentsFromObject from 'store/selectors/getAttachmentsFromObject'

export function mapStateToProps (state, props) {
  return {
    uploading: getUploadPending(state, props),
    attachmentsFromObject: getAttachmentsFromObject(state, props)
  }
}

export default connect(mapStateToProps, null, null, { forwardRef: true })
