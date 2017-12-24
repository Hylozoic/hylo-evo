import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'components/Button'
import Loading from 'components/Loading'
import Autocomplete from 'react-autocomplete'
import { isEmpty } from 'lodash/fp'
import PaginatedList from '../PaginatedList'
import '../NetworkSettings.scss'

const { any, array, func, number, object } = PropTypes

export default class NetworkCommunitiesTab extends Component {
  static propTypes = {
    addCommunityToNetwork: func.isRequired,
    communities: array,
    communitiesPage: number,
    communitiesPageCount: number,
    communitiesPending: any,
    fetchCommunityAutocomplete: func.isRequired,
    network: object,
    removeCommunityFromNetwork: func.isRequired,
    setCommunitiesPage: func.isRequired
  }

  state = {
    changed: false,
    communityChoice: null,
    communitySearch: ''
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.communitiesPage !== this.props.communitiesPage &&
    isEmpty(this.props.communities)) {
      this.props.fetchCommunities()
    }
  }

  addCommunity = () => {
    const { communityChoice } = this.state
    if (communityChoice) {
      this.props.addCommunityToNetwork(communityChoice.id)
      this.setState({
        communityChoice: null,
        communitySearch: ''
      })
    }
  }

  chooseCommunity = (_, community) => {
    this.setState({
      communityChoice: community,
      communitySearch: community.name
    })
  }

  communityAutocomplete = ({ target: { value } }) => {
    this.setState({ communitySearch: value })
    this.props.fetchCommunityAutocomplete(value)
  }

  render () {
    const {
      communitiesPage,
      communitiesPageCount,
      communitiesPending,
      communityAutocompleteCandidates,
      network,
      removeCommunityFromNetwork,
      setCommunitiesPage
    } = this.props

    if (!network) return <Loading />

    return <div>
      <PaginatedList styleName='communities'
        items={network.communities}
        itemProps={{square: true, size: 40}}
        label={'Communities'}
        page={communitiesPage}
        pageCount={communitiesPageCount}
        pending={communitiesPending}
        removeItem={removeCommunityFromNetwork(network.id)}
        setPage={setCommunitiesPage} />
      <div styleName='autocomplete'>
        <Autocomplete
          getItemValue={community => community.name}
          inputProps={{
            placeholder: 'Start typing a community name',
            style: {
              border: '1px solid #ccc',
              borderRadius: '4px',
              padding: '3px',
              width: '400px'
            }
          }}
          items={communityAutocompleteCandidates}
          renderItem={(community, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {community.name}
            </div>
         }
          value={this.state.communitySearch}
          onChange={this.communityAutocomplete}
          onSelect={this.chooseCommunity}
        />
        <Button label='Add Community' color={'green'} onClick={this.addCommunity} styleName='button' />
      </div>
    </div>
  }
}
