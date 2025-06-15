import React from 'react';
import { useParams } from 'react-router-dom';
import { FaFilter, FaSort, FaSearch } from 'react-icons/fa';
import uniforms from '../data/uniform'; 
import schoolMerch from '../data/schoolMerch';
import ItemCard from '../components/ItemCard';

const Section = () => {
  const { sectionId } = useParams();
  const items = sectionId === 'uniforms' ? uniforms : schoolMerch;
  const title = sectionId === 'uniforms' ? 'Uniforms Collection' : 'Bulldogs Merchandise';
  // const bgClass = sectionId === 'uniforms' ? 'uniforms-bg' : 'merch-bg';
  
  const subtitle = sectionId === 'uniforms' 
    ? 'Official National University uniforms for all academic programs' 
    : 'Show your NU Bulldog pride with our exclusive merchandise';

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="section-header">
        <div className="section-header-content">
          <h1>{title}</h1>
          <div className="section-header-divider"></div>
          <p className="section-header-subtitle">{subtitle}</p>
          
          {/* Filter and Search Bar */}
          <div className="section-controls">
            <div className="search-bar">
              <FaSearch className="search-icon" />
              <input type="text" placeholder="Search items..." />
            </div>
            
            <div className="filter-controls">
              <button className="filter-button">
                <FaFilter /> Filter
              </button>
              <button className="sort-button">
                <FaSort /> Sort
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="section-content">
        <div className="section-title-container">
          <h2 className="section-title">{sectionId === 'uniforms' ? 'All Uniforms' : 'All Merchandise'}</h2>
          <p className="section-subtitle">Showing {items.length} items</p>
        </div>
        
        <div className="products-grid">
          {items.map(item => (
            <ItemCard key={item.id} item={item} section={sectionId} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section;