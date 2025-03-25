const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(config.geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

async function processReaction(selectedElements, temperature, pressure, catalyst) {
  try {
    // Tạo prompt cho Gemini AI
    const prompt = `
      Hãy phân tích phản ứng hóa học giữa các nguyên tố sau: ${selectedElements.join(', ')}.
      Điều kiện phản ứng:
      - Nhiệt độ: ${temperature}
      - Áp suất: ${pressure}
      - Chất xúc tác: ${catalyst || 'Không có'}

      Trả về kết quả dưới dạng JSON với định dạng sau:
      {
        "isRealReaction": true/false, (phản ứng có thực tế không)
        "reactionEquation": "...", (phương trình phản ứng nếu có)
        "explanation": "...", (giải thích chi tiết về phản ứng)
        "funFact": "...", (thông tin thú vị hoặc hài hước liên quan)
        "danger": 0-10 (mức độ nguy hiểm của phản ứng, từ 0-10)
      }

      Nếu phản ứng không có thực, hãy trả về "isRealReaction": false và cung cấp một kết quả hài hước hoặc giả tưởng.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Phân tích phản hồi thành đối tượng JSON
    try {
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      const jsonString = text.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Lỗi khi phân tích JSON:', error);
      // Nếu không thể phân tích JSON, trả về văn bản thô
      return { 
        isRealReaction: false,
        explanation: text,
        reactionEquation: "Không thể xác định",
        funFact: "AI không thể phân tích phản ứng này.",
        danger: 0
      };
    }
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    throw error;
  }
}

module.exports = {
  processReaction
}; 