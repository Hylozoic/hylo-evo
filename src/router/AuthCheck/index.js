import { withRouter } from 'react-router-dom'
import connector from './AuthCheck.connector'
import component from './AuthCheck'

// withRouter is necessary here, and it's necessary for it to wrap the
// connector. otherwise, the routing components that are descendants of this
// component will not receive updates about route changes. see the "Important
// Note" at [1] for more info.
//
// [1]: https://reacttraining.com/react-router/web/api/withRouter
//
export default withRouter(connector(component))
