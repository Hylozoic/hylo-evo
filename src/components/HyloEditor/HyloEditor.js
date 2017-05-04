import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from './hashtagPlugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import contentStateToHTML from './contentStateToHTML'
import contentStateFromHTML from './contentStateFromHTML'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import './HyloEditor.scss'

const mentionPlugin = createMentionPlugin({
  // TODO: Map to local CSS Modules stylesheet (copy from plugin)
  // theme: styles
})

const hashtagPlugin = createHashtagPlugin({
  entityMutability: 'IMMUTABLE'
})

const linkifyPlugin = createLinkifyPlugin()

const { MentionSuggestions } = mentionPlugin
const { CompletionSuggestions: HashtagSuggestions } = hashtagPlugin

const plugins = [
  mentionPlugin,
  hashtagPlugin,
  linkifyPlugin
]

export default class HyloEditor extends Component {
  static propTypes = {
    contentHTML: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    submitOnReturnHandler: PropTypes.func,
    findMentions: PropTypes.func.isRequired,
    clearMentions: PropTypes.func.isRequired,
    findHashtags: PropTypes.func.isRequired,
    clearHashtags: PropTypes.func.isRequired,
    mentionResults: PropTypes.instanceOf(Immutable.List),
    hashtagResults: PropTypes.instanceOf(Immutable.List)
  }

  static defaultProps = {
    contentHTML: '',
    mentionResults: Immutable.List(),
    hashtagResults: Immutable.List()
  }

  defaultState = ({ contentHTML }) => {
    return {
      editorState: this.getEditorStateFromHTML(contentHTML),
      submitOnReturnEnabled: true
    }
  }

  constructor (props) {
    super(props)
    this.state = this.defaultState(props)
  }

  componentDidUpdate (prevProps) {
    if (this.props.contentHTML !== prevProps.contentHTML) {
      this.setState(this.defaultState(this.props))
    }
  }

  reset = () => {
    this.setState({editorState: this.getEditorStateFromHTML('')})
  }

  isEmpty = () =>
    !this.state.editorState.getCurrentContent().hasText()

  getEditorStateFromHTML = (contentHTML) => {
    const contentState = contentStateFromHTML(
      ContentState.createFromText(''), contentHTML
    )
    // Don't push don't create new EditorState once one has already been created as per:
    // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md
    return this.state && this.state.editorState
      ? EditorState.push(this.state.editorState, contentState)
      : EditorState.createWithContent(contentState)
  }

  getContentHTML = () => {
    const { editorState } = this.state
    return contentStateToHTML(editorState.getCurrentContent())
  }

  getContentRaw = () => {
    const { editorState } = this.state
    return convertToRaw(editorState.getCurrentContent())
  }

  setEditorStateFromContentState = (contentState) => {
    this.setState({editorState: EditorState.push(this.state.editorState, contentState)})
  }

  handleChange = (editorState) => {
    this.setState({ editorState })
    if (this.props.onChange) this.props.onChange(editorState)
  }

  handleMentionsSearch = ({ value }) => {
    return this.props.findMentions(value)
  }

  handleHashtagSearch = ({ value }) => {
    return this.props.findHashtags(value)
  }

  handleReturn = (event) => {
    const { submitOnReturnHandler } = this.props
    if (submitOnReturnHandler && this.state.submitOnReturnEnabled) {
      if (!event.shiftKey) {
        submitOnReturnHandler(this.getContentHTML())
        this.setState({
          editorState: EditorState.moveFocusToEnd(EditorState.createEmpty())
        })
        return 'handled'
      }
      return 'not-handled'
    }
  }

  enableSubmitOnReturn = () => {
    this.setState({submitOnReturnEnabled: true})
  }

  disableSubmitOnReturn = () => {
    this.setState({submitOnReturnEnabled: false})
  }

  handleMentionsClose = () => {
    this.props.clearMentions()
    this.enableSubmitOnReturn()
    return true
  }

  focus = () => this.editor && this.editor.focus()

  render () {
    return <div styleName='wrapper' className={this.props.className}>
      <Editor
        editorState={this.state.editorState}
        onChange={this.handleChange}
        placeholder={this.props.placeholder}
        handleReturn={this.handleReturn}
        plugins={plugins}
        ref={component => { this.editor = component }} />
      <MentionSuggestions
        onSearchChange={this.handleMentionsSearch}
        suggestions={this.props.mentionResults}
        onOpen={this.disableSubmitOnReturn}
        onClose={this.handleMentionsClose} />
      <HashtagSuggestions
        onSearchChange={this.handleHashtagSearch}
        suggestions={this.props.hashtagResults}
        onOpen={this.disableSubmitOnReturn}
        onClose={this.enableSubmitOnReturn} />
    </div>
  }
}
