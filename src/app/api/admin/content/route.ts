import { NextRequest, NextResponse } from 'next/server';
import { Content } from '@/models/content';
import dbConnect from '@/lib/db';

function isAuthenticated(request: NextRequest) {
  const authCookie = request.cookies.get('admin-auth');
  return authCookie?.value === 'true';
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    await dbConnect();
    
    const content = await Content.create(body);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
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
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
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
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
