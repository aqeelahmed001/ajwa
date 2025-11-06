import { NextRequest, NextResponse } from 'next/server';
import { Content } from '@/models/content';
import dbConnect from '@/lib/db';
import { getCurrentUser } from '@/lib/jwt';

async function isAuthenticated(request: NextRequest) {
  // Use our JWT auth system
  const user = await getCurrentUser(request);
  console.log('Content API auth check:', user ? 'Authenticated' : 'Not authenticated');
  return user !== null;
}

export async function GET(request: NextRequest) {
  try {
    // Allow public access to GET requests for content
    // Only check authentication for admin routes to modify content

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const section = searchParams.get('section');
    const language = searchParams.get('language');

    await dbConnect();
    
    const query = {
      ...(pageId && { pageId }),
      ...(section && { section }),
      ...(language && { language }),
    };
    
    console.log('Content API query:', query);

    const contents = await Content.find(query).sort({ order: 1 });
    console.log(`Found ${contents.length} content items:`, contents.map(c => ({ key: c.key, language: c.language, content: c.content.substring(0, 30) + (c.content.length > 30 ? '...' : '') })));
    
    return NextResponse.json(contents);
  } catch (error) {
    console.error('Content API GET error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();
    
    const content = await Content.create(body);
    console.log('Content created:', content);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Content API POST error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!await isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { _id, ...updateData } = body;

    await dbConnect();
    
    const content = await Content.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    if (!content) {
      console.log('Content not found for update:', _id);
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    console.log('Content updated:', content);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Content API PUT error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!await isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await dbConnect();
    
    const content = await Content.findByIdAndDelete(id);
    if (!content) {
      console.log('Content not found for deletion:', id);
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    console.log('Content deleted:', id);
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Content API DELETE error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
