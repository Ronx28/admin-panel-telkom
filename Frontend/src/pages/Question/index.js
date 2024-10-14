import React from 'react'
import Question from './Question'

export default function Users() {
  return (
    <div>
      <h2 className='page-header'>Question</h2>
      <div className='row'>
        <div className='col-12'>
          <div className='card'>
            <card className='body'>
              <Question/>
            </card>
          </div>
        </div>
      </div>
    </div>
  )
}
