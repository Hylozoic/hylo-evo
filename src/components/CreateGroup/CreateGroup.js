import { trim } from 'lodash/fp'
import React, { Component } from 'react'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import GroupsSelector from 'components/GroupsSelector'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import { accessibilityString, visibilityString, groupVisibilityDescription, groupVisibilityIcon, groupAccessibilityDescription, groupAccessibilityIcon, GROUP_ACCESSIBILITY, GROUP_VISIBILITY } from 'store/models/Group'
import styles from './CreateGroup.scss'

const slugValidatorRegex = /^[0-9a-z-]{2,40}$/

export default class CreateGroup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      accessibility: 1,
      characterCount: 0,
      invitees: [],
      name: '',
      parentGroups: this.props.parentGroups || [],
      slug: '',
      slugCustomized: false,
      visibility: 1,

      errors: {
        name: false,
        slug: false
      }
    }

    this.groupsSelector = React.createRef()
  }

  componentDidUpdate (oldProps) {
    if (oldProps.groupSlugExists !== this.props.groupSlugExists) {
      this.setState({ errors: { ...this.state.errors, slug: this.props.groupSlugExists ? 'This URL already exists. Try another.' : false } })
    }
  }

  isValid = () => {
    return Object.values(this.state.errors).every(v => v === false) && this.state.name && this.state.slug
  }

  updateField = (field) => (value) => {
    let newValue = typeof value.target !== 'undefined' ? value.target.value : value

    const updates = {
      [field]: newValue,
      errors: { ...this.state.errors }
    }

    if (field === 'name') {
      updates.errors.name = newValue === '' ? 'Please enter a group name' : false
      this.state.characterCount = newValue.length
    }

    if (field === 'slug') {
      if (newValue === '') {
        updates.errors.slug = 'Please enter a URL slug'
      } else if (!slugValidatorRegex.test(newValue)) {
        updates.errors.slug = 'URLs must have between 2 and 40 characters, and can only have lower case letters, numbers, and dashes.'
      } else {
        updates.errors.slug = false
        this.props.fetchGroupExists(newValue)
      }
      updates.slugCustomized = true
    }

    // TODO: generate slug
    if (field === 'name' && !this.state.slugCustomized) {
      const slugString = newValue.toLowerCase().replace(/(^\s+|[^a-zA-Z0-9 ]+|\s+$)/g,'').replace(/\s+/g, "-")
      this.state.slug = slugString
    }

    this.setState(updates)
  }

  onSubmit = () => {

    name = typeof name === 'string' ? trim(name) : name

    if (this.isValid()) {
      this.props.createGroup(this.state.name, this.state.slug, this.state.parentGroups.map(g => g.id))
        .then(({ error }) => {
          if (error) {
            this.setState({
              error: 'There was an error, please try again.'
            })
          } else {
            this.props.goToGroup(this.state.slug)
          }
        })
    }
  }

  render () {
    const { match, parentGroupOptions } = this.props
    const { accessibility, characterCount, errors, name, parentGroups, slug, visibility } = this.state

    if (!match) return null

    return <div styleName='wrapper'>
      <div styleName='header'>
        <button><Icon name='Back' styleName='backIcon'/></button>
        <span styleName='headerHeadline'>Create Group</span>
      </div>
      <div styleName='nameAndSlug'>
        <TextInput
          autoFocus
          type='text'
          name='name'
          onChange={this.updateField('name')}
          value={name}
          theme={{ inputStyle: 'modal-input', wrapperStyle: 'center' }}
          placeholder="Your group's name"
          noClearButton
          maxLength='30'
          onEnter={this.onSubmit}
          styleName='groupNameInput'
        />
        <span styleName='characterCounter'>{characterCount} / 30</span>
        {errors.name && <span styleName='nameError'>{errors.name}</span>}
        <span styleName='slug'>
          <button styleName='slugButton'>
            <Icon name='SmallEdit'/>
            https://hylo.com/groups/
          </button>
          <TextInput
            type='text'
            name='slug'
            onChange={this.updateField('slug')}
            value={slug}
            theme={{ input: styles['slugInput'], wrapper: styles['slug-wrapper'] }}
            noClearButton
            onEnter={this.onSubmit}
          />
        </span>
        {errors.slug && <span styleName='slugError'>{errors.slug}</span>}
      </div>

      <div styleName='privacy'>
        <div styleName='dropdownContainer'>
          <Dropdown styleName='privacyDropdown'
            toggleChildren={
              <span>
                <div styleName='dropdownItemSelected'>
                  <Icon name={groupVisibilityIcon(visibility)} styleName='selectedIcon'/>
                  <div>
                    <div styleName='dropdownDescription'>WHO CAN SEE THIS GROUP?</div>
                    <b>{visibilityString(visibility)}</b>
                    <span> - {groupVisibilityDescription(visibility)}</span>
                  </div>
                </div>
                <Icon name='ArrowDown' styleName='openDropdown' />
              </span>}
            items={Object.keys(GROUP_VISIBILITY).map(label => ({
              label: <div styleName='dropdownItem'>
                      <Icon name={groupVisibilityIcon(GROUP_VISIBILITY[label])}/>
                      <b>{label}</b>
                      <span> - {groupVisibilityDescription(GROUP_VISIBILITY[label])}</span>
                    </div>,
              onClick: () => this.updateField('visibility')(GROUP_VISIBILITY[label])
            }))}
            alignRight />
        </div>
        <div styleName='dropdownContainer'>
          <Dropdown styleName='privacyDropdown'
            toggleChildren={<span>
              <div styleName='dropdownItemSelected'>
                <Icon name={groupAccessibilityIcon(accessibility)} styleName='selectedIcon'/>
                <div>
                  <div styleName='dropdownDescription'>WHO CAN JOIN THIS GROUP?</div>
                  <b>{accessibilityString(accessibility)}</b>
                  <span> - {groupAccessibilityDescription(accessibility)}</span>
                </div>
              </div>
              <Icon name='ArrowDown' styleName='openDropdown' />
            </span>}
            items={Object.keys(GROUP_ACCESSIBILITY).map(label => ({
              label: <div styleName='dropdownItem'>
                      <Icon name={groupAccessibilityIcon(GROUP_ACCESSIBILITY[label])}/>
                      <b>{label}</b>
                      <span> - {groupAccessibilityDescription(GROUP_ACCESSIBILITY[label])}</span>
                    </div>,
              onClick: () => this.updateField('accessibility')(GROUP_ACCESSIBILITY[label])
            }))}
            alignRight />
        </div>
      </div>

      <div styleName='inviteMembers'>
        <div styleName='memberSelector'>
          <span styleName='title'>INVITE MEMBERS</span>
          <TextInput
            type='text'
            name='memberInvites'
            placeholder='Enter names & email addresses'
          />
        </div>
      </div>

      { this.props.parentGroups.length > 0 && <div styleName='parentGroups'>
        <div styleName='parentSelector'>
          <span styleName='title'>IS THIS GROUP A MEMBER OF OTHER GROUPS?</span>
          {/* TODO: somehow show groups that are restricted and will be a join request differently */}
          <GroupsSelector
            options={parentGroupOptions}
            selected={parentGroups}
            onChange={(newGroups) => { this.updateField('parentGroups')(newGroups) }}
            readOnly={false}
            ref={this.groupsSelector}
          />
        </div>
      </div>}
      <div styleName='createGroupBottom'>
        <Button
          color='green-white-green-border'
          key='create-button'
          narrow
          disabled={!this.isValid()}
          onClick={this.onSubmit}
          styleName='submit-button'
        >
          <Icon name='Plus' green />Create Group
        </Button>
      </div>
    </div>
  }
}
