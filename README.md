# Habit Tracker

A modern, feature-rich habit tracking application built with React, Firebase, and Tailwind CSS. Track your daily habits, visualize your progress, and build better routines.

![Habit Tracker](https://img.shields.io/badge/React-19.2.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.1.18-teal)

## ✨ Features

- 🔐 **User Authentication** - Email/password and Google OAuth sign-in
- 📝 **Habit Management** - Create, edit, delete, and archive habits
- ✅ **Daily Tracking** - Check off habits daily with streak tracking
- 📅 **Calendar View** - Monthly calendar visualization of habit completions
- 📊 **Analytics Dashboard** - Charts and statistics to track your progress
- 🌓 **Dark Mode** - Full dark mode support with smooth transitions
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop
- 🔄 **Real-time Sync** - Data syncs across devices in real-time via Firebase
- 🎨 **Customization** - Color-coded habits with categories

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/sarahdenkert01-hue/habit-tracker.git
cd habit-tracker
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up Firebase**

   a. Go to the [Firebase Console](https://console.firebase.google.com/)
   
   b. Create a new project (or use an existing one)
   
   c. Enable Authentication:
      - In the Firebase Console, go to **Authentication** → **Sign-in method**
      - Enable **Email/Password** authentication
      - Enable **Google** authentication
   
   d. Create a Firestore Database:
      - In the Firebase Console, go to **Firestore Database**
      - Click **Create Database**
      - Choose **Start in production mode** (we'll use our own security rules)
      - Select your preferred region
   
   e. Get your Firebase configuration:
      - Go to **Project Settings** (gear icon) → **General**
      - Scroll down to **Your apps** and click the web icon (`</>`)
      - Register your app with a nickname (e.g., "Habit Tracker")
      - Copy the Firebase configuration object

4. **Configure environment variables**

   Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

   Edit `.env` and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

5. **Deploy Firestore Security Rules**

   Install Firebase CLI if you haven't already:

```bash
npm install -g firebase-tools
```

   Login to Firebase:

```bash
firebase login
```

   Initialize Firebase in your project:

```bash
firebase init firestore
```

   - Select your Firebase project
   - Use the default `firestore.rules` file (already included in this repo)
   - Use the default `firestore.indexes.json` file

   Deploy the security rules:

```bash
firebase deploy --only firestore:rules
```

6. **Start the development server**

```bash
npm run dev
```

   Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎯 Usage

### Creating Your First Habit

1. Sign up or log in to your account
2. Click the **"Add Habit"** button on the dashboard
3. Fill in the habit details:
   - Name (e.g., "Morning Meditation")
   - Category (e.g., "Health")
   - Color (choose a color for easy identification)
   - Frequency (daily, weekly, etc.)
4. Click **"Save"** to create your habit

### Tracking Habits

- **Dashboard**: View all your habits and check them off for today
- **Calendar View**: See your completion history in a monthly calendar format
- **Analytics**: View charts and statistics about your progress

### Managing Habits

- **Edit**: Click the edit icon on any habit card to modify it
- **Delete**: Click the delete icon to permanently remove a habit
- **Archive**: Archive habits you want to keep but not track actively

## 📦 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

## 🚢 Deployment

### Deploy to Vercel

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all Firebase environment variables from your `.env` file

### Deploy to Netlify

1. Install Netlify CLI:

```bash
npm install -g netlify-cli
```

2. Build and deploy:

```bash
npm run build
netlify deploy --prod
```

3. Set environment variables in Netlify dashboard:
   - Go to **Site settings** → **Build & deploy** → **Environment**
   - Add all Firebase environment variables

### Deploy to Firebase Hosting

1. Initialize Firebase Hosting:

```bash
firebase init hosting
```

   - Choose `dist` as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: Optional

2. Build and deploy:

```bash
npm run build
firebase deploy --only hosting
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.12.0
- **Backend**: Firebase (Authentication, Firestore)
- **Charts**: Recharts 3.6.0
- **Icons**: Lucide React
- **Date Utilities**: date-fns 4.1.0

## 📁 Project Structure

```
habit-tracker/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Auth/       # Authentication components
│   │   ├── HabitForm/  # Habit creation/editing
│   │   ├── HabitList/  # Habit display components
│   │   ├── common/     # Reusable UI components
│   │   ├── Dashboard.jsx
│   │   ├── CalendarView.jsx
│   │   ├── AnalyticsView.jsx
│   │   ├── Layout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── contexts/       # React contexts
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── hooks/          # Custom React hooks
│   │   └── useFirebase.js
│   ├── services/       # External services
│   │   └── firebase.js
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # App entry point
│   └── index.css       # Global styles
├── firestore.rules     # Firestore security rules
├── .env.example        # Environment variables template
├── package.json        # Dependencies
└── README.md          # This file
```

## 🔒 Security

- All data is secured with Firestore security rules
- Users can only access their own data
- Authentication is required for all protected routes
- Environment variables are used for sensitive configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the MIT License.

## 🐛 Troubleshooting

### Firebase Connection Issues

- Verify your `.env` file has the correct Firebase credentials
- Check that Firebase Authentication and Firestore are enabled in your Firebase project
- Make sure you've deployed the Firestore security rules

### Build Errors

- Clear the node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Clear the build cache: `rm -rf dist && npm run build`

### Dark Mode Not Working

- Dark mode preference is stored in localStorage
- Try clearing your browser's localStorage for the app

## 📧 Support

For issues and questions, please create an issue on the [GitHub repository](https://github.com/sarahdenkert01-hue/habit-tracker/issues).

---

Built with ❤️ using React and Firebase
