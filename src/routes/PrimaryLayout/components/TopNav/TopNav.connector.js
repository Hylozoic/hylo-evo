import { connect } from 'react-redux'
import { logout } from 'routes/Login/Login.store'
import { toggleDrawer } from 'routes/PrimaryLayout/PrimaryLayout.store'
import { setTopNavPosition } from './TopNav.store.js'
export default connect(null, {logout, toggleDrawer, setTopNavPosition})
