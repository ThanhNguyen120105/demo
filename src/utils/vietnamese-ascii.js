// Convert Vietnamese text to ASCII-safe format for PDF
export const vietnameseToAscii = (text) => {
  if (!text) return text;
  
  // Vietnamese to ASCII mapping
  const vietnameseMap = {
    // A variants
    'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
    'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
    'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
    'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A',
    'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
    'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A',
    
    // E variants
    'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
    'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
    'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E', 'Ẹ': 'E',
    'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E',
    
    // I variants
    'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
    'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I', 'Ị': 'I',
    
    // O variants
    'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
    'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
    'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
    'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Õ': 'O', 'Ọ': 'O',
    'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O',
    'Ơ': 'O', 'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O',
    
    // U variants
    'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
    'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
    'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U',
    'Ư': 'U', 'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U',
    
    // Y variants
    'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y',
    'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    
    // D variants
    'đ': 'd', 'Đ': 'D'
  };
  
  // Replace Vietnamese characters
  let result = text;
  Object.keys(vietnameseMap).forEach(viet => {
    const ascii = vietnameseMap[viet];
    result = result.replace(new RegExp(viet, 'g'), ascii);
  });
  
  return result;
};

// Convert Vietnamese text to readable ASCII with tone marks
export const vietnameseToReadableAscii = (text) => {
  if (!text) return text;
  
  const readableMap = {
    // Keep the base characters but indicate tones
    'á': 'a\'', 'à': 'a`', 'ả': 'a?', 'ã': 'a~', 'ạ': 'a.',
    'ă': 'aw', 'ắ': 'aw\'', 'ằ': 'aw`', 'ẳ': 'aw?', 'ẵ': 'aw~', 'ặ': 'aw.',
    'â': 'aa', 'ấ': 'aa\'', 'ầ': 'aa`', 'ẩ': 'aa?', 'ẫ': 'aa~', 'ậ': 'aa.',
    
    'é': 'e\'', 'è': 'e`', 'ẻ': 'e?', 'ẽ': 'e~', 'ẹ': 'e.',
    'ê': 'ee', 'ế': 'ee\'', 'ề': 'ee`', 'ể': 'ee?', 'ễ': 'ee~', 'ệ': 'ee.',
    
    'í': 'i\'', 'ì': 'i`', 'ỉ': 'i?', 'ĩ': 'i~', 'ị': 'i.',
    
    'ó': 'o\'', 'ò': 'o`', 'ỏ': 'o?', 'õ': 'o~', 'ọ': 'o.',
    'ô': 'oo', 'ố': 'oo\'', 'ồ': 'oo`', 'ổ': 'oo?', 'ỗ': 'oo~', 'ộ': 'oo.',
    'ơ': 'ow', 'ớ': 'ow\'', 'ờ': 'ow`', 'ở': 'ow?', 'ỡ': 'ow~', 'ợ': 'ow.',
    
    'ú': 'u\'', 'ù': 'u`', 'ủ': 'u?', 'ũ': 'u~', 'ụ': 'u.',
    'ư': 'uw', 'ứ': 'uw\'', 'ừ': 'uw`', 'ử': 'uw?', 'ữ': 'uw~', 'ự': 'uw.',
    
    'ý': 'y\'', 'ỳ': 'y`', 'ỷ': 'y?', 'ỹ': 'y~', 'ỵ': 'y.',
    
    'đ': 'dd', 'Đ': 'DD'
  };
  
  let result = text;
  Object.keys(readableMap).forEach(viet => {
    const readable = readableMap[viet];
    result = result.replace(new RegExp(viet, 'g'), readable);
  });
  
  return result;
};

// Simple ASCII conversion (most compatible)
export const vietnameseToSimpleAscii = (text) => {
  if (!text) return text;
  
  return text
    .normalize('NFD') // Decompose characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}; 