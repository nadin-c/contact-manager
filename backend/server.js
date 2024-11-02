const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const cors = require('cors');
const twilio = require('twilio');

require('dotenv').config();

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ MongoDB connected successfully'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactPageUrl: String
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Contact Schema
const contactSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    namePrefix: String,
    firstName: { type: String, required: true },
    middleName: String,
    lastName: { type: String, required: true },
    nameSuffix: String,
    company: String,
    phones: [{
        number: String,
        label: String,
        required: Boolean,
        verified: Boolean
    }],
    emails: [{
        address: String,
        label: String,
        required: Boolean
    }],
    significantDates: [{
        date: String,
        label: String
    }],
    socialMedia: {
        linkedin: String,
        twitter: String,
        facebook: String,
        instagram: String
    },
    customFields: [{
        label: { type: String },
        value: { type: String },
        type: { type: String }
    }]
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// Login Route
app.post('/api/users/login', async (req, res) => {
    console.log('🔑 Login attempt:', req.body.email);
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('❌ Login failed: Invalid credentials');
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const userContacts = await Contact.find({ userId: user._id });
        const lastContact = userContacts[userContacts.length - 1];

        console.log('✅ User logged in successfully:', email);
        res.status(200).json({ 
            message: 'Login successful', 
            userId: user._id,
            lastContact
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Register Route
app.post('/api/users/register', async (req, res) => {
    console.log('📝 New registration attempt:', req.body.email);
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log('❌ Registration failed: Missing credentials');
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log('❌ Registration failed: Email already exists');
            return res.status(409).json({ message: 'Email already registered' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        console.log('✅ User registered successfully:', email);
        res.status(201).json({ 
            message: 'User registered successfully', 
            userId: user._id 
        });
    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Contact Routes
app.post('/api/contacts/create', async (req, res) => {
    console.log('📇 Contact creation/update attempt');
    try {
        const existingContact = await Contact.findOne({ userId: req.body.userId });
        
        let contact;
        if (existingContact) {
            contact = await Contact.findByIdAndUpdate(
                existingContact._id,
                req.body,
                { new: true }
            );
            console.log('✅ Contact updated successfully:', {
                name: `${contact.firstName} ${contact.lastName}`,
                id: contact._id
            });
        } else {
            contact = new Contact(req.body);
            await contact.save();
            console.log('✅ Contact created successfully:', {
                name: `${contact.firstName} ${contact.lastName}`,
                id: contact._id
            });
        }

        res.status(201).json({ 
            message: existingContact ? 'Contact updated successfully' : 'Contact created successfully', 
            contactId: contact._id 
        });
    } catch (error) {
        console.error('❌ Contact operation error:', error);
        res.status(500).json({ 
            message: 'Error processing contact', 
            error: error.message 
        });
    }
});

// Get User Contact Route
app.get('/api/contacts/:userId', async (req, res) => {
    console.log('📋 Fetching contact for user:', req.params.userId);
    try {
        const contact = await Contact.findOne({ userId: req.params.userId }).sort({ createdAt: -1 });
        console.log('✅ Contact retrieved successfully');
        res.status(200).json({ contact });
    } catch (error) {
        console.error('❌ Error fetching contact:', error);
        res.status(500).json({ message: 'Error fetching contact', error });
    }
});

// Add these routes after your existing routes

// Send OTP Route
app.post('/api/verify/send-otp', async (req, res) => {
    console.log('📱 Sending OTP to:', req.body.phoneNumber);
    try {
        const { phoneNumber } = req.body;
        const verification = await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications.create({ to: phoneNumber, channel: 'sms' });
        
        console.log('✅ OTP sent successfully');
        res.json({ 
            success: true, 
            message: 'OTP sent successfully' 
        });
    } catch (error) {
        console.error('❌ Error sending OTP:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});

// Verify OTP Route
app.post('/api/verify/check-otp', async (req, res) => {
    console.log('🔍 Verifying OTP for:', req.body.phoneNumber);
    console.log('Service SID being used:', process.env.TWILIO_VERIFY_SERVICE_SID);
    console.log('Code received:', req.body.code);
    try {
        const { phoneNumber, code } = req.body;
        const verification_check = await twilioClient.verify.v2
            .services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks.create({ to: phoneNumber, code });

        const isVerified = verification_check.status === 'approved';
        console.log(isVerified ? '✅ Phone number verified successfully' : '❌ Invalid OTP');
        
        res.json({ 
            success: isVerified,
            message: isVerified ? 
                'Phone number verified successfully' : 
                'Invalid OTP'
        });
    } catch (error) {
        console.error('❌ Error verifying OTP:', error);
        res.status(400).json({ 
            success: false, 
            message: error.message 
        });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
