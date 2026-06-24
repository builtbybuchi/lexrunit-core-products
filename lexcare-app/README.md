# LexCare - Healthcare Application

LexCare is a comprehensive web-based healthcare application built with Next.js, React, and Supabase. It provides patients with AI-powered consultations, health tracking, appointment management, and more.

## Features

### Core Features
- **AI Consultation**: Interactive AI-powered health consultations with doctor validation
- **AI Chat**: Casual health conversations with AI assistant
- **Emergency Call**: Quick access to emergency services with confirmation dialog
- **Authentication**: Secure login/signup with Supabase Auth
- **Notifications**: Push notifications for appointments and health updates

### Health Management
- **Health Tracker**: Log and visualize vital signs (temperature, blood pressure, heart rate, weight)
- **Appointments**: Schedule, view, and manage medical appointments
- **Health Records**: Access medical history with export functionality
- **Payment**: Secure payment processing for consultations and services

### User Experience
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **PWA Support**: Install as a Progressive Web App
- **Offline Support**: Basic offline functionality with service workers

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **UI Components**: ShadCN/UI, Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd lexcare-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Setup Capacitor:
\`\`\`bash
npm i -D @capacitor/cli
npx cap init
npm install @capacitor/android
npm install @capacitor/ios
npx cap add android
npx cap add ios


In capacitor.config.ts, edit webDir to "webDir: 'out'"
In next.config.mjs, add "output: 'export'",

npm run android (To open and build the project in Android Studio)
\`\`\`

4. Set up environment variables:
Create a `.env.local` file in the root directory:
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_AI_API_URL=your_ai_api_url
AI_API_KEY=your_ai_api_key
\`\`\`

5. Set up the database:
- Run the SQL scripts in the `scripts/` folder in your Supabase SQL editor
- First run `setup-database.sql` to create tables and policies
- Then run `seed-sample-data.sql` to add sample data (optional)

6. Configure Supabase Storage:
- Create buckets: `profile_images` and `chat_media`
- Set appropriate policies for file access

7. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

8. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
lexcare-app/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── appointments/      # Appointments management
│   ├── chat/             # AI chat interface
│   ├── consultation/     # AI consultation
│   ├── emergency/        # Emergency contact
│   ├── feedback/         # User feedback
│   ├── health-records/   # Medical records
│   ├── health-tracker/   # Vital signs tracking
│   ├── notifications/    # Notifications center
│   ├── payment/          # Payment processing
│   ├── profile/          # User profile
│   ├── settings/         # App settings
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   └── ui/               # ShadCN UI components
├── contexts/             # React contexts
├── lib/                  # Utility libraries
├── public/               # Static assets
└── scripts/              # Database scripts
\`\`\`

## Key Components

### Authentication Context
Manages user authentication state and provides login/logout functionality.

### Theme Context
Handles dark/light theme switching with localStorage persistence.

### Supabase Integration
- Real-time subscriptions for notifications
- Row Level Security (RLS) for data protection
- File storage for profile images and chat media

### AI Service
Integrates with external AI API for:
- Health consultations with symptom analysis
- General health chat conversations
- Voice-to-text processing (simulated)

## PWA Features

The app includes Progressive Web App capabilities:
- Installable on mobile devices
- Offline functionality
- Push notifications (when configured)
- App-like experience

## Security Features

- Row Level Security (RLS) on all database tables
- Secure file upload with user-specific folders
- Input validation and sanitization
- HTTPS enforcement in production

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `NEXT_PUBLIC_AI_API_URL` | AI service API URL | Yes |
| `AI_API_KEY` | AI service API key | Yes |

## API Integration

### AI Service
The app integrates with an external AI service for:
- Symptom analysis and health recommendations
- General health conversations
- Medical advice (with doctor validation)

Expected API endpoints:
- `POST /consultation` - Submit symptoms for analysis
- `POST /chat` - Send chat messages to AI

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@lexcare.com or create an issue in the repository.
