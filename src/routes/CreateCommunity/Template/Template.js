import { isEmpty } from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import ModalFooter from 'components/ModalFooter'
import ModalSidebar from 'components/ModalSidebar'
import { hyloNameWhiteBackground, happyAxolotl } from 'util/assets'
import { bgImageStyle } from 'util/index'

import '../CreateCommunity.scss'

export default class Template extends Component {
  static propTypes = {
    communityTemplates: PropTypes.array,
    defaultTopics: PropTypes.array,
    templateId: PropTypes.string
  }

  static defaultProps = {
    communityTemplates: [],
    defaultTopics: [],
    templateId: null
  }

  constructor (props) {
    super(props)

    this.state = {
      defaultTopicText: '',
      editing: false,
      templateId: props.templateId || ''
    }

    this.defaultTopicInput = React.createRef()
  }

  componentDidMount = () => {
    this.props.fetchCommunityTemplates()
  }

  handleTemplateChange = (template) => {
    if (!isEmpty(template.defaultTopics)) {
      if (!isEmpty(this.props.defaultTopics)) {
        if (window.confirm(`Do you want to reset your default topics to those from the "${template.displayName}" template?`)) {
          this.props.setDefaultTopics(template.defaultTopics.map(t => t.name))
        }
      } else {
        this.props.setDefaultTopics(template.defaultTopics.map(t => t.name))
      }
    }

    this.setState({
      templateId: template.id
    })
  }

  submit = () => {
    this.props.addCommunityTemplate(this.state.templateId)
    this.props.goToNextStep()
  }

  onEnter = event => {
    if (event.key === 'Enter') {
      this.submit()
    }
  }

  editNewDefaultTopic = () => {
    this.setState({
      editing: true,
      defaultTopicText: ''
    })
    this.defaultTopicInput.current && this.defaultTopicInput.current.focus()
  }

  createNewDefaultTopic = () => {
    if (!isEmpty(this.state.defaultTopicText)) {
      this.props.addDefaultTopic(this.state.defaultTopicText)
    }
    this.setState({
      editing: true,
      defaultTopicText: ''
    })
    this.defaultTopicInput.current.focus()
  }

  handleTopicInputChange = event => {
    this.setState({
      defaultTopicText: event.target.value
    })
  }

  render () {
    const { communityTemplates, defaultTopics } = this.props
    const { editing, defaultTopicText, templateId } = this.state

    const currentTemplate = communityTemplates.find(o => o.id === templateId)

    return <div styleName='flex-wrapper'>
      <ModalSidebar
        imageDialogOne="Hi, I'm Hylo the Axolotl!"
        imageDialogTwo="It's great to meet you!"
        imageUrl={happyAxolotl}
        onClick={this.props.goHome}
        theme={sidebarTheme}
        header="Great, let's get started"
        body="Let's set up some default topics to organize posts in your community! All members will automatically be subscribed to these topics. Pick a community template to get started and/or define your own."
      />
      <div styleName='panel'>
        <div>
          <span styleName='step-count'>STEP 3/4</span>
        </div>
        <div styleName='center'>
          <div styleName='logo center' style={bgImageStyle(hyloNameWhiteBackground)} />
        </div>
        <div styleName='chooseTemplate'>
          <span styleName='text-input-label text-input-label-large'>What type of community is this?</span>
          <Dropdown styleName='template-dropdown'
            toggleChildren={<span>
              {currentTemplate ? currentTemplate.displayName : 'You can choose a template to start...' }
              <Icon name='ArrowDown' />
            </span>}
            items={communityTemplates.map(template => ({
              label: template.displayName,
              onClick: () => this.handleTemplateChange(template)
            }))}
            alignRight />
        </div>

        <div styleName='center'>
          <input
            ref={this.defaultTopicInput}
            value={defaultTopicText}
            styleName='signup-input defaultTopicsInput'
            autoFocus
            onBlur={event => {
              this.setState({
                editing: false,
                defaultTopicText: ''
              })
            }}
            onKeyPress={event => {
              if (event.key === 'Enter') {
                if (editing) {
                  this.createNewDefaultTopic()
                } else {
                  this.submit()
                }
              }
            }}
            onClick={() => this.editNewDefaultTopic()}
            onChange={this.handleTopicInputChange}
            placeholder={editing ? '' : 'Add custom default topics here'}
            readOnly={!editing}
          />
        </div>
        <div>
          {!isEmpty(defaultTopics) && <div styleName='defaultTopics'>
            <div styleName='topicLabel'><span>Your community's default topics:</span></div>
            <div styleName='topicsList'>
              {this.props.defaultTopics.map((topic, index) =>
                <Pill key={index} topic={topic} clickHandler={() => this.props.removeDefaultTopic(topic)} />
              )}
            </div>
          </div>}
        </div>

      </div>

      <ModalFooter
        submit={this.submit}
        previous={this.props.goToPreviousStep}
        showPrevious
        continueText='Continue'
      />
    </div>
  }
}

function Pill ({ topic, clickHandler }) {
  return <span styleName='defaultTopic' onClick={clickHandler}>
    {topic}
  </span>
}

const sidebarTheme = {
  sidebarHeader: 'sidebar-header-full-page',
  sidebarText: 'gray-text sidebar-text-full-page'
}
