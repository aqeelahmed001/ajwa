// Script to update API routes to use the new JWT auth system
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Define the files to update
const filesToUpdate = [
  path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'brands', '[id]', 'route.ts'),
  path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'brands', 'reorder', 'route.ts'),
  path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'brands', 'route.ts'),
  path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'settings', 'password', 'route.ts'),
  path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'settings', 'profile', 'route.ts'),
  path.join(__dirname, '..', 'src', 'app', 'api', 'admin', 'upload-avatar', 'route.ts')
];

// Define the replacements
const replacements = [
  {
    from: `import { authOptions } from '@/lib/authOptions';`,
    to: `import { getCurrentUserServer } from '@/lib/jwt';`
  },
  {
    from: `import { getServerSession } from 'next-auth';`,
    to: ``
  },
  {
    from: `import { getServerSession } from "next-auth";`,
    to: ``
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
    from: `if (!session || !session.user) {`,
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
  }
];

// Function to process a file
async function processFile(filePath) {
  try {
    console.log(`Processing ${filePath}`);
    let content = await readFile(filePath, 'utf8');
    let modified = false;
    
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
    } else {
      console.log(`No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Main function
async function main() {
  console.log('Starting API auth updates...');
  
  for (const file of filesToUpdate) {
    await processFile(file);
  }
  
  console.log('API auth updates completed!');
}

main().catch(console.error);
