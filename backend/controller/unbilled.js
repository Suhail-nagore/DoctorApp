const Unbilled = require('../Model/Unbilled');
const DoctorDB = require('../Model/Doctor');

const createUnbilled = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      address,
      phoneNo,
      referredBy,
      category,
      subcategory,
      fees,
      discount = 0,
      finalPayment,
      paymentMode,
      referralFee,
      placedBy,
    } = req.body;

    // Generate a unique serial number using timestamp and random number
    const timestamp = new Date();
    const day = String(timestamp.getDate()).padStart(2, '0');
    const month = String(timestamp.getMonth() + 1).padStart(2, '0');
    const year = timestamp.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const serialNo = `UB${day}${month}${year}${random}`;

    // Check if referredBy is valid and contains a doctor's ID
    if (referredBy && referredBy !== '0' && referredBy.toLowerCase() !== 'none') {
      const doctor = await DoctorDB.findById(referredBy);
      if (!doctor) {
        return res.status(404).json({
          message: 'Referred doctor not found',
        });
      }
    }

    // Create a new unbilled record
    const newUnbilled = new Unbilled({
      serialNo,
      name,
      age,
      gender,
      address,
      phoneNo,
      referredBy,
      category,
      subcategory,
      fees,
      discount,
      finalPayment,
      paymentMode,
      referralFee,
      placedBy,
    });

    // Save the unbilled record
    const savedUnbilled = await newUnbilled.save();

    // Send success response
    res.status(201).json({
      message: 'Unbilled record created successfully',
      unbilled: savedUnbilled,
    });

  } catch (error) {
    console.error('Error creating unbilled record:', error);
    res.status(500).json({
      message: 'Error creating unbilled record',
      error: error.message,
    });
  }
};

const fetchUnbilledOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Unbilled.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: 'Unbilled record not found',
      });
    }

    res.status(200).json({
      message: 'Unbilled record fetched successfully',
      order,
    });
  } catch (error) {
    console.error('Error fetching unbilled record:', error);
    res.status(500).json({
      message: 'Error fetching unbilled record',
      error: error.message,
    });
  }
};

const fetchAllUnbilledOrder = async (req, res) => {
  try {
    const orders = await Unbilled.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: 'All unbilled records fetched successfully',
      orders,
    });
  } catch (error) {
    console.error('Error fetching all unbilled records:', error);
    res.status(500).json({
      message: 'Error fetching all unbilled records',
      error: error.message,
    });
  }
};

const DeleteUnbilledOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Unbilled.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: 'Unbilled record not found',
      });
    }

    res.status(200).json({
      message: 'Unbilled record deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting unbilled record:', error);
    res.status(500).json({
      message: 'Error deleting unbilled record',
      error: error.message,
    });
  }
};

module.exports = {
  createUnbilled,
  fetchUnbilledOrder,
  fetchAllUnbilledOrder,
  DeleteUnbilledOrder
};
