// const axios = require('axios');
// require('dotenv').config();

// exports.generateAIResponse = async (req, res) => {
//   try {
//     const { message } = req.body;

//     // Validate input
//     if (!message) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Message is required' 
//       });
//     }

//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           { 
//             "role": "system", 
//             "content": "You are a helpful customer support assistant that provides concise and friendly responses." 
//           },
//           { 
//             "role": "user", 
//             "content": message 
//           }
//         ],
//         max_tokens: 150  // Limit response length
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );

//     const aiReply = response.data.choices[0].message.content.trim();
    
//     res.json({ 
//       success: true, 
//       message: aiReply 
//     });
//   } catch (error) {
//     console.error('AI Response Error:', error.response ? error.response.data : error.message);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to generate AI response',
//       error: error.response ? error.response.data : error.message
//     });
//   }
// };


// const OpenAI = require('openai');

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// exports.generateAIResponse = async (req, res) => {
//     try {
//       const { message } = req.body;
  
//       if (!message) {
//         return res.status(400).json({ 
//           success: false, 
//           message: 'Message is required' 
//         });
//       }
  
//       const response = await openai.chat.completions.create({
//         model: "gpt-3.5-turbo",
//         messages: [
//           { role: "system", content: "You are a helpful assistant." },
//           { role: "user", content: message }
//         ],
//         max_tokens: 100,
//         temperature: 0.7
//       });
  
//       res.json({ 
//         success: true, 
//         message: response.choices[0].message.content.trim() 
//       });
//     } catch (error) {
//       console.error('Full OpenAI Error:', error);
//       res.status(500).json({ 
//         success: false, 
//         message: 'Failed to generate AI response',
//         errorDetails: {
//           name: error.name,
//           message: error.message,
//           stack: error.stack
//         }
//       });
//     }
//   };



const axios = require('axios');

exports.generateAIResponse = async (req, res) => {
    try {
      const { message } = req.body;
      
      // Botpress API endpoint (you'll need to set this up)
      const botpressResponse = await axios.post('YOUR_BOTPRESS_WEBHOOK_URL', {
        message,
        context: {
          // Add any user context if needed
        }
      });
  
      res.json({
        success: true,
        message: botpressResponse.data.response
      });
    } catch (error) {
      console.error('Botpress AI Error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to generate AI response'
      });
    }
  };