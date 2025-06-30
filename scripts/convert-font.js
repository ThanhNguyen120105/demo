const fs = require('fs');
const path = require('path');

// Đọc font file Roboto
const fontPath = path.join(__dirname, '../src/assets/fonts/Roboto-Regular.ttf');
const outputPath = path.join(__dirname, '../src/utils/roboto-font.js');

try {
  // Kiểm tra file tồn tại
  if (!fs.existsSync(fontPath)) {
    console.error('❌ Font file not found:', fontPath);
    process.exit(1);
  }
  
  console.log('📁 Reading font from:', fontPath);
  
  // Đọc font file thành buffer
  const fontBuffer = fs.readFileSync(fontPath);
  
  console.log('📊 Font file size:', (fontBuffer.length / 1024).toFixed(2), 'KB');
  
  // Convert thành base64
  const base64Font = fontBuffer.toString('base64');
  
  console.log('📊 Base64 size:', (base64Font.length / 1024).toFixed(2), 'KB');
  
  // Tạo module JavaScript export font
  const fontModule = `// Auto-generated font file for jsPDF
// Font: Roboto Regular
// Generated: ${new Date().toISOString()}

export const robotoFont = '${base64Font}';

export const robotoFontConfig = {
  fontName: 'Roboto',
  fontStyle: 'normal',
  fontWeight: 'normal'
};

// Helper function to add font to jsPDF
export const addRobotoFont = (doc) => {
  try {
    doc.addFileToVFS('Roboto-Regular.ttf', robotoFont);
    doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
    return true;
  } catch (error) {
    console.error('Error adding Roboto font:', error);
    return false;
  }
};
`;

  // Ghi file
  fs.writeFileSync(outputPath, fontModule);
  
  console.log('✅ Font converted successfully!');
  console.log(`📁 Output: ${outputPath}`);
  console.log(`📊 Final file size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('❌ Error converting font:', error.message);
  process.exit(1);
} 