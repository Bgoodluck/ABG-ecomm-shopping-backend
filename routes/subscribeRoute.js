const express = require("express")
const { registerSubscription, 
        sendSubscriptions, 
        listSubscriptions, 
        unSubscribeUser, 
        deleteSubscriber, 
        subscriberStatus 
    } = require("../controllers/subscribeController")



const router = express.Router()

router.post("/register",registerSubscription)
router.post("/send", sendSubscriptions)
router.get("/list", listSubscriptions)
router.post("/unsubscribe", unSubscribeUser)
router.delete("/delete/:email", deleteSubscriber)
router.post("/status/:email", subscriberStatus)

module.exports = router;