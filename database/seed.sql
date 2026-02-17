-- Seed data for AgroVibes (English content)
-- Run after schema: sqlite3 agro.db < seed.sql

DELETE FROM posts;
DELETE FROM guides;
DELETE FROM equipment;
DELETE FROM workers;
DELETE FROM jobs;
DELETE FROM products;
DELETE FROM sales_items;
DELETE FROM courses;

INSERT INTO posts (id, farmer, location, type, title, description, tags) VALUES
(1, 'Green Valley Farms', 'Punjab, India', 'Video', 'How we use drip irrigation to save 40% water', 'A quick walkthrough of our drip setup, filters, and fertigation unit.', '["#drip","#waterSaving","#sustainable"]'),
(2, 'Sunrise Organics', 'Maharashtra, India', 'Photo', 'Before vs after using organic compost', 'Sharing results from 3 seasons of switching from chemicals to organic nutrition.', '["#organic","#soilHealth"]');

INSERT INTO guides (id, title, level, duration) VALUES
(1, 'Step-by-step: Sowing wheat with minimum tillage', 'Intermediate', '12 min read'),
(2, 'How to start vegetable farming on 1 acre', 'Beginner', '8 min read');

INSERT INTO equipment (id, name, mode, price, location, includes_operator) VALUES
(1, 'Power tiller 12HP', 'Rent', '₹1,800 / day', 'Nashik', 1),
(2, 'Tractor 45HP with rotavator', 'Rent', '₹2,300 / day', 'Ludhiana', 0),
(3, 'Solar pump 5HP', 'Sell', '₹85,000', 'Ahmednagar', 0);

INSERT INTO workers (id, name, skills, experience, availability, location) VALUES
(1, 'Ramesh Kumar', '["Tractor driving","Sowing","Spraying"]', '5+ years', 'Full-time', 'Indore'),
(2, 'Sita Devi', '["Harvesting","Weeding","Sorting"]', '3+ years', 'Seasonal', 'Jaipur');

INSERT INTO jobs (id, title, location, type) VALUES
(1, 'Seasonal harvest workers needed for wheat', 'Karnal', 'Seasonal');

INSERT INTO products (id, name, type, type_key, crops, benefits, risk) VALUES
(1, 'Organic Neem Cake', 'Organic', 'Organic', 'Vegetables, Pulses', 'Controls soil-borne pests, improves soil structure.', 'Do not over-apply; can lock some nutrients temporarily.'),
(2, 'Urea 46% N', 'Chemical', 'Chemical', 'All field crops', 'Fast nitrogen source for rapid growth.', 'Overuse can burn plants and harm soil biology.');

INSERT INTO sales_items (id, name, farm, price, location, tags) VALUES
(1, 'Organic Basmati Rice', 'Himalayan Greens', '₹180 / kg', 'Dehradun', '["Organic","Pesticide-free"]'),
(2, 'Cold-pressed Mustard Oil', 'Gangetic Farms', '₹320 / litre', 'Varanasi', '["Cold-pressed","Direct-from-farm"]');

INSERT INTO courses (id, title, modules, progress, badge) VALUES
(1, 'Intro to Organic Farming', 8, 60, 'Soil Health Starter'),
(2, 'Integrated Pest Management (IPM)', 6, 20, 'Pest Scout');
