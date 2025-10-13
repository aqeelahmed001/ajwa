import dbConnect from '../lib/db';
import MachineryItem from '../models/MachineryItem';

/**
 * Seed script to populate the database with initial data
 */
async function seedDatabase() {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Connected to MongoDB');

    // Check if we already have data
    const count = await MachineryItem.countDocuments();
    if (count > 0) {
      console.log(`Database already has ${count} machinery items. Skipping seed.`);
      return;
    }

    // Sample machinery data
    const machineryData = [
      {
        name: 'Komatsu PC200-8 Hydraulic Excavator',
        category: 'Excavator',
        subcategory: 'Hydraulic',
        manufacturer: 'Komatsu',
        modelNumber: 'PC200-8',
        year: 2015,
        hours: 5200,
        price: 75000,
        images: [
          'https://placehold.co/600x400?text=Komatsu+PC200-1',
          'https://placehold.co/600x400?text=Komatsu+PC200-2',
          'https://placehold.co/600x400?text=Komatsu+PC200-3',
        ],
        location: 'Osaka, Japan',
        condition: 'Used - Excellent',
        weight: '20 tons',
        featured: true,
        availability: 'In Stock',
        description: 'Well-maintained Komatsu PC200-8 hydraulic excavator with low hours. Excellent condition with recent service history.',
        specifications: {
          engine: 'Komatsu SAA6D107E-1',
          power: '155 HP',
          operatingWeight: '20,000 kg',
          bucketCapacity: '0.8-1.2 m³',
          maxDiggingDepth: '6.5 m',
          maxReach: '9.8 m',
          trackWidth: '600 mm'
        },
        tags: ['hydraulic', 'medium', 'tracked', 'construction']
      },
      {
        name: 'Caterpillar D6R XL Bulldozer',
        category: 'Bulldozer',
        subcategory: 'Track-Type Tractor',
        manufacturer: 'Caterpillar',
        modelNumber: 'D6R XL',
        year: 2017,
        hours: 3800,
        price: 98000,
        images: [
          'https://placehold.co/600x400?text=CAT+D6R-1',
          'https://placehold.co/600x400?text=CAT+D6R-2',
        ],
        location: 'Nagoya, Japan',
        condition: 'Used - Good',
        weight: '18.5 tons',
        featured: false,
        availability: 'In Stock',
        description: 'Reliable Caterpillar D6R XL bulldozer with moderate hours. Good condition with all systems functioning properly.',
        specifications: {
          engine: 'Cat C9 ACERT',
          power: '175 HP',
          operatingWeight: '18,500 kg',
          bladeCapacity: '5.6 m³',
          bladeWidth: '3.7 m',
          ripper: 'Multi-shank ripper'
        },
        tags: ['track-type', 'earthmoving', 'construction', 'medium']
      },
      {
        name: 'Hitachi ZX135US-5B Excavator',
        category: 'Excavator',
        subcategory: 'Compact',
        manufacturer: 'Hitachi',
        modelNumber: 'ZX135US-5B',
        year: 2018,
        hours: 2900,
        price: 62000,
        images: [
          'https://placehold.co/600x400?text=Hitachi+ZX135-1',
          'https://placehold.co/600x400?text=Hitachi+ZX135-2',
        ],
        location: 'Yokohama, Japan',
        condition: 'Used - Very Good',
        weight: '13.5 tons',
        featured: true,
        availability: 'In Stock',
        description: 'Compact Hitachi ZX135US-5B excavator in very good condition. Low hours and well-maintained with recent service.',
        specifications: {
          engine: 'Isuzu AM-4JJ1X',
          power: '100 HP',
          operatingWeight: '13,500 kg',
          bucketCapacity: '0.5 m³',
          maxDiggingDepth: '5.5 m',
          maxReach: '8.3 m',
          trackWidth: '500 mm'
        },
        tags: ['compact', 'hydraulic', 'tracked', 'construction', 'urban']
      }
    ];

    // Insert the data
    const result = await MachineryItem.insertMany(machineryData);
    console.log(`Successfully seeded ${result.length} machinery items`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Disconnect from the database
    process.exit(0);
  }
}

// Run the seed function
seedDatabase();
