# System Health Monitoring Platform

A cross-platform system health monitoring solution consisting of three main components:

1. **System Utility (Client)**
   - Cross-platform system health monitoring daemon
   - Collects system metrics and security status
   - Reports to central server

2. **Backend Server**
   - RESTful API for data collection
   - Secure data storage
   - Machine management endpoints

3. **Admin Dashboard**
   - Web-based monitoring interface
   - Real-time system status visualization
   - Advanced filtering and reporting

## Project Structure

```
systemHealthMonitoring/
├── client/           # System utility
├── server/           # Backend API 
├── dashboard/        # Admin dashboard
```

## Setup Instructions

Follow these steps to set up and run the System Health Monitoring Platform:

1. **Clone the Repository**
```
git clone https://github.com/Ashmit-EE-3/systemHealthMointoring.git
cd systemHealthMonitoring
```

2. **Configure Environment Variables**
Create a .env file in the root directory of the project and add your MongoDB connection string:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority
```

3. **Install Dependencies and Start the System Utility**
Navigate to the client directory and install the required dependencies:
```
cd client
npm install
```

For Window Users:
   - Open Command Prompt as Administratoy.
   - Navigate to the client directory.
   - Run the server:

For macOS and Linux Users:
   - Open Terminal.
   - Navigate to the client directory.
   - Run the server:
```
npm run dev
```
This will start the system utility, which collects and reports system health metrics.

Note: If you encounter permission issues, you may need to run the command with elevated privileges:
```
sudo npm run dev
```
You will be prompted to enter your administrator password.

4. **Set up and Start the Backend Server**
Navigate to the server directory: 
```
cd ../server
npm install
npm run dev
```
This will start the backend server, which provides the RESTful API and handles data storage.

5. **Set Up and Start the admin dashboard** 
Navigate to the dashboard directory:
```
cd ../dashboard
npm install
npm start
```
This will start the admin dashboard, providing a web-based interface for monitoring system health data.