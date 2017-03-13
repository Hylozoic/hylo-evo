import CSSModules from 'react-css-modules'
import component from './component'
import styles from './component.scss'

export default CSSModules(styles, {allowMultiple: true})(component)
