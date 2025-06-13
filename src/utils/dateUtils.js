// Hàm format ngày tháng theo định dạng tiếng Việt
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  
  const months = [
    'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
    'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
  ];
  
  return `${day} ${months[month - 1]} ${year}`;
};

// Hàm format thời gian
export const formatTime = (timeString) => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Hàm format ngày giờ đầy đủ
export const formatDateTime = (dateString, timeString) => {
  return `${formatDate(dateString)} ${formatTime(timeString)}`;
}; 