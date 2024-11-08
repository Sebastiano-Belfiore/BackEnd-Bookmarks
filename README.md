# Bookmarks Project - Backend

## Introduction
This is the **backend** for the **Bookmarks** project, an application to manage **bookmarks** (favorites) and **tags** associated with them. The backend provides RESTful APIs to handle **bookmarks** and **tags** operations, allowing users to **create**, **read**, **update**, and **delete** bookmarks and tags.


## Features
- **Manage bookmarks and tags**: Create, read, update, and delete bookmarks and tags.
- **Tag-based organization**: Associate tags with bookmarks for easier categorization.

## Technologies Used
- **Node.js**
- **Express**
- **TypeScript**
- **MySQL**
- **mysql2**


## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Sebastiano-Belfiore/BackEnd-Bookmarks.git

```
Then navigate into the project folder:
```bash
cd BackEnd-Bookmarks
```
### 2. Install dependencies
```bash
npm install
```
### 3. Set up environment variables
Create a *.env* file in the root directory of the project. You can use the *.env.example* file as a template. Add the required environment variables.
Example:
```bash
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
DB_PORT=your-database-port (usually 3306 for MySQL)
```
### 4. Set up the database
To run the project locally, you need a MySQL database. Ensure that your MySQL server is running.

You can set up and manage the database using the following npm scripts:

#### Setup the database
This will create the database and tables based on your .env configuration:
```bash
npm run setup-db
```
#### Seed the database
If you want to seed the database with sample data:
```bash
npm run seed-db
```
#### Delete the database
If you need to delete the database:

```bash
npm run delete-db
```

Running the project
To start the server in development mode, run:

```bash
npm run dev
```

# Note
In Development: This project is currently in development and should be considered a prototype.
