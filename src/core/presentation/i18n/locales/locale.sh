#!/bin/bash

TS_FILE="en.ts" # TypeScript file to be processed
OUTPUT_FILE="locales.d.ts"

echo "Generating locale type definitions from $TS_FILE..."

# Convert TypeScript to JSON using ts-node and process with jq
PATHS=$(ts-node -e "console.log(JSON.stringify(require('./$TS_FILE').default))" | jq -r 'paths | map(tostring) | join(".")')

# Write TypeScript declaration file
echo "type GenericLocale = {" > "$OUTPUT_FILE"
while IFS= read -r path; do
  echo "  '${path}': string;" >> "$OUTPUT_FILE"
done <<< "$PATHS"
echo "};" >> "$OUTPUT_FILE"

echo "export type LocaleKeys = keyof GenericLocale;" >> "$OUTPUT_FILE"

echo "Generated $OUTPUT_FILE successfully!"