#!/bin/bash
npm install @11ty/eleventy-navigation --save-dev
# Find all .md files, skipping the node_modules directory
find "$(pwd)" -path "$(pwd)/node_modules" -prune -o -type f -name "*.md" -print | while read -r file; do
  # Get the relative path of the file
  relative_path="${file#$(pwd)/}"
  # Check if the first three non-whitespace characters in the file are not '---'
  if ! head -n 1 "$file" | grep -q '^---'; then
    # Get the filename without the rest of the path and without the .md extension
    filename="$(basename "$file" .md)"
    # Get the parent directory of the file
    parent_dir="$(basename "$(dirname "$file")")"
    # Print the relative path, the filename, and the parent directory
    echo "Added frontmatter to $relative_path"
    # Create the new content to prepend
    new_content="---
layout: layout-sidebar
title: $filename
eleventyNavigation:
  key: $filename
  title: $filename
  parent: $parent_dir
  # order: 42
# FIXME - Values shown above are currently derived from the file path only, except order which is also commented out because it is optional. Correct as desired and delete comment(s).
---
"
    # Prepend the new content to the file
    temp_file=$(mktemp)
    echo "$new_content" > "$temp_file"
    cat "$file" >> "$temp_file"
    mv "$temp_file" "$file"
  
  else
    # Print the message for files that are not processed
    echo "Has frontmatter $relative_path"
  fi
done
