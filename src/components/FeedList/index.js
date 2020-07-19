import { withResizeDetector } from 'react-resize-detector'
import component from './FeedList'
import connector from './FeedList.connector'

export default connector(withResizeDetector(component, { handleHeight: false }))
