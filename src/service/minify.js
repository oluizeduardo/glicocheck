const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-js');

const inputDir = 'src/public/includes/js';

// Get the list of JavaScript files in the input directory
const jsFiles = fs.readdirSync(inputDir).filter((file) => file.endsWith('.js'));

// Minify each file individually
// and replace the original file with the minified version.
jsFiles.forEach((file) => {
  const filePath = path.join(inputDir, file);

  // Read the source code from the file
  const code = fs.readFileSync(filePath, 'utf8');

  // Minify the code
  const result = UglifyJS.minify(code);

  // Check for any errors during minification
  if (result.error) {
    console.error(`Error during minification of file ${file}:`, result.error);
    return;
  }

  // Write the minified code back to the original file
  fs.writeFileSync(filePath, result.code, 'utf8');

  console.log(`File ${file} successfully minified and replaced.`);
});

console.log('Minification completed.');
