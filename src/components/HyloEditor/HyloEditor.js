import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import { EditorState, ContentState, convertToRaw } from 'draft-js'
import cx from 'classnames'
import contentStateToHTML from './contentStateToHTML'
import contentStateFromHTML from './contentStateFromHTML'
import 'draft-js/dist/Draft.css'
import { validateTopicName } from 'hylo-utils/validators'
import styles from './HyloEditor.scss'

export default class HyloEditor extends Component {
  static propTypes = {
    contentHTML: PropTypes.string,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    submitOnReturnHandler: PropTypes.func,
    readOnly: PropTypes.bool,
    findMentions: PropTypes.func.isRequired,
    clearMentions: PropTypes.func.isRequired,
    findTopics: PropTypes.func.isRequired,
    clearTopics: PropTypes.func.isRequired,
    mentionResults: PropTypes.array,
    topicResults: PropTypes.array
  }

  static defaultProps = {
    contentHTML: '',
    readOnly: false,
    mentionResults: [],
    topicResults: [],
    themes: {
      base: {
        mention: styles.mention,
        mentionSuggestions: styles.mentionSuggestionsPostEditor,
        mentionSuggestionsEntry: styles.mentionSuggestionsEntry,
        mentionSuggestionsEntryFocused: styles.mentionSuggestionsEntryFocused,
        mentionSuggestionsEntryText: styles.mentionSuggestionsEntryText,
        mentionSuggestionsEntryAvatar: styles.mentionSuggestionsEntryAvatar
      },
      PostEditor: {
        mentionSuggestions: styles.mentionSuggestionsPostEditor
      },
      CommentForm: {
        mentionSuggestions: styles.mentionSuggestionsCommentForm
      }
    }
  }

  defaultState = ({ contentHTML }) => {
    return {
      editorState: this.getEditorStateFromHTML(contentHTML),
      submitOnReturnEnabled: true
    }
  }

  constructor (props) {
    super(props)
    // https://github.com/draft-js-plugins/draft-js-plugins/issues/298
    const { themes } = this.props
    this._mentionsPlugin = createMentionPlugin({
      theme: Object.assign(themes.base, themes[this.props.parentComponent])
    })
    this._topicsPlugin = createMentionPlugin({
      mentionTrigger: '#',
      mentionPrefix: '#',
      theme: {
        mention: styles.topic,
        mentionSuggestions: styles['topicSuggestions' + props.parentComponent],
        mentionSuggestionsEntry: styles.topicSuggestionsEntry,
        mentionSuggestionsEntryFocused: styles.topicSuggestionsEntryFocused,
        mentionSuggestionsEntryText: styles.topicSuggestionsEntryText,
        mentionSuggestionsEntryAvatar: styles.topicSuggestionsEntryAvatar
      }
    })
    this._linkifyPlugin = createLinkifyPlugin()
    this.editor = React.createRef()
    this.state = this.defaultState(props)
  }

  componentDidUpdate (prevProps) {
    if (this.props.contentHTML !== prevProps.contentHTML) {
      this.setState(this.defaultState(this.props))
    }
  }

  reset = () => {
    this.setState({ editorState: this.getEditorStateFromHTML('') })
  }

  isEmpty = () =>
    !this.state.editorState.getCurrentContent().hasText()

  getEditorStateFromHTML = (contentHTML) => {
    const contentState = contentStateFromHTML(
      ContentState.createFromText(''), contentHTML
    )
    // Don't create new EditorState once one has already been created as per:
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
    this.setState({ editorState: EditorState.push(this.state.editorState, contentState) })
  }

  handleChange = (editorState) => {
    const contentStateChanged =
      this.state.editorState.getCurrentContent() !== editorState.getCurrentContent()
    if (this.props.onChange) this.props.onChange(editorState, contentStateChanged)
    this.setState({ editorState })
  }

  handleMentionsSearch = ({ value }) => {
    return this.props.findMentions(value)
  }

  handleTopicSearch = ({ value }) => {
    this.setState({
      topicSearch: value
    })
    return this.props.findTopics(value)
  }

  handleReturn = (event) => {
    const { submitOnReturnHandler } = this.props
    const { editorState } = this.state
    if (submitOnReturnHandler && this.state.submitOnReturnEnabled) {
      if (!event.shiftKey) {
        submitOnReturnHandler(editorState)
        this.setState({
          editorState: EditorState.moveFocusToEnd(EditorState.createEmpty())
        })
        return 'handled'
      }
      return 'not-handled'
    }
  }

  enableSubmitOnReturn = () => {
    this.setState({ submitOnReturnEnabled: true })
  }

  disableSubmitOnReturn = () => {
    this.setState({ submitOnReturnEnabled: false })
  }

  handleMentionsClose = () => {
    this.props.clearMentions()
    this.enableSubmitOnReturn()
    return true
  }

  handleTopicsClose = () => {
    this.props.clearTopics()
    this.enableSubmitOnReturn()
    return true
  }

  focus = () => this.editor.current && this.editor.current.focus()

  render () {
    const { MentionSuggestions } = this._mentionsPlugin
    const { MentionSuggestions: TopicSuggestions } = this._topicsPlugin
    const plugins = [
      this._mentionsPlugin,
      this._topicsPlugin,
      this._linkifyPlugin
    ]
    const { placeholder, mentionResults, topicResults, className, readOnly } = this.props
    const { topicSearch } = this.state
    const topicSuggestions = !validateTopicName(topicSearch)
      ? [{ id: -1, name: topicSearch }].concat(topicResults)
      : topicResults
    const { editorState } = this.state
    const styleNames = cx('wrapper', { readOnly })
    return <div styleName={styleNames} className={className}>
      <Editor
        editorState={editorState}
        spellCheck
        stripPastedStyles
        onChange={this.handleChange}
        readOnly={readOnly}
        placeholder={placeholder}
        handleReturn={this.handleReturn}
        plugins={plugins}
        ref={this.editor} />
      <MentionSuggestions
        onSearchChange={this.handleMentionsSearch}
        suggestions={mentionResults}
        onOpen={this.disableSubmitOnReturn}
        onClose={this.handleMentionsClose} />
      <TopicSuggestions
        onSearchChange={this.handleTopicSearch}
        suggestions={topicSuggestions}
        onOpen={this.disableSubmitOnReturn}
        onClose={this.handleTopicsClose} />
    </div>
  }
}
