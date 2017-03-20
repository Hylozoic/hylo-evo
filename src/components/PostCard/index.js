import CSSModules from 'react-css-modules'
import component from './component'
import connector from './connector'
import styles from './component.scss'

export default connector(CSSModules(styles, {allowMultiple: true})(component))
