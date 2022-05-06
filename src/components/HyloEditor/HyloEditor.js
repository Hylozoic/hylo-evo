import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Immutable from 'immutable'
import { Validators } from 'hylo-shared'
import cx from 'classnames'
import {
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  Modifier,
  KeyBindingUtil
} from 'draft-js'
import Editor from '@draft-js-plugins/editor'
import createMentionPlugin from '@draft-js-plugins/mention'
import createLinkifyPlugin from '@draft-js-plugins/linkify'
import createInlineToolbarPlugin from '@draft-js-plugins/inline-toolbar'
import * as HyloContentState from 'components/HyloEditor/HyloContentState'
import {
  ItalicButton,
  BoldButton
} from '@draft-js-plugins/buttons'
import 'draft-js/dist/Draft.css'
import '@draft-js-plugins/inline-toolbar/lib/plugin.css'
import styles from './HyloEditor.scss'

export const blockRenderMap = Immutable.Map({
  'paragraph': {
    element: 'div'
  },
  'unstyled': {
    element: 'div'
  }
})
export default class HyloEditor extends Component {
  static propTypes = {
    contentHTML: PropTypes.string,
    contentStateRaw: PropTypes.object,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    submitOnReturnHandler: PropTypes.func,
    readOnly: PropTypes.bool,
    findMentions: PropTypes.func.isRequired,
    clearMentions: PropTypes.func.isRequired,
    findTopics: PropTypes.func.isRequired,
    clearTopics: PropTypes.func.isRequired,
    mentionResults: PropTypes.array,
    topicResults: PropTypes.array,
    focusOnRender: PropTypes.bool
  }

