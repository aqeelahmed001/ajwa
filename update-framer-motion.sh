#!/bin/bash

# This script updates all components using framer-motion to use dynamic imports

# Find all files that import framer-motion
files=$(grep -l "import.*framer-motion" --include="*.tsx" --include="*.ts" -r /Users/husnain/Desktop/webs/ajwa/src)

echo "Found $(echo "$files" | wc -l) files importing framer-motion"

# For each file, check if it has "use client" directive
for file in $files; do
  if ! grep -q "\"use client\"" "$file"; then
    echo "Adding 'use client' directive to $file"
    sed -i '' '1i\
"use client";\
' "$file"
  fi
  
  echo "Updating framer-motion imports in $file"
  # Replace direct framer-motion imports with dynamic imports
  sed -i '' 's/import { motion.* } from '\''framer-motion'\''/import dynamic from '\''next\/dynamic'\''\
const motion = dynamic(() => import('\''framer-motion'\'').then(mod => mod.motion), { ssr: false })/' "$file"
done

echo "Done updating files"
