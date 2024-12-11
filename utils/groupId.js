import crypto from 'crypto'; // For generating random alphanumeric strings

export function generateGroupId(groupName) {
  const now = new Date();

  // Extract the first letter of each word in the group name
  const firstLetters = groupName
    .split(/[\s_\-,]+/) // Split by spaces, underscores, hyphens, or commas
    .map(word => word.charAt(0).toUpperCase()) // Get the first letter of each word and convert to uppercase
    .join(''); // Combine them into a single string

  const month = now.toLocaleString('default', { month: 'short' }); // First three letters of the month
  const year = now.getFullYear().toString().slice(-2); // Last two digits of the year
  const randomString = crypto.randomBytes(2).toString('hex').toUpperCase(); // 4-character alphanumeric

  return `${firstLetters}${month}${year}${randomString}`;
}
