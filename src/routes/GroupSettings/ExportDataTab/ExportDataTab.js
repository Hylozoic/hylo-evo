import React, { Component } from 'react'
import { object, func } from 'prop-types'
// import SettingsSection from '../SettingsSection'
// import Switch from 'components/SwitchStyled'
import Loading from 'components/Loading'
import Button from 'components/Button'

export default class ExportDataTab extends Component {
  static propTypes = {
    group: object,
    requestMemberCSV: func
  }

  // :TODO: further export options
  // state = {
  //   exportFromGroups: [],
  //   exportMembers: false,
  //   exportPosts: false,
  //   exportTopicSubscribers: false
  // }

  render () {
    const { group } = this.props
    // const { exportMembers, exportPosts, exportTopicSubscribers } = this.state

    if (!group) return <Loading />

    return (
      <div>
        {/* <SettingsSection>
          <h3>Data Set</h3>
          <p>Which group(s) would you like to export data from?</p>
        </SettingsSection>
        <SettingsSection>
          <h3>Data Types</h3>
          <p>What types of things do you want to export?</p>
          <p>
            <Switch checked={exportMembers} onChange={this._toggleState('exportMembers')} backgroundColor='#40A1DD' />
            Members & associated member information
          </p>
          <p>
            <Switch checked={exportPosts} onChange={this._toggleState('exportPosts')} backgroundColor='#40A1DD' />
            Posts & comments
          </p>
          <p>
            <Switch checked={exportTopicSubscribers} onChange={this._toggleState('exportTopicSubscribers')} backgroundColor='#40A1DD' />
            Topic list & subscriber list
          </p>
        </SettingsSection> */}
        <h3>Export Data</h3>
        <p>This function exports all member data for this group as a CSV file for import into other software.</p>
        <Button label='Export Members' color='green' onClick={this.exportMembers.bind(this)} />
      </div>
    )
  }

  exportMembers () {
    this.props.requestMemberCSV()
  }

  _toggleState (field) {
    return (selected) => this.setState({ [field]: !selected })
  }
}
