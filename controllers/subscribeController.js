const transporter  = require("../config/nodemailer");
const Subscriber = require("../models/subscribeModel");




exports.registerSubscription = async(req, res)=>{
    try {
        const { email } = req.body;
    
        // Check if email already exists
        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
          return res.status(400).json({ message: 'Email already subscribed' });
        }
    
        // Create new subscriber
        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
    
        // Optional: Send welcome email
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Welcome to Our Newsletter!',
          html: `
            <h1>Thank you for subscribing!</h1>
            <p>You'll now receive exclusive updates and your first 5% discount.</p>
          `
        });
    
        return res.status(201).json({ message: 'Successfully subscribed' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Subscription failed', error: error.message });
      }
    
}


exports.sendSubscriptions = async(req, res)=>{
    try {
        const { subject, content } = req.body;
    
        // Find all active subscribers
        const subscribers = await Subscriber.find({ isActive: true });
    
        // Send emails to all subscribers
        const emailPromises = subscribers.map(subscriber => 
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: subscriber.email,
            subject: subject,
            html: content,
          })
        );
    
        await Promise.all(emailPromises);
    
        return res.status(200).json({ 
          message: 'Newsletter sent successfully', 
          recipientCount: subscribers.length 
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send newsletter', error: error.message });
      }
}


exports.listSubscriptions = async(req,res)=>{
    try {
        const subscribers = await Subscriber.find({}, 'email subscribedAt');
       return res.status(200).json(subscribers);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching subscribers', error: error.message });
      }
}


exports.unSubscribeUser = async(req,res)=>{
  try {
    const { email } = req.body;

    // Find and update the subscriber
    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { isActive: false },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ message: 'Email not found in our subscribers list' });
    }

    // Optional: Send unsubscribe confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Unsubscribe Confirmation',
      html: `
        <h1>Unsubscribe Confirmation</h1>
        <p>You have been unsubscribed from our newsletter. We're sorry to see you go.</p>
        <p>If this was a mistake, you can always resubscribe on our website.</p>
      `
    });

    return res.status(200).json({ message: 'Successfully unsubscribed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unsubscribe failed', error: error.message });
  }
}


exports.deleteSubscriber = async(req,res)=>{
  try {
    const { email } = req.params;

    const result = await Subscriber.findOneAndDelete({ email });

    if (!result) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    return res.status(200).json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscriber', error: error.message });
  }
}


exports.subscriberStatus = async(req, res)=>{
  try {
    const { email } = req.params;
    const { isActive } = req.body;

    const subscriber = await Subscriber.findOneAndUpdate(
      { email },
      { isActive },
      { new: true }
    );

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    return res.status(200).json({ 
      message: `Subscriber ${isActive ? 'activated' : 'deactivated'}`, 
      subscriber 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating subscriber status', error: error.message });
  }
}