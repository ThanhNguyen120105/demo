const fs = require('fs');
const path = require('path');

// Script to convert Roboto font to base64 for jsPDF
function convertFontToBase64() {
  const fontPath = path.join(__dirname, '../src/assets/fonts/Roboto-Regular.ttf');
  const outputPath = path.join(__dirname, '../src/utils/roboto-base64.js');
  
  try {
    console.log('🔤 Converting Roboto font to base64...');
    
    // Check if font file exists
    if (!fs.existsSync(fontPath)) {
      console.error('❌ Font file not found:', fontPath);
      console.log('Available files in fonts directory:');
      const fontsDir = path.dirname(fontPath);
      if (fs.existsSync(fontsDir)) {
        fs.readdirSync(fontsDir).forEach(file => {
          console.log('  -', file);
        });
      }
      return;
    }
    
    // Read font file
    const fontBuffer = fs.readFileSync(fontPath);
    const base64Font = fontBuffer.toString('base64');
    
    console.log('✅ Font loaded, size:', (fontBuffer.length / 1024).toFixed(2), 'KB');
    
    // Create output JavaScript file
    const jsContent = `// Auto-generated Roboto font for jsPDF Vietnamese support
// Generated at: ${new Date().toISOString()}

export const robotoBase64 = "${base64Font}";

export const robotoConfig = {
  fontName: 'Roboto',
  fontStyle: 'normal',
  encoding: 'UTF-8',
  size: ${fontBuffer.length}
};

console.log('📝 Roboto font loaded for Vietnamese PDF support');
`;
    
    // Write output file
    fs.writeFileSync(outputPath, jsContent);
    
    console.log('✅ Base64 font generated successfully!');
    console.log('📁 Output file:', outputPath);
    console.log('📊 Base64 size:', (base64Font.length / 1024).toFixed(2), 'KB');
    console.log('📊 Original size:', (fontBuffer.length / 1024).toFixed(2), 'KB');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error converting font:', error.message);
    return false;
  }
}

// Run the conversion
if (require.main === module) {
  convertFontToBase64();
}

module.exports = { convertFontToBase64 }; 