// Script to update slugs for existing machinery items
const { MongoClient } = require('mongodb');

// Simple slugify function
function slugify(text) {
  return text
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

async function updateSlugs() {
  // Use the actual MongoDB URI from your .env.local file
  const uri = 'mongodb+srv://ajwa:CI0Mrmjr3BufidoA@ajwa.d0pdxso.mongodb.net/ajwa_db';
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('machineryitems');
    
    const items = await collection.find({}).toArray();
    console.log(`Found ${items.length} machinery items`);
    
    let updateCount = 0;
    
    for (const item of items) {
      const updates = {};
      
      if (!item.slug && item.name) {
        updates.slug = slugify(item.name);
      }
      
      if (!item.categorySlug && item.category) {
        updates.categorySlug = slugify(item.category);
      }
      
      if (Object.keys(updates).length > 0) {
        await collection.updateOne({ _id: item._id }, { $set: updates });
        updateCount++;
        console.log(`Updated item ${item._id}: ${JSON.stringify(updates)}`);
      }
    }
    
    console.log(`Updated ${updateCount} items with slugs`);
  } catch (error) {
    console.error('Error updating slugs:', error);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

updateSlugs().catch(console.error);
