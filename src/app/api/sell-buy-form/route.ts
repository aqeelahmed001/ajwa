import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const formType = formData.get('formType') as string;
    
    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const company = formData.get('company') as string;
    const machineType = formData.get('machineType') as string;
    const machineMake = formData.get('machineMake') as string;
    const machineModel = formData.get('machineModel') as string;
    const machineYear = formData.get('machineYear') as string;
    const machineCondition = formData.get('machineCondition') as string;
    const budget = formData.get('budget') as string;
    const timeline = formData.get('timeline') as string;
    const additionalInfo = formData.get('additionalInfo') as string;
    
    // Check required fields
    if (!name || !email || !phone || !machineType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process file uploads if any
    const uploadedFiles = [];
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof Blob) {
        const file = value as File;
        const fileName = `${uuidv4()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Save to public/uploads directory
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        
        try {
          // Save the file
          await writeFile(path.join(uploadDir, fileName), buffer);
          uploadedFiles.push(`/uploads/${fileName}`);
        } catch (error) {
          console.error('Error saving file:', error);
        }
      }
    }
    
    // Create form submission data
    const formSubmission = {
      id: uuidv4(),
      type: formType,
      name,
      email,
      phone,
      company,
      machineType,
      machineMake,
      machineModel,
      machineYear,
      machineCondition,
      budget,
      timeline,
      additionalInfo,
      files: uploadedFiles,
      submittedAt: new Date().toISOString(),
    };
    
    // Here you would typically save this to a database
    // For now, we'll just log it
    console.log('Form submission:', formSubmission);
    
    // In a real application, you would:
    // 1. Save to database
    // 2. Send notification email
    // 3. Process the submission as needed
    
    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing form:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process form' },
      { status: 500 }
    );
  }
}
