# LexCare - Hospital Management System

A comprehensive Hospital Management System built with Next.js, Supabase, and modern web technologies.

## Features

- **User Authentication & Role-Based Access Control**
  - Doctors, Administrators, and Staff roles
  - Secure authentication with Supabase
  - Role-based page access and permissions

- **Profile Management**
  - User profile with contact information
  - Recent consultations overview
  - Pending chats with unread indicators

- **Schedule Management**
  - View and manage appointments
  - Calendar integration
  - Appointment status tracking

- **Patient Management**
  - Comprehensive patient records
  - Search and filter functionality
  - Medical history tracking

- **Consultation System**
  - Record consultation notes
  - Patient history access
  - Treatment and prescription management

- **Real-time Chat System**
  - Secure messaging between staff
  - Unread message notifications
  - Conversation management

- **Bed Management (Inpatients)**
  - Hospital bed tracking and assignment
  - Ward-based organization
  - Patient admission and discharge management
  - Bed status monitoring (available, occupied, reserved, maintenance)

- **Enhanced Admin Dashboard**
  - Hospital metrics overview with charts
  - Real-time bed occupancy data
  - Inventory status visualization
  - Monthly consultation trends
  - Quick action shortcuts

- **Advanced Inventory Management**
  - Medical supplies tracking with detailed analytics
  - Low stock and reorder alerts
  - Expiry date monitoring
  - Supplier management
  - Cost tracking and total value calculations
  - Transaction history

- **Comprehensive Staff Management**
  - Staff profile management with role assignment
  - Shift scheduling and management
  - Contact information and location tracking
  - Role-based filtering and search

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Styling**: Tailwind CSS, shadcn/ui components
- **Charts**: Recharts for data visualization
- **Font**: Montserrat
- **Theme**: Light/Dark mode support

## Color Scheme

- **Dark Blue**: #021488 (Primary)
- **Medium Blue**: #0546B6 (Secondary)
- **Light Blue**: #0A91F9 (Accent)
- **Light Cyan**: #C5ECF4 (Background/Accent)

## User Roles and Permissions

### Administrator Access
- **Full Access**: Profile, Schedule, Consultation, Chats, Patients, Bed Management, Admin Dashboard, Inventory Management, Staff Management
- **Special Permissions**: Add/edit staff, manage inventory, assign beds, view all analytics

### Doctor Access  
- **Core Features**: Profile, Schedule, Consultation, Chats, Patients, Bed Management
- **Dashboard Access**: Read-only access to Admin Dashboard for metrics
- **Bed Management**: Can assign and discharge patients

### Staff Access
- **Limited Access**: Profile, Schedule, Chats, Patients (limited view)
- **Restrictions**: No access to admin features, inventory, or staff management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd lexcare-hms
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Use the demo accounts provided in the login page

7. **Enable Email Sending Service**
   - Search for app passwords on google account settings
   - Create an app called nodemailer
   - copy the password and add the following in your env file:
    SMTP_USER = "your-email@gmail.com"
    SMTP_PASS = "The password just gotten from google"
    SMTP_PORT = 465
    SMTP_SERVICE = gmail
    SMTP_HOST = smtp.gmail.com 

## Demo Accounts

- **Doctor**: dr.benson@lexcare.com / admin123
- **Admin**: admin@lexcare.com / admin123  
- **Staff**: nurse.mary@lexcare.com / admin123

## Database Schema

### Core Tables

- **users** - Staff authentication and profiles
- **patients** - Patient records and information
- **appointments** - Scheduled appointments
- **consultations** - Medical consultation records
- **chats** - Internal messaging system
- **beds** - Hospital bed management
- **bed_assignments** - Bed assignment history
- **inventory** - Medical supplies and equipment
- **inventory_transactions** - Inventory transaction history
- **staff_shifts** - Staff scheduling

## Features

### Bed Management
- **Ward Organization**: Beds organized by wards (General, ICU, Private, Semi-Private)
- **Status Tracking**: Available, Occupied, Reserved, Maintenance, Cleaning
- **Patient Assignment**: Link patients to beds with admission dates
- **Filtering**: Search and filter by ward, status, or patient
- **Role-Based Access**: Doctors can assign/discharge, Admins have full control

### Enhanced Admin Dashboard
- **Visual Analytics**: Charts showing consultation trends, bed occupancy, inventory status
- **Real-Time Metrics**: Live data from Supabase with automatic updates
- **Quick Actions**: Direct links to common administrative tasks
- **Comprehensive Stats**: Patient counts, staff metrics, bed utilization

### Advanced Inventory Management
- **Stock Levels**: Current stock, minimum stock, and reorder levels
- **Financial Tracking**: Unit prices, cost tracking, total inventory value
- **Supplier Management**: Track suppliers and last restock dates
- **Alert System**: Low stock, out of stock, and reorder notifications
- **Expiry Monitoring**: Track expiration dates with alerts

### Comprehensive Staff Management
- **Role Assignment**: Manage doctor, admin, and staff roles
- **Shift Management**: Schedule and track staff shifts
- **Contact Management**: Phone, email, and location tracking
- **Performance Metrics**: Join dates and activity tracking

## Features in Detail

### Real-time Features
- Live chat messaging
- Real-time bed status updates
- Instant inventory notifications
- Live dashboard metrics

### Security
- Row Level Security (RLS) policies in Supabase
- Role-based access control
- Secure authentication flow
- Data encryption and protection


### Supabase Configuration
- Enable Row Level Security on all tables
- Set up authentication policies
- Configure real-time subscriptions

## Future Enhancements

- **Laboratory Management** - Test results and lab orders
- **Billing System** - Patient billing and insurance
- **Advanced Reporting** - Custom reports and analytics
- **Mobile App** - React Native companion app
- **AI Integration** - Symptom analysis and diagnosis support
- **Telemedicine** - Video consultation capabilities
- **Pharmacy Management** - Prescription and drug dispensing
- **Emergency Management** - Emergency response and triage

## Contributing

1. create a branch with your name (firstname-lastname)
2. 
3. Make your changes/contribution
4. Tests and ensure it builds correctly 
5. Submit a pull request



## Support

For support and questions:
- Email: support@lexcare.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**LexCare a product of Lexrunit** ©©️Lexrunit, all rights reserved. 
