const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.USER_EMAIL, 
        pass:process.env.USER_PASS 
       
    },
    tls: {
        rejectUnauthorized: false
    }
});


app.get('/', (req, res) => {
    res.send('Server is running and listening for requests.');
});


app.post('/send_email', (req, res) => {
    const { name, email, subject, message } = req.body;

    
    const mailOptions = {
        from: email,
        to: process.env.TO_EMAIL_USER, 
        subject: 'Inquiry from portfolio',
        html: `
            <p><b>Hi, I am ${name}</b></p>
            <p><b>Contact Details</b></p>
            <p><b>email : ${email}</b></p>
            <p><b>Phone: ${subject}</b></p>
            <p><b>I had viewed your portfolio .I am exicted to work with you  ${message}</b></p>
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error); // Use console.error for errors
            res.status(500).json({ message: "Error sending mail: Bad response or authentication issue. Please check server logs." });
        } else {
            console.log('Email sent:', info.response);
            res.status(200).json({ message: "Email sent successfully!" });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


