import { withResizeDetector } from 'react-resize-detector'
import component from './Comments'
import connector from './Comments.connector'

export default connector(withResizeDetector(component, { handleHeight: false }))
