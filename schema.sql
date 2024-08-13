-- Create tables in the necessary order to satisfy foreign key constraints

-- User table
CREATE TABLE "User" (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(50),
    IsVerified BOOLEAN DEFAULT FALSE
);

-- Admin table
CREATE TABLE Admin (
    ID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    FOREIGN KEY (UserID) REFERENCES "User" (ID) ON DELETE CASCADE
);

-- Technician table
CREATE TABLE Technician (
    ID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    Specialization VARCHAR(255),
    Availability TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES "User" (ID) ON DELETE CASCADE
);

-- Customer table
CREATE TABLE Customer (
    ID SERIAL PRIMARY KEY,
    UserID INT NOT NULL,
    AccountType VARCHAR(255),
    FOREIGN KEY (UserID) REFERENCES "User" (ID) ON DELETE CASCADE
);

-- Service table
CREATE TABLE Service (
    ID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    Title VARCHAR(255),
    Category VARCHAR(255),
    EstimatedCost DECIMAL(10, 2),
    MaintenanceTime INT,
    Image VARCHAR(255),
    IsCommon BOOLEAN DEFAULT FALSE,
    IssueDescription VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer (ID) 
);

-- Request table
CREATE TABLE Request (
    ID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    TechnicianID INT NOT NULL,
    Status VARCHAR(50),
    DeviceDeliveryMethod VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    EstimatedTime INT,
    ActualTime INT,
    ActualCost DECIMAL(10, 2),
    RequestType VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer (ID) ON DELETE CASCADE,
    FOREIGN KEY (TechnicianID) REFERENCES Technician (ID) ON DELETE CASCADE
);

-- NewRequest table
CREATE TABLE NewRequest (
    ID SERIAL PRIMARY KEY,
    IssueDescription VARCHAR(255),
    Title VARCHAR(255),
    Category VARCHAR(255),
    EstimatedCost DECIMAL(10, 2),
    MaintenanceTime INT,
    Image VARCHAR(255),
    RequestID INT NOT NULL,
    FOREIGN KEY (RequestID) REFERENCES Request (ID) ON DELETE CASCADE
);

-- ServiceRequest table
CREATE TABLE ServiceRequest (
    ID SERIAL PRIMARY KEY,
    ServiceID INT NOT NULL,
    RequestID INT NOT NULL,
    FOREIGN KEY (ServiceID) REFERENCES Service (ID) ON DELETE CASCADE,
    FOREIGN KEY (RequestID) REFERENCES Request (ID) ON DELETE CASCADE
);

-- Feedback table
CREATE TABLE Feedback (
    ID SERIAL PRIMARY KEY,
    CustomerID INT NOT NULL,
    ServiceID INT NOT NULL,
    Rating INT,
    Comment VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer (ID) ON DELETE CASCADE,
    FOREIGN KEY (ServiceID) REFERENCES Service (ID) ON DELETE CASCADE
);

-- Spares table
CREATE TABLE Spares (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Quantity INT NOT NULL,
    ReorderThreshold INT NOT NULL
);

-- Article table
CREATE TABLE Article (
    ID SERIAL PRIMARY KEY,
    Title VARCHAR(255),
    Image VARCHAR(255),
    Description VARCHAR(255),
    CreatedDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
