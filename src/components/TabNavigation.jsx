import React from 'react';
import './TabNavigation.css';

const TabNavigation = ({ tabs, activeTab, onTabChange }) => (
  <div className="tab-navigation">
    {tabs.map(tab => (
      <button
        key={tab}
        className={`tab ${activeTab === tab ? 'active' : ''}`}
        onClick={() => onTabChange(tab)}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default TabNavigation;