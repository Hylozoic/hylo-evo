import CSSModules from 'react-css-modules'
import component from './component'
import styles from './component.scss'
import { withRouter } from 'react-router'

export default withRouter(CSSModules(styles, {allowMultiple: true})(component))
