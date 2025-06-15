import React from 'react';
import uniforms from '../data/uniform';
import schoolMerch from '../data/schoolMerch';
import HeroBanner from '../components/HeroBanner';
import ItemCard from '../components/ItemCard';
import bannerImg from '../assets/nu_bulldogex_banner.jpg';

const SectionTitle = ({ title, subtitle }) => (
  <div className="section-title-container">
    <h2 className="section-title">{title}</h2>
    {subtitle && <p className="section-subtitle">{subtitle}</p>}
  </div>
);

const Recommended = () => {
  // Get items from each category
  const recommendedUniforms = uniforms.slice(0, 3);
  const recommendedMerch = schoolMerch.slice(0, 3);
  
  // Combined items for a 3x3 grid (top 3 uniforms + top 3 merch + 3 mixed items)
  const mixedItems = [
    ...uniforms.slice(3, 4),
    ...schoolMerch.slice(3, 5),
  ];
  
  return (
    <div className="page-container">
      <HeroBanner
        image={bannerImg}
        title="NU Bulldogz Exchange"
        subtitle="Your one-stop shop for official National University uniforms and merchandise"
        ctaText="Browse Collection"
        ctaLink="/section/uniforms"
      />
      
      <div className="recommended-container">
        <SectionTitle 
          title="Official NU Uniforms" 
          subtitle="Elevate your campus presence with our premium uniform collection"
        />
        
        <div className="products-grid">
          {recommendedUniforms.map(item => (
            <ItemCard key={item.id} item={item} section="uniforms" />
          ))}
        </div>
        
        <SectionTitle 
          title="Bulldog Merchandise" 
          subtitle="Show your school spirit with exclusive National University merchandise"
        />
        
        <div className="products-grid">
          {recommendedMerch.map(item => (
            <ItemCard key={item.id} item={item} section="school-merch" />
          ))}
        </div>
        
        <SectionTitle 
          title="Popular Items" 
          subtitle="The most sought-after items by fellow NU students"
        />
        
        <div className="products-grid">
          {mixedItems.map(item => {
            const section = item.id.startsWith('u') ? 'uniforms' : 'school-merch';
            return <ItemCard key={item.id} item={item} section={section} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default Recommended;