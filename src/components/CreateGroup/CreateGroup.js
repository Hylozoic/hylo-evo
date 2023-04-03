import { trim } from 'lodash/fp'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import GroupsSelector from 'components/GroupsSelector'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import {
  accessibilityDescription,
  accessibilityIcon,
  accessibilityString,
  GROUP_ACCESSIBILITY,
  GROUP_VISIBILITY,
  visibilityString,
  visibilityDescription,
  visibilityIcon
} from 'store/models/Group'
import styles from './CreateGroup.scss'

const slugValidatorRegex = /^[0-9a-z-]{2,40}$/

class CreateGroup extends Component {
  constructor (props) {
    super(props)

    this.state = {
      accessibility: 1,
      nameCharacterCount: 0,
      invitees: [],
      name: props.initialGroupName || '',
      parentGroups: this.props.parentGroups || [],
      purposeCharacterCount: 0,
      slug: props.initialGroupSlug || '',
      slugCustomized: false,
      visibility: 1,

      edited: false,

      errors: {
        name: false,
        slug: false
      }
    }

    this.groupsSelector = React.createRef()
    this.slugRef = React.createRef()
  }

  componentDidUpdate (oldProps) {
    if (oldProps.groupSlugExists !== this.props.groupSlugExists) {
      this.setState({ errors: { ...this.state.errors, slug: this.props.groupSlugExists ? this.props.t('This URL already exists. Try another.') : false } })
    }
  }

  focusSlug = () => {
    this.slugRef.current.focus()
    this.slugRef.current.select()
  }

  isValid = () => {
    return Object.values(this.state.errors).every(v => v === false) && this.state.name && this.state.slug
  }

  validateSlug (val) {
    if (val === '') {
      return this.props.t('Please enter a URL slug')
    } else if (!slugValidatorRegex.test(val)) {
      return this.props.t('URLs must have between 2 and 40 characters, and can only have lower case letters, numbers, and dashes.')
    } else {
      this.props.fetchGroupExists(val)
      return false
    }
  }

  updateField = (field) => (value) => {
    const newValue = typeof value.target !== 'undefined' ? value.target.value : value

    const updates = {
      [field]: newValue,
      errors: { ...this.state.errors },
      edited: true
    }

    if (field === 'name') {
      updates.errors.name = newValue === '' ? this.props.t('Please enter a group name') : false
      updates.characterCount = newValue.length
    }

    if (field === 'slug') {
      updates.errors.slug = this.validateSlug(newValue)
      updates.slugCustomized = true
    }

    if (field === 'name' && !this.state.slugCustomized) {
      if (newValue.length < 40) {
        const slugString = newValue.toLowerCase().replace(/(^\s+|[^a-zA-Z0-9 ]+|\s+$)/g, '').replace(/\s+/g, '-')
        updates.errors.slug = this.validateSlug(slugString)
        updates.slug = slugString
      }
    }

    this.setState(updates)
  }

  onSubmit = () => {
    let { accessibility, name, parentGroups, purpose, slug, visibility } = this.state
    name = typeof name === 'string' ? trim(name) : name
    purpose = typeof purpose === 'string' ? trim(purpose) : purpose

    if (this.isValid()) {
      this.props.createGroup({ accessibility, name, slug, parentIds: parentGroups.map(g => g.id), purpose, visibility })
        .then(({ error }) => {
          if (error) {
            // `state.error` doesn't appear to be displayed anywhere
            this.setState({
              error: this.props.t('There was an error, please try again.')
            })
          } else {
            this.props.goToGroup(slug)
          }
        })
    }
  }

