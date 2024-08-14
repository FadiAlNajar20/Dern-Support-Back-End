-- Table: "User"
CREATE TABLE "User" (
    ID serial PRIMARY KEY,
    Name varchar(255) NOT NULL,
    Email varchar(255) UNIQUE NOT NULL,
    Password varchar(255) NOT NULL,
    PhoneNumber varchar(20),
    IsVerified boolean DEFAULT FALSE
);

-- Table: Admin
CREATE TABLE Admin (
    ID serial PRIMARY KEY,
    UserID int REFERENCES "User"(ID) ON DELETE CASCADE
);

-- Table: Technician
CREATE TABLE Technician (
    ID serial PRIMARY KEY,
    UserID int REFERENCES "User"(ID) ON DELETE CASCADE,
    Specialization varchar(255),
    Availability timestamp
);

-- Table: Customer
CREATE TABLE Customer (
    ID serial PRIMARY KEY,
    UserID int REFERENCES "User"(ID) ON DELETE CASCADE,
    AccountType varchar(50)
);

-- Table: Spares
CREATE TABLE Spares (
    ID serial PRIMARY KEY,
    Name varchar(255) NOT NULL,
    Quantity int NOT NULL,
    ReorderThreshold int NOT NULL
);

-- Table: Request
CREATE TABLE Request (
    ID serial PRIMARY KEY,
    CustomerID int REFERENCES Customer(ID) ON DELETE SET NULL,
    TechnicianID int REFERENCES Technician(ID) ON DELETE SET NULL,
    Status varchar(50) NOT NULL,
    DeviceDeliveryMethod varchar(255),
    CreatedDate timestamp DEFAULT CURRENT_TIMESTAMP,
    EstimatedTime int,
    ActualTime_deadline timestamp,
    RequestType varchar(255)
);

-- Table: NewRequest
CREATE TABLE NewRequest (
    ID serial PRIMARY KEY,
    IssueDescription varchar(255),
    Title varchar(255),
    Category varchar(255),
    EstimatedCost decimal(10, 2),
    ActualCost decimal(10, 2),
    MaintenanceTime int,
    Image varchar(255),
    RequestID int REFERENCES Request(ID) ON DELETE CASCADE
);

-- Table: Service
CREATE TABLE Service (
    ID serial PRIMARY KEY,
    CustomerID int REFERENCES Customer(ID) ON DELETE SET NULL,
    Title varchar(255),
    Category varchar(255),
    ActualCost decimal(10, 2),
    MaintenanceTime int,
    Image varchar(255),
    IsCommon boolean DEFAULT FALSE,
    IssueDescription varchar(255)
);

-- Table: ServiceRequest
CREATE TABLE ServiceRequest (
    ID serial PRIMARY KEY,
    ServiceID int REFERENCES Service(ID) ON DELETE CASCADE,
    RequestID int REFERENCES Request(ID) ON DELETE CASCADE
);

-- Table: Feedback
CREATE TABLE Feedback (
    ID serial PRIMARY KEY,
    CustomerID int REFERENCES Customer(ID) ON DELETE SET NULL,
    ServiceID int REFERENCES Service(ID) ON DELETE SET NULL,
    Rating int NOT NULL,
    Comment varchar(255)
);

-- Table: Article
CREATE TABLE Article (
    ID serial PRIMARY KEY,
    Title varchar(255) NOT NULL,
    Image varchar(255),
    Description varchar(255),
    CreatedDate timestamp DEFAULT CURRENT_TIMESTAMP
);
