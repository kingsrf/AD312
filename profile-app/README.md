# User Profile Updater (React)

    A simple React app demonstrating how to immutably update nested objects in state using the spread syntax and functional updates.
    The app allows a user to update their profile's nested address fields while preserving other profile details.

## Features
    Manage nested object state with useState.

    Update state immutably with spread syntax.

    Real-time profile updates displayed on the UI.

    Includes test cases for normal and edge cases using React Testing Library + Jest.

### Clone the Repository
```bash
git clone < url-repo >
cd profile-app

2. Install Dependencies
    npm install

3. Start the Development Server
    npm start

Running Tests
    npm test
```

### Example Usage

Enter a street, city, and country in the input fields.

Click Update Address. 

Watch the profile update without losing other fields like name or email.