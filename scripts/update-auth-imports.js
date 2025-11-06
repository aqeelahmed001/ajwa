// Script to update auth-server imports to jwt imports
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Define the directories to search
const directories = [
  path.join(__dirname, '..', 'src', 'app', 'api'),
  path.join(__dirname, '..', 'src', 'components', 'admin'),
  path.join(__dirname, '..', 'src', 'lib')
];

// Define the replacements
const replacements = [
  {
    from: `import { getServerSession } from 'next-auth';`,
    to: ``
  },
  {
    from: `import { getServerSession } from "next-auth";`,
    to: ``
  },
  {
    from: `import { authOptions } from '@/lib/auth-server';`,
    to: `import { getCurrentUserServer } from '@/lib/jwt';`
  },
  {
    from: `import { authOptions } from "@/lib/auth-server";`,
    to: `import { getCurrentUserServer } from "@/lib/jwt";`
  },
  {
    from: `const session = await getServerSession(authOptions);`,
    to: `const user = await getCurrentUserServer();`
  },
  {
    from: `if (!session?.user) {`,
    to: `if (!user) {`
  },
  {
    from: `session?.user?.id`,
    to: `user?.id`
  },
  {
    from: `session?.user?.role`,
    to: `user?.role`
  },
  {
    from: `session?.user?.email`,
    to: `user?.email`
  },
  {
    from: `session.user.id`,
    to: `user.id`
  },
  {
    from: `session.user.role`,
    to: `user.role`
  },
  {
    from: `session.user.email`,
    to: `user.email`
  },
  {
    from: `{ success: false, message: 'Unauthorized' }`,
    to: `{ success: false, error: 'Unauthorized' }`
  }
];

// Function to walk through directories
async function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await walkDir(filePath);
    } else if (stat.isFile() && 
              (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) && 
              !filePath.includes('auth-server.ts') &&
              !filePath.includes('jwt.ts')) {
      await processFile(filePath);
    }
  }
}

// Function to process a file
async function processFile(filePath) {
  try {
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
    // Check if the file imports or uses auth-server
    if (content.includes('auth-server') || 
        content.includes('getServerSession') || 
        content.includes('session?.user') ||
        content.includes('session.user')) {
      
      console.log(`Processing ${filePath}`);
      
      // Apply replacements
      for (const replacement of replacements) {
        if (content.includes(replacement.from)) {
          content = content.replace(new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement.to);
          modified = true;
        }
      }
      
      // Write the file if modified
      if (modified) {
        await writeFile(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  console.log('Starting auth import updates...');
  
  for (const dir of directories) {
    await walkDir(dir);
  }
  
  console.log('Auth import updates completed!');
}

main().catch(console.error);
