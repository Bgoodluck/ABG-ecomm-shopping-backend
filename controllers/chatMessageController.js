const ChatMessage = require("../models/chatMessage");

exports.getChatHistory = async (req, res) => {
    try {
      // Ensure req.user is set by authToken middleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized'
        });
      }
  
      const { userId } = req.params;
  
      // Additional validation
      if (userId !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: 'Access denied'
        });
      }
  
      const messages = await ChatMessage.find({
        'customerInfo.userId': userId
      })
      .sort({ timestamp: 1 })
      .limit(50); 
  
      return res.status(200).json({
        success: true,
        messages
      });
    } catch (error) {
      console.error('Chat History Error:', error);
      res.status(500).json({
        success: false,
        error: 'Error fetching chat history',
        details: error.message
      });
    }
  };

exports.createChatMessage = async (data) => {
  try {
    const newMessage = new ChatMessage({
      sender: data.sender,
      message: data.message,
      customerInfo: data.customerInfo,
      type: data.type || 'customer'
    });
    
    await newMessage.save();
    return newMessage;
  } catch (error) {
    console.error('Create Message Error:', error);
    throw error;
  }
};