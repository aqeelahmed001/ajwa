import { NextRequest, NextResponse } from 'next/server';
import { Content } from '@/models/content';
import dbConnect from '@/lib/db';

// Initial hero section content
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
    type: 'text',
    content: 'Find high-quality industrial machinery curated from around the world.',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'en',
    key: 'rightDescription',
    type: 'text',
    content: 'We purchase used machinery in Japan at fair market value.',
  },
  
  // Japanese content
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'categoryTag',
    type: 'text',
    content: '国際機械取引',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'mainLeft',
    type: 'text',
    content: '機械を購入したい',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'mainRight',
    type: 'text',
    content: '機械を売りたい',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'subtitle',
    type: 'text',
    content: 'あなたのニーズに合わせて、購入と売却をシンプルに',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'ctaContact',
    type: 'text',
    content: '売却の相談',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'ctaListings',
    type: 'text',
    content: '機械を探す',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'leftDescription',
    type: 'text',
    content: '世界中から高品質な産業機械を厳選して提供します。',
  },
  {
    pageId: 'home',
    section: 'hero',
    language: 'ja',
    key: 'rightDescription',
    type: 'text',
    content: '日本国内の中古機械を適正な市場価格で買取いたします。',
  },
];

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const results = {
      created: 0,
      updated: 0,
      unchanged: 0,
    };

    // Insert each content item, using upsert to avoid duplicates
    for (const item of heroContent) {
      const filter = {
        pageId: item.pageId,
        section: item.section,
        language: item.language,
        key: item.key,
      };

      // Check if it exists
      const existing = await Content.findOne(filter);
      
      if (existing) {
        // Update if content is different
        if (existing.content !== item.content) {
          await Content.updateOne(filter, { $set: item });
          results.updated++;
        } else {
          results.unchanged++;
        }
      } else {
        // Create new
        await Content.create(item);
        results.created++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Hero content seeded successfully',
      results,
    });
  } catch (error: any) {
    console.error('Error seeding hero content:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to seed hero content' },
      { status: 500 }
    );
  }
}
