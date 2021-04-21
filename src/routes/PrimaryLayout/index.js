import { withResizeDetector } from 'react-resize-detector'
import component from './PrimaryLayout'
import connector from './PrimaryLayout.connector'
export default connector(withResizeDetector(component, { handleHeight: false }))
