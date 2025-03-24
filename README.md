```markdown
# Auction Platform

This project is an auction management platform built with **React** (frontend) and **Node.js/Express** (backend). The backend runs on **port 3001**.

## Features

### Roles & Dashboards
- **Admin Dashboard**:
  - Manage teams, player queue, and bidding history
  - Import/export data
- **Team Dashboard**:
  - View team players and current bid status
  - Track remaining purse and connection status
- **Viewer Dashboard**:
  - Display live auction details
  - Show team information and sold players

## Installation & Setup

### Backend Setup
1. Navigate to the main folder:
   ```
   cd auction
   ```
2. Start the backend server:
   ```
   node server.js
   ```
   - Runs on **port 3001**

### Frontend Setup
1. Navigate to the main folder:
   ```
   cd auction
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the frontend:
   ```
   npm start
   ```
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Routes
| Path                | Description                  |
|---------------------|------------------------------|
| `/`                | Team Login (default route)   |
| `/admin-login`     | Admin Login                  |
| `/admin-dashboard` | Admin Dashboard              |
| `/team-login`      | Team Login                   |
| `/team-dashboard`  | Team Dashboard               |
| `/viewer`          | Viewer Dashboard             |
| `*`               | 404 - Page Not Found         |

## License
This project is open-source and freely modifiable. Feel free to adapt it to your needs.
```
