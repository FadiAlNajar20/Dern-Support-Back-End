-- User Table
CREATE TABLE User (
    ID serial PRIMARY KEY,
    Name varchar NOT NULL,
    Email varchar UNIQUE NOT NULL,
    Password varchar NOT NULL,
    PhoneNumber varchar NOT NULL
);

-- Admin Table
CREATE TABLE Admin (
    ID serial PRIMARY KEY,
    UserID int REFERENCES User(ID)
);

-- Technician Table
CREATE TABLE Technician (
    ID serial PRIMARY KEY,
    UserID int REFERENCES User(ID),
    Specialization varchar NOT NULL,
    Availability timestamp NOT NULL
);

-- Customer Table
CREATE TABLE Customer (
    ID serial PRIMARY KEY,
    UserID int REFERENCES User(ID),
    AccountType varchar NOT NULL
);

-- Service Table
CREATE TABLE Service (
    ID serial PRIMARY KEY,
    Description varchar NOT NULL,
    Cost decimal(10,2) NOT NULL,
    MaintenanceTime int NOT NULL,
    IsCommon boolean NOT NULL
);

-- Request Table
CREATE TABLE Request (
    ID serial PRIMARY KEY,
    CustomerID int REFERENCES Customer(ID),
    Image varchar,
    Status varchar NOT NULL,
    DeviceDeliveryMethod varchar NOT NULL,
    CreatedDate timestamp NOT NULL,
    EstimatedTime int ,
    RequestType varchar NOT NULL
);

-- NewRequest Table
CREATE TABLE NewRequest (
    ID serial PRIMARY KEY,
    IssueDescription varchar NOT NULL,
    EstimatedCost decimal(10,2) ,
    MaintenanceTime int ,
    RequestID int REFERENCES Request(ID)
);

-- ServiceRequest Table
CREATE TABLE ServiceRequest (
    ID serial PRIMARY KEY,
    ServiceID int REFERENCES Service(ID),
    RequestID int REFERENCES Request(ID)
);

-- Feedback Table
CREATE TABLE Feedback (
    ID serial PRIMARY KEY,
    CustomerID int REFERENCES Customer(ID),
    ServiceID int REFERENCES Service(ID),
    Rating int NOT NULL,
    Comment varchar
);

-- JobSchedule Table
CREATE TABLE JobSchedule (
    ID serial PRIMARY KEY,
    RequestID int REFERENCES Request(ID),
    TechnicianID int REFERENCES Technician(ID),
    ActualTime timestamp NOT NULL,
    ActualCost decimal(10,2) ,
    Status varchar NOT NULL
);

-- Spares Table
CREATE TABLE Spares (
    ID serial PRIMARY KEY,
    Name varchar NOT NULL,
    Quantity int NOT NULL,
    ReorderThreshold int NOT NULL
);

-- Article Table
CREATE TABLE Article (
    ID serial PRIMARY KEY,
    Title varchar NOT NULL,
    Content text NOT NULL,
    PublishedDate timestamp NOT NULL,
    AdminID int REFERENCES Admin(ID)
);


