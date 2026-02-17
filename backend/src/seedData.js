module.exports = function seed() {
  return {
    posts: [
      { id: 1, farmer: 'Green Valley Farms', location: 'Punjab, India', type: 'Video', title: 'How we use drip irrigation to save 40% water', description: 'A quick walkthrough of our drip setup, filters, and fertigation unit.', tags: ['#drip', '#waterSaving', '#sustainable'] },
      { id: 2, farmer: 'Sunrise Organics', location: 'Maharashtra, India', type: 'Photo', title: 'Before vs after using organic compost', description: 'Sharing results from 3 seasons of switching from chemicals to organic nutrition.', tags: ['#organic', '#soilHealth'] },
    ],
    guides: [
      { id: 1, title: 'Step-by-step: Sowing wheat with minimum tillage', level: 'Intermediate', duration: '12 min read' },
      { id: 2, title: 'How to start vegetable farming on 1 acre', level: 'Beginner', duration: '8 min read' },
    ],
    equipment: [
      { id: 1, name: 'Power tiller 12HP', mode: 'Rent', price: '₹1,800 / day', location: 'Nashik', includesOperator: true },
      { id: 2, name: 'Tractor 45HP with rotavator', mode: 'Rent', price: '₹2,300 / day', location: 'Ludhiana', includesOperator: false },
      { id: 3, name: 'Solar pump 5HP', mode: 'Sell', price: '₹85,000', location: 'Ahmednagar', includesOperator: false },
    ],
    workers: [
      { id: 1, name: 'Ramesh Kumar', skills: ['Tractor driving', 'Sowing', 'Spraying'], experience: '5+ years', availability: 'Full-time', location: 'Indore' },
      { id: 2, name: 'Sita Devi', skills: ['Harvesting', 'Weeding', 'Sorting'], experience: '3+ years', availability: 'Seasonal', location: 'Jaipur' },
    ],
    jobs: [
      { id: 1, title: 'Seasonal harvest workers needed for wheat', location: 'Karnal', type: 'Seasonal' },
    ],
    products: [
      { id: 1, name: 'Organic Neem Cake', type: 'Organic', typeKey: 'Organic', crops: 'Vegetables, Pulses', benefits: 'Controls soil-borne pests, improves soil structure.', risk: 'Do not over-apply; can lock some nutrients temporarily.' },
      { id: 2, name: 'Urea 46% N', type: 'Chemical', typeKey: 'Chemical', crops: 'All field crops', benefits: 'Fast nitrogen source for rapid growth.', risk: 'Overuse can burn plants and harm soil biology.' },
    ],
    sales_items: [
      { id: 1, name: 'Organic Basmati Rice', farm: 'Himalayan Greens', price: '₹180 / kg', location: 'Dehradun', tags: ['Organic', 'Pesticide-free'] },
      { id: 2, name: 'Cold-pressed Mustard Oil', farm: 'Gangetic Farms', price: '₹320 / litre', location: 'Varanasi', tags: ['Cold-pressed', 'Direct-from-farm'] },
    ],
    courses: [
      { id: 1, title: 'Intro to Organic Farming', modules: 8, progress: 60, badge: 'Soil Health Starter' },
      { id: 2, title: 'Integrated Pest Management (IPM)', modules: 6, progress: 20, badge: 'Pest Scout' },
    ],
    post_likes: [],
    post_comments: [],
    follows: [],
  };
};
