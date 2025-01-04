const orderModel = require ("../models/orderModel");
const userModel = require ("../models/userModel.js");
const Stripe = require ('stripe')
const axios = require ('axios')





// Global variables
const currency = "NGN"
const deliveryCharge = 10

// My Frontend Url
const frontend_Url = "http:localhost:3001";

// GATEWAY INITILIZATIONS
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
// const flw = process.env.FLW_SECRET_KEY


// {i am creating a code to place orders using cash on delivery Method (cod)}

exports.placeOrder = async (req, res)=>{

   try {
        const { userId, items, amount, address } = req.body

        const orderData = {
            userId,
            items,
            amount,
            address,
            payment:false,
            paymentMethod: "COD",
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        await userModel.findByIdAndUpdate(userId, {cartData: {}})

        return res.json({success: true, message: "Order Placed"});

   } catch (error) {
        console.log(error)
        return res.json({success: false, message: error.message})
   }

}


// {placing order using stripe Method}

exports.placeOrderStripe = async (req, res)=>{
    try {
        
        const { userId, items, amount, address, email } = req.body;

        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            amount,
            address,
            payment:false,
            paymentMethod: "Stripe",
            date: Date.now()
        }

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const line_items = items.map((item)=>({
            price_data: {
                currency: currency,
                unit_amount: item.price * 100,
                product_data: {
                    name: item.name
                }
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                unit_amount: deliveryCharge * 100,
                product_data: {
                    name: 'Delivery Charges'
                }
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            customer_email: email,
            mode: 'payment',
        })

             return res.json({success: true, session_url:session.url})

    } catch (error) {
        console.log(error)
        return res.json({success: false, message: error.message}); 
    }   

}
// {verifying Stripe payment}
    exports.verifyStripe = async (req,res)=>{

        const { orderId, success, userId } = req.body;

        try {
            if (success === "true") {
                await orderModel.findByIdAndUpdate(orderId, {payment:true});
                await userModel.findByIdAndUpdate(userId, {cartData: {}})
                return res.json({success: true});
            }else{
                await orderModel.findByIdAndUpdate(orderId, {payment:false});
                return res.json({success: false});
            }
        } catch (error) {
            console.log(error)
            return res.json({success: false, message: error.message}); 
        }
    }




// {placing order using Razorpay Method}

exports.placeOrderRazorpay = async (req, res)=>{

   

}



// {placing order using flutterwave Method}

// exports.placeOrderFlutterwave = async (req, res) => {
//     try {
//         const { userId, items, amount, address, email, phone } = req.body;

       
//         if (!amount || !address) {
//             return res.json({ success: false, message: 'Amount and address are required' });
//         }

        
//         const orderData = {
//             userId,
//             items,
//             amount,
//             address,
//             payment: false,
//             paymentMethod: "Flutterwave",
//             date: Date.now(),
//         };

        
//         const newOrder = new orderModel(orderData);
//         await newOrder.save();

        
//         const payload = {
//             tx_ref: newOrder._id, 
//             amount,
//             currency: 'NGN',
//             delivery_fee: deliveryCharge, 
//             redirect_url: "http://localhost:3001/cart", 
//             customer: {
//                 email,
//                 name: userId, 
//                 phonenumber: phone,
                
//             },
//             customizations: {
//                 title: 'All Buy n Go(ABG)',
//                 meta: {
//                     amount,
//                     address: JSON.stringify(address, null, 2)
//                 }
//             },
//         };

//         console.log(payload)

       
//         const responseFlutterwave = await axios.post(
//             'https://api.flutterwave.com/v3/payments',
//             payload,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, 
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );
//         // console.log('Flutterwave response:', responseFlutterwave.data);
//         return res.json({ success: true, data: { link: responseFlutterwave.data.data.link } });

        
//     } catch (error) {
//         console.error(error.response); 
//         return res.json({ success: false, message: error.message });
//     }
// };

// // Verify Flutterwave

// exports.verifyFlutterwave = async (req, res) => {
//     const { orderId, success, userId, transaction_id, tx_ref } = req.body;
//     // const { transaction_id, tx_ref } = req.query;
  
//     try {
//       console.log('Verifying transaction:', transaction_id, 'with tx_ref:', tx_ref);
  
      
//       const verifyPayment = await orderModel.findOne({ _id: tx_ref });
  
//       if (!verifyPayment) {
//         return res.json({ success: false, message: 'Payment not found' });
//       }
  
      
//       const response = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
//         headers: {
//           Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
//         },
//       });
  
//       const data = response.data;
//       console.log('Flutterwave response:', data);
  
//       if (data.status !== 'success') {
//         return res.json({ success: false, message: 'Failed to verify payment with Flutterwave' });
//       }
  
      
//       if (success === 'true') {
//         await orderModel.findByIdAndUpdate(orderId, { verifyPayment: true });
//         await userModel.findByIdAndUpdate(userId, { cartData: {} });
       
//         return res.json({ 
//             success: true, 
//             message: 'Payment verified successfully',
//             redirectUrl: '/orders'  
//         });
//     } else {
//         await orderModel.findByIdAndUpdate(orderId, { verifyPayment: false });
//         return res.json({ 
//             success: false, 
//             message: 'Payment verification failed',
//             redirectUrl: '/cart'
//         });
//     }
  
//     } catch (error) {
//       console.error('Error verifying payment:', error.message);
  
//       if (error.response) {
        
//         console.error('Flutterwave error:', error.response.data);
//       }
  
//       return res.json({
//         success: false,
//         message: 'An error occurred while verifying the payment',
//       });
//     }
//   };
  

exports.placeOrderFlutterwave = async (req, res) => {
    try {
        const { userId, items, amount, address, email, phone } = req.body;
        const { origin } = req.headers;

        if (!amount || !address) {
            return res.json({ success: false, message: 'Amount and address are required' });
        }

        const orderData = {
            userId,
            items,
            amount,
            address,
            payment: false,
            paymentMethod: "Flutterwave",
            date: Date.now(),
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        const user = await userModel.findById(userId);
        const userName = user 
        ? (user.firstName && user.lastName 
        ? `${user.firstName} ${user.lastName}` 
        : user.firstName || user.lastName || 'Customer')
        : 'Customer';

        const payload = {
            tx_ref: newOrder._id, 
            amount,
            currency: 'NGN',
            delivery_fee: deliveryCharge, 
            redirect_url: `${origin}/verify?success=true&orderId=${newOrder._id}&userId=${userId}`, 
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}&userId=${userId}`,
            customer: {
                email: user?.email,
                name: userName, 
                phonenumber: phone,
            },
            customizations: {
                title: 'All Buy n Go(ABG)',
                meta: {
                    amount,
                    address: JSON.stringify(address, null, 2)
                }
            },
        };

        const responseFlutterwave = await axios.post(
            'https://api.flutterwave.com/v3/payments',
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`, 
                    'Content-Type': 'application/json',
                },
            }
        );

        return res.json({ success: true, data: { link: responseFlutterwave.data.data.link } });
        
    } catch (error) {
        console.error(error.response); 
        return res.json({ success: false, message: error.message });
    }
};

