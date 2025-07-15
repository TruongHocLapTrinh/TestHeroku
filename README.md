# Event Management System

This is an Event Management System built with Node.js, Express.js, MongoDB, and EJS, following the MVC architectural pattern. It allows admins to manage event registrations and students to register for events.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <your_name>_event
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up MongoDB**:
   - Ensure MongoDB is installed and running on `mongodb://localhost/event_db`.
   - Import the provided `db.json` into your MongoDB database.

4. **Start the server**:
   ```bash
   npm start
   ```
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   - Open your browser and navigate to `http://localhost:3000`.

## Usage Instructions

- **Login**:
  - Use the `/auth/login` route to log in.
  - Admin users can view and search registrations.
  - Student users can register or cancel event registrations.

- **Admin Features**:
  - View all registrations at `/registrations/list`.
  - Search registrations by student username at `/registrations/search`.

- **Student Features**:
  - View and register for events at `/events/register`.
  - Cancel registrations from the same page.

- **Logout**:
  - Use the logout button to end the session.

## Dependencies

- express: Web framework
- mongoose: MongoDB ORM
- bcrypt: Password hashing
- express-session: Session management
- connect-mongo: MongoDB session store
- ejs: Templating engine

## Notes

- Ensure the `db.json` file is properly imported into MongoDB.
- The application uses a simple CSS stylesheet for responsive design.
- Role-based access control is enforced via middleware.
- Replace `<your_name>` in the project directory with your actual name.

```