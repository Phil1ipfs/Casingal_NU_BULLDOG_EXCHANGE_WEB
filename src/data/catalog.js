// Shared catalog helpers built on top of the existing product data files.
// The product data itself lives in uniform.js / schoolMerch.js and is unchanged.
import uniforms from './uniform';
import schoolMerch from './schoolMerch';

export const allProducts = [...uniforms, ...schoolMerch];

export const CATEGORIES = [
  {
    id: 'uniforms',
    label: 'Uniforms',
    singular: 'Uniform',
    title: 'Uniforms Collection',
    subtitle: 'Official National University uniforms for all academic programs',
    items: uniforms,
  },
  {
    id: 'school-merch',
    label: 'Merchandise',
    singular: 'Merchandise',
    title: 'Bulldogs Merchandise',
    subtitle: 'Show your NU Bulldog pride with our exclusive merchandise',
    items: schoolMerch,
  },
];

// Mirrors the existing routing convention: anything that isn't "uniforms" is merch.
export const getCategory = (sectionId) =>
  sectionId === 'uniforms' ? CATEGORIES[0] : CATEGORIES[1];

// Existing convention: uniform ids start with "u", merch ids with "m".
export const getSectionForItem = (item) =>
  item.id.startsWith('u') ? 'uniforms' : 'school-merch';

export const getItemPath = (item) => `/item/${getSectionForItem(item)}/${item.id}`;

// Existing "LIMITED STOCK" badge rule from the original ItemCard.
export const isLimitedStock = (item) => item.id.includes('3') || item.id.includes('6');

export const matchesQuery = (item, query) => {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
};

export const formatPrice = (value) =>
  `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Store details already stated across the app (item pickup info, official store copy).
export const STORE = {
  name: 'NU Bulldog Exchange',
  location: 'NU Main Campus',
  pickup: 'Available for pickup at NU Main Campus',
  returns: '7-day return policy for unworn items',
};
