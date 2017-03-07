import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import SkillLabel from 'components/SkillLabel'
import SAMPLE_POST from './samplePost'

export default function SampleCard ({post: { id, author, title, body, tags, upVoters }}) {
  return <div className='card'>
    <CardHeader person={author} styleName='cardHeader' />
    <CardBlock styleName='cardBlock'>
      <CardBody {...{id, title, body}} />
      <CardTags tags={tags} />
    </CardBlock>
    <CardFooter votes={upVoters} styleName='cardFooter' />
  </div>
}
SampleCard.propTypes = {
  id: PropTypes.any,
  author: PropTypes.object,
  title: PropTypes.string,
  body: PropTypes.string,
  tags: PropTypes.array,
  upVoters: PropTypes.array
}
SampleCard.defaultProps = {
  post: SAMPLE_POST
}

function CardBlock ({ children, className }) {
  className = cx(className)
  return <div className={className}>{ children }</div>
}

function CardHeader ({person: { url, name }, className}) {
  return <CardFlex className={className}
    lChildren={<RoundImage url={url} large />}
    rChildren={<RoundImage url={url} large />}>
    <span className='hdr-subheadline'>{name}</span>
  </CardFlex>
}

function CardFlex ({ lChildren, rChildren, children, className }) {
  className = cx('d-flex align-item-center', className)
  return <div className={className}>
    <div className='d-flex mr-1'>{lChildren}</div>
    <div className='w-100 mx-1'>{children}</div>
    <div className='ml-1'>{rChildren}</div>
  </div>
}

function CardBody ({ id, title, body, className }) {
  return <div className={className}>
    <div className='hdr-headline mb-3'>
      <Link to={`/post/${id}`}>{title}</Link>
    </div>
    <p className='bdy-lt-lg'>{body}</p>
  </div>
}

function CardFooter ({ votes, className }) {
  let names = votes.slice(0, 2).map(vote => vote.name)
  if (votes.length > 2) {
    names = `${names.join(', ')} and ${votes.length - 3} others commented`
  } else {
    names = names.join(', ')
  }
  const lChildren = votes.slice(0, 3).map(
    (vote, i) => <RoundImage url={vote.url} medium overlaps key={i} />
  )
  const rChildren = votes.length
  return <CardFlex lChildren={lChildren} rChildren={rChildren} className={className}>
    {names}
  </CardFlex>
}

function CardTags ({ tags }) {
  return <div>
    {tags.map(
      (tag, i) => <SkillLabel label={tag} className='mr-2' key={i} />
    )}
  </div>
}

// function Tag ({ name, className }) {
//   className = cx('btn btn-outline-secondary btn-sm tag', styles.tag, className)
//   return <div className={className}>
//     { name }
//   </div>
// }

// <Card>
//   <CardHeader>
//     <CardFlex lChildren={[<Avatar ../>]} rChildren={<CardTag />, <BurgerMenu />}>
//       <Person ... />
//     </CardFlex>
//   </CardHeader>
//   <CardImage></CardImage>
//   <CardBody title='' text='' labels=''>
//     <CardBlock />
//     <CardBlock />
//   </CardBody>
//   <CardBelowBody />
//   <CardFooter>
//     <CardFlex lChildren={[<People ../>]} rChildren={<Likes />}>
//       <PeopleNames />
//     </CardFlex>
//   </CardFooter>
// </Card>
