# Door Inventory Management System

**Status: Under Development**

A web-based inventory management system being developed using Java and Spring Boot to manage door inventory across multiple grades and dimensions.

The project aims to digitize inventory tracking, organize stock information, and simplify inventory operations through a centralized application.

## Overview

The Door Inventory Management System is designed for managing door stock in an office environment. It focuses on organizing inventory by grade and dimension while maintaining structured records of stock and inventory transactions.

The application follows a layered backend architecture using Spring Boot and a relational database.

## Tech Stack

- **Language:** Java
- **Backend Framework:** Spring Boot
- **Web Layer:** Spring MVC, REST APIs
- **Security:** Spring Security
- **Database:** MySQL
- **Persistence:** JDBC / Spring Data JPA *(as implemented)*
- **Frontend:** HTML, CSS, JavaScript
- **Build Tool:** Maven
- **API Testing:** Postman
- **Version Control:** Git and GitHub

## Current Progress

- Developing the Spring Boot backend.
- Designing entities and database relationships for grades, dimensions, inventory, and transactions.
- Implementing REST endpoints for inventory operations.
- Integrating database persistence.
- Working on authentication and authorization using Spring Security.

## Planned Features

- Manage inventory across different door grades and dimensions.
- Track stock quantities and inventory changes.
- Maintain inventory transaction records.
- Validate inventory operations.
- Handle application errors consistently.
- Improve authentication and authorization.
- Integrate the frontend with backend APIs.
- Add automated tests and deployment support.

## Project Structure

The backend is organized into layers to separate API handling, business logic, and data access.

```text
door-inventory-management-system/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── ...
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

*The structure above is illustrative. Update it to match the actual repository.*

## Getting Started

### Prerequisites

- Java JDK compatible with the project configuration
- Apache Maven
- MySQL Server

### Setup

**1. Clone the repository**

```bash
git clone YOUR_REPOSITORY_URL
cd door-inventory-management-system
```

**2. Configure the database**

Create the database in MySQL if your application uses MySQL:

```sql
CREATE DATABASE door_inventory;
```

**3. Configure database credentials**

Update `application.properties` with your local database URL and credentials. Avoid committing passwords or other secrets to GitHub.

**4. Run the application**

If Maven is installed:

```bash
mvn spring-boot:run
```

The application will start on the port configured in your project.

*Setup instructions may change as development progresses.*

## API Documentation

API endpoints and request/response examples will be documented as the implementation develops.

## Future Improvements

- Role-based access control
- Inventory search and filtering
- Stock movement history and audit logs
- Input validation and centralized exception handling
- Unit and integration testing
- Docker-based deployment
- Inventory reports and low-stock alerts

## Learning Objectives

This project provides practical experience in:

- Java backend development with Spring Boot
- REST API design and implementation
- Relational database modeling
- Repository and service layer design
- Application security
- Building maintainable backend applications

## Author

**Simson Anto Rai**

- GitHub: YOUR_GITHUB_PROFILE_URL
- LinkedIn: YOUR_LINKEDIN_PROFILE_URL