  static defaultProps = {
    contentHTML: null,
    contentStateRaw: null,
    readOnly: false,
    mentionResults: [],
    topicResults: [],
    focusOnRender: false,
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

  defaultState = ({ contentStateRaw, contentHTML }) => {
    return {
      editorState: contentStateRaw
        ? this.getEditorStateFromContentStateRaw(contentStateRaw)
        : this.getEditorStateFromHTML(contentHTML),
      didInitialFocus: false,
      submitOnReturnEnabled: true,
      mentionsOpen: false,
      topicsOpen: false
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
    this._inlineToolbarPlugin = createInlineToolbarPlugin()
    this.editor = React.createRef()
    this.state = this.defaultState(props)
  }

  componentDidUpdate (prevProps) {
    // Regenerate state from content if HTML changes
    if (
      this.props.contentHTML !== prevProps.contentHTML ||
      this.props.contentStateRaw !== prevProps.contentStateRaw
    ) {
      this.setState(this.defaultState(this.props))
    }

    // Handle initial focus behaviour
    if (this.props.focusOnRender !== prevProps.focusOnRender) {
      this.setState({ didInitialFocus: false })
    }
    if (this.props.focusOnRender && !this.state.didInitialFocus) {
      this.focus()
    }
  }

  reset = () => {
    this.setState({ editorState: this.getEditorStateFromHTML('') })
  }

  isEmpty = () =>
    !this.state.editorState.getCurrentContent().hasText()

  getEditorStateFromContentStateRaw = (contentStateRaw) => {
    const contentState = HyloContentState.fromRaw(contentStateRaw)
    // Don't create new EditorState once one has already been created as per:
    // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md
    return this.state && this.state.editorState
      ? EditorState.push(this.state.editorState, contentState)
      : EditorState.createWithContent(contentState)
  }

  getEditorStateFromHTML = (contentHTML) => {
    if (!contentHTML) return EditorState.createEmpty()
    const contentState = HyloContentState.fromHTML(contentHTML, { raw: false })
    // Don't create new EditorState once one has already been created as per:
    // https://github.com/draft-js-plugins/draft-js-plugins/blob/master/FAQ.md
    return this.state && this.state.editorState
      ? EditorState.push(this.state.editorState, contentState)
      : EditorState.createWithContent(contentState)
  }

  getContentHTML = () => {
    const { editorState } = this.state
    return HyloContentState.toHTML(editorState.getCurrentContent())
  }

  getContentRaw = () => {
    const { editorState } = this.state
    return HyloContentState.toRaw(editorState.getCurrentContent())
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

  onReturn = (event) => {
    const { submitOnReturnHandler } = this.props
    const { editorState, mentionsOpen, topicsOpen } = this.state
    const contentState = editorState.getCurrentContent()

    // passes event to plugins
    if (mentionsOpen || topicsOpen) {
      return undefined
    }

    if (KeyBindingUtil.isSoftNewlineEvent(event)) {
      this.handleChange(RichUtils.insertSoftNewline(editorState))
      return 'handled'
    }

    if (
      this.state.submitOnReturnEnabled &&
      submitOnReturnHandler
    ) {
      submitOnReturnHandler(editorState)
      this.setState({
        editorState: EditorState.moveFocusToEnd(EditorState.createEmpty())
      })
      return 'handled'
    }

    if (
      contentState.getLastBlock().getType() === 'unstyled' &&
      contentState.getLastBlock().getText().slice(-1).match(/^\n$/)
    ) {
      const selectionState = editorState.getSelection().merge({
        anchorOffset: editorState.getSelection().getEndOffset(),
        focusOffset: editorState.getSelection().getEndOffset() - 1,
        isBackward: true
      })
      this.handleChange(
        EditorState.push(
          editorState,
          Modifier.splitBlock(contentState, selectionState),
          'split-block'
        )
      )
      return 'handled'
    }

    this.handleChange(RichUtils.insertSoftNewline(editorState))
    return 'handled'
  }

  handleKeyCommand = (command) => {
    if (command === 'Escape') {
      this.handleEscape()
      return 'handled'
    }
    return 'not-handled'
  }

  handleEscape = () => this.props.onEscape && this.props.onEscape()

  toggleMentionsPluginOpenState = key => status => {
    this.setState({ [`${key}Open`]: status, submitOnReturnEnabled: !status })
  }

  handleMentionsClose = () => {
    this.props.clearMentions()
    this.toggleMentionsPluginOpenState('mentions')(true)
    return true
  }

  handleTopicsClose = () => {
    this.props.clearTopics()
    this.toggleMentionsPluginOpenState('topics')(true)
    return true
  }

  focus = () => {
    if (!this.editor.current) {
      return
    }

    // Focus and ensure editor caret is at the end, in case of injected content.
    // Note this does not scroll the page, use `react-scroll-into-view` if you need that.
    this.setState({
      editorState: EditorState.moveFocusToEnd(this.state.editorState),
      didInitialFocus: true
    })
  }

  render () {
    const { MentionSuggestions } = this._mentionsPlugin
    const { MentionSuggestions: TopicSuggestions } = this._topicsPlugin
    const { InlineToolbar } = this._inlineToolbarPlugin
    const plugins = [
      this._mentionsPlugin,
      this._topicsPlugin,
      this._linkifyPlugin,
      this._inlineToolbarPlugin
    ]
    const { placeholder, mentionResults, topicResults, className, readOnly } = this.props
    const { topicSearch, mentionsOpen, topicsOpen } = this.state
    const topicSuggestions = !Validators.validateTopicName(topicSearch)
      ? [{ id: -1, name: topicSearch }].concat(topicResults)
      : topicResults
    const { editorState } = this.state
    const styleNames = cx('wrapper', { readOnly })

    return (
      <div styleName={styleNames} className={className}>
        <Editor
          editorState={editorState}
          onChange={this.handleChange}
          handleReturn={this.onReturn}
          blockRenderMap={blockRenderMap}
          handleKeyCommand={this.handleKeyCommand}
          keyBindingFn={hyloEditorKeyBindingFn}
          readOnly={readOnly}
          placeholder={placeholder}
          plugins={plugins}
          ref={this.editor}
          stripPastedStyles
          spellCheck
        />
        <InlineToolbar>
          {(externalProps) => (
            <>
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
            </>
          )}
        </InlineToolbar>
        <MentionSuggestions
          open={mentionsOpen}
          onSearchChange={this.handleMentionsSearch}
          suggestions={mentionResults}
          onOpenChange={this.toggleMentionsPluginOpenState('mentions')}
          onClose={this.handleMentionsClose}
        />
        <TopicSuggestions
          open={topicsOpen}
          onSearchChange={this.handleTopicSearch}
          suggestions={topicSuggestions}
          onOpenChange={this.toggleMentionsPluginOpenState('topics')}
          onClose={this.handleTopicsClose}
        />
      </div>
    )
  }
}

export function hyloEditorKeyBindingFn (e) {
  if (e.key === 'Escape') {
    return e.key
  }

  // For mention plugin (mentions and topics):
  // Returning undefined allows these events
  // to be passed through to the plugins.
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    return undefined
  }

  return getDefaultKeyBinding(e)
}
