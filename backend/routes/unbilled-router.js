const express = require("express");
const {createUnbilled, fetchUnbilledOrder, fetchAllUnbilledOrder, DeleteUnbilledOrder} = require("../controller/unbilled");


const router = express.Router();

router.post("/createUnbilled",createUnbilled)
router.get("/fetchUnbilledOrderById/:orderId" , fetchUnbilledOrder )
router.get("/fetchAllUnbilledOrder" , fetchAllUnbilledOrder )

router.delete("/unbilled/:orderId" , DeleteUnbilledOrder )


module.exports = router;