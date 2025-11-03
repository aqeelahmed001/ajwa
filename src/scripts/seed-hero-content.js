// Script to seed initial hero section content
const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });

console.log('Starting hero content seeding script...');

const heroContent = [
  // English content
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'categoryTag',
    type: 'text',
    content: 'International Machinery Trading',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'mainLeft',
    type: 'text',
    content: 'Buy a Machine',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'mainRight',
    type: 'text',
    content: 'Sell a Machine',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'subtitle',
    type: 'text',
    content: 'Make buying and selling machinery simple',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'ctaContact',
    type: 'text',
    content: 'Sell Your Machine',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'ctaListings',
    type: 'text',
    content: 'Browse Listings',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'leftDescription',
    type: 'html',
    content: '<p>Find high-quality industrial machinery curated from around the world.</p>',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'rightDescription',
    type: 'html',
    content: '<p>We purchase used machinery in Japan at fair market value.</p>',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'backgroundImage',
    type: 'image',
    content: '/images/mach1.jpg',
  },
  
  // Japanese content
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'categoryTag_ja',
    type: 'text',
    content: '国際機械取引',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'mainLeft_ja',
    type: 'text',
    content: '機械を購入したい',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'mainRight_ja',
    type: 'text',
    content: '機械を売りたい',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'subtitle_ja',
    type: 'text',
    content: 'あなたのニーズに合わせて、購入と売却をシンプルに',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'ctaContact_ja',
    type: 'text',
    content: '売却の相談',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'ctaListings_ja',
    type: 'text',
    content: '機械を探す',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'leftDescription_ja',
    type: 'html',
    content: '<p>世界中から高品質な産業機械を厳選して提供します。</p>',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'rightDescription_ja',
    type: 'html',
    content: '<p>日本国内の中古機械を適正な市場価格で買取いたします。</p>',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'backgroundImage_ja',
    type: 'image',
    content: '/images/mach1.jpg',
  },
];

async function seedHeroContent() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is not set');
    console.error('Make sure you have a .env or .env.local file with MONGODB_URI');
    process.exit(1);
  }
  
  console.log(`Connecting to MongoDB at ${uri.split('@')[1] || '[hidden]'}...`);

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();
    const contentCollection = db.collection('contents');

    // First, let's check the database schema
    const indexes = await contentCollection.indexes();
    console.log('Collection indexes:', indexes.map(idx => idx.name));
    
    // Insert each content item, handling the unique index constraint
    for (const item of heroContent) {
      // First check if there's any document with the same pageId, section, key (regardless of language)
      const existingAnyLang = await contentCollection.findOne({
        pageId: item.pageId,
        section: item.section,
        key: item.key,
        language: { $ne: item.language } // Different language
      });
      
      if (existingAnyLang) {
        console.log(`Found existing content for key ${item.key} in different language. Updating...`);
        // If we found a document with the same key but different language, we need to update it
        // to include the language in the key to avoid conflicts
        await contentCollection.updateOne(
          { _id: existingAnyLang._id },
          { $set: { key: `${existingAnyLang.key}_${existingAnyLang.language}` } }
        );
        console.log(`Updated key to ${existingAnyLang.key}_${existingAnyLang.language}`);
      }
      
      // Now check for content in the same language
      const filter = {
        pageId: item.pageId,
        section: item.section,
        language: item.language,
        key: item.key,
      };
      
      // Check if it exists in this language
      const existing = await contentCollection.findOne(filter);
      
      let result;
      if (existing) {
        // Update if content is different
        if (existing.content !== item.content) {
          result = await contentCollection.updateOne(filter, { $set: item });
          console.log(`Updated: ${item.language} - ${item.key}`);
        } else {
          console.log(`No changes: ${item.language} - ${item.key}`);
        }
      } else {
        // Create new
        result = await contentCollection.insertOne(item);
        console.log(`Created: ${item.language} - ${item.key}`);
      }

      // Logging is already handled above
    }

    console.log('Hero content seeding completed');
  } catch (error) {
    console.error('Error seeding hero content:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seedHeroContent().catch(console.error);
