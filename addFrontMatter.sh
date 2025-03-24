#!/bin/bash
npm install @11ty/eleventy-navigation --save-dev

# Define the site directory
SITE_DIR="$(pwd)/site"

# Ensure the site directory exists
if [ ! -d "$SITE_DIR" ]; then
  echo "Error: 'site' directory does not exist in $(pwd)"
  exit 1
fi

# Check if the script is called with the `-strip` argument
STRIP_FRONTMATTER=false
if [ "$1" == "-strip" ]; then
  STRIP_FRONTMATTER=true
fi

# Function to remove existing front matter
remove_frontmatter() {
  awk '
    BEGIN { skip=0 }
    /^---$/ && NR==1 { skip=1; next } # Start skipping when first '---' is encountered at the beginning
    /^---$/ && skip { skip=0; next } # Stop skipping when second '---' is found
    !skip # Print only non-skipped lines
  ' "$1" > "$1.tmp" && mv "$1.tmp" "$1"
}

# Function to transform a string into a proper name format
format_proper_name() {
  echo "$1" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2)); print}'
}

# Find all .md files only within the 'site' directory, skipping the node_modules directory
find "$SITE_DIR" -path "$SITE_DIR/node_modules" -prune -o -type f -name "*.md" -print | while read -r file; do
  # Get the relative path of the file from the 'site' directory
  relative_path="${file#$SITE_DIR/}"

  if $STRIP_FRONTMATTER; then
    echo "Stripping existing frontmatter from $relative_path"
    remove_frontmatter "$file"
  fi

  # Check if the first three non-whitespace characters in the file are not '---'
  if ! head -n 1 "$file" | grep -q '^---'; then
    # Get the filename without the rest of the path and without the .md extension
    filename="$(basename "$file" .md)"
    parent_dir="$(basename "$(dirname "$file")")"
    grandparent_dir="$(basename "$(dirname "$(dirname "$file")")")"

    # Create properly formatted names
    properFileName=$(format_proper_name "$filename")
    properParentFileName=$(format_proper_name "$parent_dir")
    properGrandparentFileName=$(format_proper_name "$grandparent_dir")

    # Print details
    echo "Processing: $relative_path"
    echo "  Parent Dir: $parent_dir ($properParentFileName)"
    echo "  Grandparent Dir: $grandparent_dir ($properGrandparentFileName)"
    echo "  File Name: $filename ($properFileName)"

    # Determine whether to include `parent` in front matter
    file_field="key: $filename   "
    parent_field="parent: $filename"
    if [[ "$filename" != "index" ]]; then
      parent_field="  parent: $parent_dir"
    fi
    if [[ "$filename" == "index" ]]; then
      parent_field="  parent: $grandparent_dir"
      file_field="  key: $parent_dir"
      title_field="  title: $properParentFileName"
    fi
    if [[ "$filename" != "index" ]]; then
      parent_field="  parent: $parentFileName"
      file_field="  key: $filename"
      title_field="  title: $properFileName"
    fi
    if [[ "$filename" == "index" && "$grandparent_dir" == "site" ]]; then
      parent_field=""
    fi
    if [[ "$filename" != "index" && "$parent_dir" == "site" ]]; then
      parent_field=""
    fi

    # Create the new content to prepend
    new_content="---
layout: layout-sidebar
title: $properParentFileName
eleventyNavigation:
$file_field
$title_field
$parent_field
  # order: 42
---
"
    # Remove empty lines (from unset parent field)
    new_content=$(echo "$new_content" | sed '/^$/N;/^\n$/D')

    # Prepend the new content to the file
    temp_file=$(mktemp)
    echo "$new_content" > "$temp_file"
    cat "$file" >> "$temp_file"
    mv "$temp_file" "$file"

  else
    # Print message for files that already have front matter
    echo "Has frontmatter $relative_path"
  fi
done
