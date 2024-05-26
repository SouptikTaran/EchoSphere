# EchoSphere

Echosphere is a dynamic social media platform built on Node.js, offering essential features for modern social networking. With user authentication, customizable profiles, news feeds, posting capabilities, interactive engagements, messaging, notifications, and search functionalities, Echosphere aims to provide users with a seamless and engaging online experience. Powered by Express.js, MongoDB, and other top-tier technologies, Echosphere is poised to connect people and foster meaningful interactions in the digital realm.

## Features

- **User Authentication** : Secure user registration and login system to protect user data and ensure privacy.

- **Google Authentication** : Integrate Google authentication functionality, enabling users to log in using their Google accounts for added convenience and security.

## Todo Features
- [ ]  **Profiles** : Customizable user profiles where users can showcase information about themselves.  

- [ ] **Posting** : Ability to create and share various types of content including text posts, images, and links.

- [ ] **Messaging** : Private messaging functionality for direct communication between users.

more features will be added soon

## Getting Started


To get started with EchoSphere, clone the repository and install the necessary dependencies:

```bash
git clone https://github.com/SouptikTaran/EchoSphere.git.
cd EchoSphere
npm install
```


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

- `MONGO_URL` : Add the MongoDB url 
- `JWT_SECRET` : Add a Secret key
- `CLIENT_ID` : Add a google client id for NodeMailer
- `CLIENT_SECRET` : Add a google client Secret for NodeMailer



## Usage 
To Start the server :
```bash
npm start 
```
To Start The Developmental Server
```bash
npm run dev
```
The server will be running on http://localhost:8000. You can now begin developing your application using the extensive features provided by Code Fusion.
## Contributing
We welcome contributions from the community! Feel free to submit issues, feature requests, and pull requests to help improve EchoSphere.




