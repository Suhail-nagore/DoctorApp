const Operator = require("../Model/Operator");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const OpLogin = async (req, res) => {
    const { username, password } = req.body;
    

    try {
        // Find the admin by username
        const operator = await Operator.findOne({ username });

        // Log the retrieved admin for debugging
        // console.log('Admin found:', admin);

        // If admin not found
        if (!operator) {
            return res.status(400).json({ message: 'Operator not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, operator.password);

        // If password is incorrect
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token with admin id
      const token = jwt.sign({ operator, role: 'operator' }, "SECRET", { expiresIn: '24h' });
      res.json({ message: 'Logged in successfully', token });

      

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// const createOp = async () => {
//         const username = 'operator'; // your admin username
//         const password = 'op123'; // your admin password
    
//         // Hash the password before saving it to the database
//         const hashedPassword = await bcrypt.hash(password, 10);
    
//         // Create and save the admin to the database
//         const operator = new Operator({
//             username,
//             password: hashedPassword,
//         });
    
//         try {
//             await operator.save();
//             console.log('Admin created successfully');
//         } catch (error) {
//             console.error('Error creating admin:', error);
//         }
//     }
    
//     // Call the createAdmin function to add the admin to the database
//     createOp();

module.exports = {OpLogin}