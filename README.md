# Messenger

Clone the Repository with the frontend submodule.

Run the frontend and Backend Separately with <code>npm start</code>

<h2>Backend Settings</h2>
<ul>
<li>Update Email Id and Password for OTP verification process.</li>
<li>Update your mongoDB credentials</li>
<li>For using same credentials path create <code>setup/dburl.js</code> file in format :<br>
<code>
module.exports = {
    mongoURL: "YOUR_MONGO_URL"
    secret: "YOUR_MONGO_SECRET"
    email: "EMAIL"
    emailPass: 'PASSWORD"
};
</code>
</li>
</ul>