// Simplified Flutterwave Verification
exports.verifyFlutterwave = async (req, res) => {
    const { orderId, success, userId } = req.body;

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            return res.json({ success: true });
        } else {
            await orderModel.findByIdAndUpdate(orderId, { payment: false });
            return res.json({ success: false });
        }
    } catch (error) {
        console.error(error);
        return res.json({ success: false, message: error.message }); 
    }
};



// {All Order Data for Admin Panel}

exports.allOrders = async (req, res)=>{

        try {

            const orders = await orderModel.find({});

            return res.json({
                success: true,
                message: 'All Orders',
                orders
            })
           

        } catch (error) {
            console.error('User orders error:', error)
            return res.status(500).json({
                success: false, 
                message: error.message || 'Failed to retrieve orders'
            })  
        } 

}


// {User Order Data for frontend}

exports.userOrders = async (req, res) => {
    try {
        const { userId } = req.body;

        // Add validation
        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'User ID is required' 
            });
        }

        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
        
        return res.json({
            success: true, 
            orders
        });

    } catch (error) {
        console.error('User orders error:', error)
        return res.status(500).json({
            success: false, 
            message: error.message || 'Failed to retrieve orders'
        })  
    }
}


// {update order status from Admin panel}

exports.updateStatus = async (req, res)=>{
    try {
        
           const { orderId, status } = req.body;
           
           await orderModel.findByIdAndUpdate(orderId, {status })
           return res.json({
            success: true, 
            message: 'Status Updated'
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error updating status",
            error: error.message
        });
      }
   

}

