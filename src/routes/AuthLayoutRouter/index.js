import { withResizeDetector } from 'react-resize-detector'
import component from './AuthLayoutRouter'
import connector from './AuthLayoutRouter.connector'

export default connector(withResizeDetector(component, { handleHeight: false }))
