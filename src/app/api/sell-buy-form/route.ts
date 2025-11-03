import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { uploadImageServer } from '@/lib/cloudinary-server';
import { EMAIL_CONFIG, SECURITY_CONFIG } from '@/lib/env';
import { validateFormData, isValidImage, checkRateLimit, generateSecureFilename } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown-ip';
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 } // Too Many Requests
      );
    }
    
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
    
    // Validate and sanitize form data
    const formDataObj = {
      name, email, phone, company, machineType, machineMake,
      machineModel, machineYear, machineCondition, budget, timeline, additionalInfo
    };
    
    const { isValid, sanitizedData, errors } = validateFormData(formDataObj);
    
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid form data', validationErrors: errors },
        { status: 400 }
      );
    }
    
    // Check required fields
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.phone || !sanitizedData.machineType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Process file uploads if any
    const uploadedFiles = [];
    let fileCount = 0;
    
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof Blob) {
        const file = value as File;
        
        // Check file count limit
        if (fileCount >= SECURITY_CONFIG.MAX_FILES_PER_UPLOAD) {
          break;
        }
        
        // Validate file
        if (!isValidImage(file)) {
          console.warn(`Skipping invalid file: ${file.name}`);
          continue;
        }
        
        try {
          // Generate secure filename
          const secureFilename = generateSecureFilename(file.name);
          
          // Convert file to buffer and then to base64
          const buffer = Buffer.from(await file.arrayBuffer());
          const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
          
          // Upload to Cloudinary in a specific folder for machinery inquiries
          const cloudinaryFolder = formType === 'sell' ? 'ajwa/machinery-sell' : 'ajwa/machinery-buy';
          const fileUrl = await uploadImageServer(dataUri, cloudinaryFolder);
          
          // Add the URL to our uploaded files array
          uploadedFiles.push(fileUrl);
          fileCount++;
        } catch (error) {
          console.error('Error uploading file to Cloudinary:', error);
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
    
    // Log the form submission
    console.log('Form submission:', formSubmission);
    
    // Send email with form data and attachments
    try {
      // Create a transporter
      const transporter = nodemailer.createTransport({
        host: EMAIL_CONFIG.HOST,
        port: EMAIL_CONFIG.PORT,
        secure: EMAIL_CONFIG.SECURE,
        auth: {
          user: EMAIL_CONFIG.USER,
          pass: EMAIL_CONFIG.PASSWORD,
        },
      });
      
      // Prepare email content
      const emailSubject = formType === 'sell' 
        ? 'New Machinery Selling Inquiry' 
        : 'New Machinery Buying Inquiry';
      
      // Create HTML content for email
      let emailContent = `
        <h1>${emailSubject}</h1>
        <h2>Contact Information</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
        
        <h2>Machinery Details</h2>
        <p><strong>Type:</strong> ${machineType}</p>
        ${machineMake ? `<p><strong>Make:</strong> ${machineMake}</p>` : ''}
        ${machineModel ? `<p><strong>Model:</strong> ${machineModel}</p>` : ''}
        ${machineYear ? `<p><strong>Year:</strong> ${machineYear}</p>` : ''}
        ${machineCondition ? `<p><strong>Condition:</strong> ${machineCondition}</p>` : ''}
        ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
        ${timeline ? `<p><strong>Timeline:</strong> ${timeline}</p>` : ''}
        
        ${additionalInfo ? `
        <h2>Additional Information</h2>
        <p>${additionalInfo}</p>
        ` : ''}
      `;
      
      // Add images section if there are uploaded files
      if (uploadedFiles.length > 0) {
        emailContent += `
          <h2>Uploaded Images</h2>
          <p>${uploadedFiles.length} image(s) were uploaded. They are attached to this email and also available on Cloudinary.</p>
          <div style="margin-top: 20px;">
            ${uploadedFiles.map((url, index) => `
              <div style="margin-bottom: 15px;">
                <p><strong>Image ${index + 1}:</strong> <a href="${url}" target="_blank">${url}</a></p>
                <img src="${url}" alt="Uploaded Image ${index + 1}" style="max-width: 300px; max-height: 200px; border: 1px solid #ddd; border-radius: 4px; padding: 5px;">
              </div>
            `).join('')}
          </div>
        `;
      }
      
      // Prepare attachments
      const attachments = uploadedFiles.map((fileUrl, index) => ({
        filename: `image-${index + 1}.jpg`,
        path: fileUrl,
      }));
      
      // Send email
      await transporter.sendMail({
        from: EMAIL_CONFIG.FROM,
        to: EMAIL_CONFIG.TO,
        subject: emailSubject,
        html: emailContent,
        attachments,
      });
      
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue with the response even if email fails
    }
    
    // In a production application, you would also:
    // 1. Save to database
    // 2. Process the submission as needed
    
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
