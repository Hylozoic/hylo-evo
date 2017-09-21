import { connect } from 'react-redux'
import { logout } from 'routes/NonAuthLayout/Login/Login.store'
import { toggleDrawer } from 'routes/AuthLayout/AuthLayout.store'
import { setTopNavPosition } from './TopNav.store.js'
export default connect(null, {logout, toggleDrawer, setTopNavPosition})
