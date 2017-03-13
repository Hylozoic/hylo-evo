import React from 'react'
import StyleCard from './StyleCard'
import ColorSample from './ColorSample'

export default function Typography (props) {
  return <div>
    <div className='sheet'>
      <div className='sheet-title'>Typography</div>
      <div className='section'>
        <div className='section-title'>Headers</div>
        <div className='section-box'>
          <StyleCard styleClassName='hdr-display' name='display'
            description='Circular Bold / 32pt, -0.5 ch, 36 line / Color: 2C4059'
            sampleKey='short' />
          <StyleCard styleClassName='hdr-subheadline' name='h2'
            description='Circular Book / 18pt, 0 ch, 22 line / Color: 2C4059'
            sampleKey='short' />
          <StyleCard styleClassName='hdr-headline' name='h1'
            description='Circular Medium / 24pt, 0 ch, 28 line / Color: 2C4059'
            sampleKey='short' noBottomBorder />
          <StyleCard styleClassName='hdr-minor' name='h3'
            description='Circular Bold / 14pt, 0 ch, 18 line / Color: 2C4059'
            sampleKey='short' noBottomBorder />
        </div>
      </div>
      <div className='section'>
        <div className='section-title'>Body Styles</div>
        <div className='section-box'>
          <StyleCard styleClassName='bdy-drk-lg'
            description='Circular Book / 18pt, 0 ch, 24 line / Color: 2C4059 80%'
            sampleKey='medium' />
          <StyleCard styleClassName='bdy-drk-sm'
            description='Circular Book / 15pt, 0 ch, 22 line / Color: 2C4059 80%'
            sampleKey='medium' />
          <StyleCard styleClassName='bdy-lt-lg'
            description='Circular Book / 17pt, 0 ch, 25 line / Color: 2C4059 60%'
            sampleKey='medium' noBottomBorder />
          <StyleCard styleClassName='bdy-lt-sm'
            description='Circular Book / 15pt, 0 ch, 22 line / Color: 2C4059 60%'
            sampleKey='medium' noBottomBorder />
        </div>
      </div>
      <div className='sheet-flexbox'>
        <div className='sheet-flexbox-item'>
          <div className='section'>
            <div className='section-title'>Captions & Tags</div>
            <div className='section-box'>
              <StyleCard styleClassName='caption-drk-lg' name='Caption 13pt - Black'
                description='Circular Book / 14pt, 0 ch, 18 line / Color: 2C4059 80%'
                sampleKey='long' />
              <StyleCard styleClassName='caption-lt-lg' name='Caption 13pt - Grey'
                description='Circular Book / 14pt, 0 ch, 18 line / Color: 2C4059 80%'
                sampleKey='long' />
              <StyleCard styleClassName='tag' name='Tag'
                description='Circular Bold / 10pt, 0.6 ch, 14 line / Color: 2C4059 50%'
                sample='DASHBOARDS' />
            </div>
          </div>
        </div>
        <div className='sheet-flexbox-item'>
          <div className='section'>
            <div className='section-title'>Buttons</div>
            <div className='section-box'>
              <StyleCard styleClassName='button' name='Button - Regular'
                description='Circular Medium / 16pt, 0 ch, 20 line / Color: 0DC3A0'
                sample='Save changes' />
              <StyleCard styleClassName='button-sm' name='Button - Small'
                description='Circular Bold / 10pt, 0.6 ch, 14 line / Color: 0DC3A0'
                sample='Learn more' />
            </div>
          </div>
          <div className='section'>
            <div className='section-title section-title--collapsed'>Other</div>
            <div className='section-box'>
              <StyleCard styleClassName='cards' name='User Name - Cards'
                description='Circular Bold / 14pt, 0 ch, 20 line / Color: 2C4059'
                sample='Steven Pham' />
              <StyleCard styleClassName='timestamp' name='Timestamp'
                description='Circular Book / 13pt, 0 ch, 16 line / Color: 2C4059 60%'
                sample='6 days ago' />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='sheet'>
      <div className='sheet-title'>Colors</div>
      <div styleName='colorSection-title'>7 Shades of grey:</div>
      <div className='sheet-flexbox'>
        <ColorSample color='#2C4059' colorName='rhino' description='Backgrounds, Header text styles' />
        <ColorSample color='#2C4059' opacity='0.8' colorName='rhino-80' description='Body black text styles' />
        <ColorSample color='#2C4059' opacity='0.6' colorName='rhino-60' description='Body grey text styles' />
        <ColorSample color='#2C4059' opacity='0.5' colorName='rhino-50' description='Active (clickable) icons' />
        <ColorSample color='#2C4059' opacity='0.3' colorName='rhino-30' description='Passive icons' />
        <ColorSample color='#FFFFFF' colorName='white' textColor='#879BAB' borderColor='#DCDCDC' description='Main background, Card Background' />
        <ColorSample color='#FAFBFC' colorName='athens-gray' textColor='#879BAB' borderColor='#DCDCDC' description='Divider background, grey blocks background' />
      </div>
      <div className='sheet-flexbox'>
        <div styleName='colorSection'>
          <div styleName='colorSection-title'>Active Colors</div>
          <div styleName='colorSection-description'>
            Colors for interactive elements: <br />
            - Fills for buttons, inputs, notifications, bars, etc <br />
            - Status indicators (error, success, etc) <br />
            Accent versions of active colors can be used for top bar backgrounds <br />
          </div>
        </div>
        <ColorSample color='#0DC39F' colorName='caribbean-green' />
        <ColorSample color='#9883E5' colorName='medium-purple' />
        <ColorSample color='#BB60A8' colorName='fuchsia-pink' />
        <ColorSample color='#40A1DD' colorName='picton-blue' />
        <ColorSample color='#FE6848' colorName='persimmon' />
      </div>
      <div className='sheet-flexbox'>
        <div styleName='colorSection'>
          <div styleName='colorSection-title'>Highlight Colors</div>
          <div styleName='colorSection-description'>
            Can be used only for labels and backgrounds
          </div>
        </div>
        <ColorSample color='#CFF3EC' colorName='iceberg' textColor='#0DC3A0' />
        <ColorSample color='#EAE6FA' colorName='moon-raker' textColor='#9883E5' />
        <ColorSample color='#F1DFEE' colorName='prim' textColor='#BB60A8' />
        <ColorSample color='#D9ECF8' colorName='link-water' textColor='#40A1DD' />
        <ColorSample color='#FFE1DA' colorName='peach-schnapps' textColor='#FE6848' />
      </div>
      <div className='sheet-flexbox'>
        <div styleName='colorSection'>
          <div styleName='colorSection-title'>System Colors</div>
          <div styleName='colorSection-description'>
            To be used for Success, Warning and Error Messages
          </div>
        </div>
        <ColorSample color='#23CC80' colorName='mountain-meadow' />
        <ColorSample color='#EE4266' colorName='amaranth' />
        <ColorSample color='#FFB949' colorName='yello-orange' />
        <ColorSample />
        <ColorSample />
      </div>
    </div>
  </div>
}
