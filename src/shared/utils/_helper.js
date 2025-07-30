/* * Helper functions for date manipulation
 * These functions are used to calculate the difference in days between two dates.
    * They are used in the chalet details page to determine the number of days between the start and end dates.
    */
export function getDayDifference(dateString1, dateString2) {
    const date1 = new Date(dateString1);
    const date2 = new Date(dateString2);

    const time1 = date1.getTime();
    const time2 = date2.getTime();

    const diffInMs = Math.abs(time2 - time1);
    const oneDayInMs = 1000 * 60 * 60 * 24;

    const diffInDays = Math.floor(diffInMs / oneDayInMs);
    return diffInDays;
}

export async function createBlobFromURL(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
}

export async function createFileFromUrl(url) {
    const response = await fetch(url);
    const blob = await response.blob();

    // Get filename from URL if possible
    const urlParts = url.split('/');
    let filename = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
    if (!filename.includes('.')) {
        filename = 'download'; // Fallback if no extension
    }

    // Try to get type from response headers if available
    const contentType = response.headers.get('Content-Type') || blob.type || 'application/octet-stream';

    // If filename has no extension but we have a type, try to infer extension
    if (!/\.[a-zA-Z0-9]+$/.test(filename) && contentType.startsWith('image/')) {
        const ext = contentType.split('/')[1];
        filename += '.' + ext;
    }

    return new File([blob], filename, { type: contentType });
}

export function deepEqual(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    
    for (let key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        const areObjects = val1 && typeof val1 === 'object' && val2 && typeof val2 === 'object';
        if ((areObjects && !deepEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
            return false;
        }
    }
    return true;
}

export  function filesAreEqual(file1, file2) {
  // Step 1: Basic checks

  return !(
    file1.size !== file2.size ||
    file1.type !== file2.type || 
    file1.name !== file2.name
  ) 
//   return false;


//   // Step 2: Read both files as ArrayBuffers
//   const buffer1 = await file1.arrayBuffer();
//   const buffer2 = await file2.arrayBuffer();

//   // Step 3: Compare binary data
//   if (buffer1.byteLength !== buffer2.byteLength) return false;

//   const view1 = new Uint8Array(buffer1);
//   const view2 = new Uint8Array(buffer2);

//   for (let i = 0; i < view1.length; i++) {
//     if (view1[i] !== view2[i]) return false;
//   }

//   return true;
}

export function buildShareText(data) {
    const message = `
🏡 * ${data.name} *
🏷️ * ${data.type} *
💰 *السعر لليلة:* ${data.price} جنيه فقط  
🔑 *الكود الخاص بالشالية:* ${data.code}  
🛏️ *عدد الغرف:* ${data.bedrooms || 0}  
👥 *عدد الضيوف:* ${data.guests}  
📍 *القرية:* ${data.village.name}  

📲 رابط الحجز والمزيد من التفاصيل: 
 ${data.link}
`;
    return message
}