  render () {
    const { goBack, match, parentGroupOptions, t } = this.props
    const { accessibility, characterCount, edited, errors, name, parentGroups, slug, visibility } = this.state

    if (!match) return null

    return (
      <div styleName='wrapper'>
        <div styleName='header'>
          <button onClick={goBack}><Icon name='Back' styleName='backIcon' /></button>
          <span styleName='headerHeadline'>{t('Create Group')}</span>
        </div>
        <div styleName='nameAndSlug'>
          <TextInput
            autoFocus
            type='text'
            name='name'
            onChange={this.updateField('name')}
            value={name}
            theme={{ inputStyle: 'modal-input', wrapperStyle: 'center' }}
            placeholder={t('Your group\'s name')}
            noClearButton
            maxLength='60'
            onEnter={this.onSubmit}
            styleName='groupNameInput'
          />
          <span styleName='characterCounter'>{nameCharacterCount} / 60</span>
          {errors.name && <span styleName='nameError'>{errors.name}</span>}
          <span styleName='slug'>
            <button tabIndex='-1' styleName='slugButton' onClick={this.focusSlug}>
              <Icon name='SmallEdit' />
              https://hylo.com/groups/
            </button>
            <TextInput
              type='text'
              name='slug'
              onChange={this.updateField('slug')}
              value={slug}
              onClick={this.focusSlug}
              theme={{ input: styles['slugInput'], wrapper: styles['slug-wrapper'] }}
              noClearButton
              onEnter={this.onSubmit}
              maxLength='40'
              inputRef={this.slugRef}
            />
          </span>
          {errors.slug && <span styleName='slugError'>{errors.slug}</span>}
        </div>

        <div styleName='privacy'>
          <div styleName='dropdownContainer'>
            <Dropdown
              styleName='privacyDropdown'
              toggleChildren={(
                <span>
                  <div styleName='dropdownItemSelected'>
                    <Icon name={visibilityIcon(visibility)} styleName='selectedIcon' />
                    <div>
                      <div styleName='dropdownDescription'>{t('WHO CAN SEE THIS GROUP?')}</div>
                      <div styleName='selectedString'>
                        <b>{t(visibilityString(visibility))}</b>
                        <span>{t(visibilityDescription(visibility))}</span>
                      </div>
                    </div>
                  </div>
                  <Icon name='ArrowDown' styleName='openDropdown' />
                </span>
              )}
              items={Object.keys(GROUP_VISIBILITY).map(label => ({
                key: label,
                label: (
                  <div styleName='dropdownItem'>
                    <Icon name={visibilityIcon(GROUP_VISIBILITY[label])} />
                    <div styleName='selectedString'>
                      <b>{t(label)}</b>
                      <span> {t(visibilityDescription(GROUP_VISIBILITY[label]))}</span>
                    </div>
                  </div>
                ),
                onClick: () => this.updateField('visibility')(GROUP_VISIBILITY[label])
              }))}
            />
          </div>
          <div styleName='dropdownContainer'>
            <Dropdown
              styleName='privacyDropdown'
              toggleChildren={(
                <span>
                  <div styleName='dropdownItemSelected'>
                    <Icon name={accessibilityIcon(accessibility)} styleName='selectedIcon' />
                    <div>
                      <div styleName='dropdownDescription'>{t('WHO CAN JOIN THIS GROUP?')}</div>
                      <div styleName='selectedString'>
                        <b>{t(accessibilityString(accessibility))}</b>
                        <span>{t(accessibilityDescription(accessibility))}</span>
                      </div>
                    </div>
                  </div>
                  <Icon name='ArrowDown' styleName='openDropdown' />
                </span>
              )}
              items={Object.keys(GROUP_ACCESSIBILITY).map(label => ({
                key: label,
                label: (
                  <div styleName='dropdownItem' key={label}>
                    <Icon name={accessibilityIcon(GROUP_ACCESSIBILITY[label])} />
                    <div styleName='selectedString'>
                      <b>{t(label)}</b>
                      <span> {t(accessibilityDescription(GROUP_ACCESSIBILITY[label]))}</span>
                    </div>
                  </div>
                ),
                onClick: () => this.updateField('accessibility')(GROUP_ACCESSIBILITY[label])
              }))}
            />
          </div>
        </div>

        {/* TODO: turn this on when finished <div styleName='inviteMembers'>
          <div styleName='memberSelector'>
            <span styleName='title'>INVITE MEMBERS</span>
            <TextInput
              type='text'
              name='memberInvites'
              placeholder={t('Enter names & email addresses')}
            />
          </div>
        </div> */}

        <div styleName='purposeContainer'>
          <div styleName='purposeField'>
            <span styleName='title'>{t('GROUP PURPOSE')}</span>
            <span styleName='characterCounter'>{purposeCharacterCount} / 500</span>
            <div styleName='purposeHelp'>
              ?
              <div styleName='purposeTooltip'>{t('purposeHelpText')}</div>
            </div>
            <textarea
              maxLength={500}
              onChange={this.updateField('purpose')}
              placeholder={t('What does this group hope to accomplish?')}
            />
          </div>
        </div>

        {parentGroupOptions && parentGroupOptions.length > 0 && (
          <div styleName='parentGroups'>
            <div styleName='parentSelector'>
              <span styleName='title'>{t('IS THIS GROUP A MEMBER OF OTHER GROUPS?')}</span>
              <div styleName='parentGroupInfo'>
                ?
                <div styleName='parentGroupTooltip'>{t('You may add parent groups if you are a moderator of the group you wish to add, or if the group you wish to add has the Open access setting which allows any group to join it')}</div>
              </div>
              {/* TODO: somehow show groups that are restricted and will be a join request differently */}
              <GroupsSelector
                options={parentGroupOptions}
                selected={parentGroups}
                onChange={(newGroups) => { this.updateField('parentGroups')(newGroups) }}
                readOnly={false}
                ref={this.groupsSelector}
              />
            </div>
          </div>
        )}

        <div styleName='createGroupBottom'>
          <Button
            color='green-white-green-border'
            key='create-button'
            narrow
            disabled={!edited || !this.isValid()}
            onClick={this.onSubmit}
            styleName='submit-button'
          >
            <Icon name='Plus' green={edited && this.isValid()} styleName='create-group-icon' />{t('Create Group')}
          </Button>
        </div>
      </div>
    )
  }
}

export default withTranslation()(CreateGroup)
