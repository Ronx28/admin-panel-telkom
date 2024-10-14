import React from 'react'
import './card.css'

const colors = {
  red: 'light-red',
  green: 'light-green',
  amber: 'light-amber',
  blue: 'light-blue',
}

export default function Card({ icon, count, title, color = 'blue', logo }) {
  return (
    <div className='status-card'>
      <div className='status-card-icon'>
        {/* Jika ada logo, tampilkan logo, jika tidak, tampilkan ikon */}
        {logo ? (
          <img src={logo} alt="logo" className="status-card-logo" />
        ) : (
          <i className={icon} />
        )}
      </div>
      <div className='status-card-info'>
        <h4 className={`status-card-info-header ${colors[color]}`}>{count}</h4>
        <span className={colors[color]}>{title}</span>
      </div>
    </div>
  )
}
