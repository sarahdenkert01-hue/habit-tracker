# Authentication Components

This directory contains comprehensive authentication UI components for the habit tracker app.

## Components

### 1. Login.jsx
A fully-featured login form with:
- Email and password input fields with icons
- "Login with Google" button with Google logo
- Links to signup and forgot password pages
- Error display using the Alert component
- Loading states with LoadingSpinner
- Proper form validation
- Responsive design with dark mode support

### 2. Signup.jsx
A comprehensive signup form featuring:
- Email, password, and confirm password fields
- Display name field for user profile
- "Sign Up with Google" button
- Link to login page
- Advanced form validation (password length, matching passwords)
- Detailed error handling with user-friendly messages
- Loading states throughout the process
- Password strength hint

### 3. ForgotPassword.jsx
A password reset interface with:
- Email input field
- Success and error message display
- Clear instructions for users
- Link back to login page
- Loading states during request
- Helpful tips for users who don't receive the email

### 4. Profile.jsx
A user profile management page with:
- Display of current user information (name, email, creation date)
- Editable display name with inline editing
- Logout button
- Authentication provider display (Google or Email/Password)
- Modern card layout with sections
- Success/error feedback for updates
- Profile picture support (if available from Google)

## Features

All components include:
- ✅ **Accessibility**: Proper labels, ARIA attributes, and semantic HTML
- ✅ **Responsive Design**: Mobile-first approach that works on all screen sizes
- ✅ **Dark Mode**: Full support using Tailwind dark mode classes
- ✅ **Loading States**: Visual feedback during async operations
- ✅ **Error Handling**: User-friendly error messages for all scenarios
- ✅ **Smooth Transitions**: CSS transitions for better UX
- ✅ **Icon Integration**: lucide-react icons throughout
- ✅ **Utility Classes**: Uses btn-primary, btn-secondary, input-field classes

## Usage

```jsx
import { Login, Signup, ForgotPassword, Profile } from './components/Auth';

// In your router configuration
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
<Route path="/forgot-password" element={<ForgotPassword />} />
<Route path="/profile" element={<Profile />} />
```

## Dependencies

These components rely on:
- `contexts/AuthContext` - useAuth hook for authentication
- `components/common/Alert` - Error and success messages
- `components/common/LoadingSpinner` - Loading indicators
- `lucide-react` - Icons
- `react-router-dom` - Navigation and links

## Design Patterns

- **Consistent Layout**: All auth forms use centered card layout
- **Icon Usage**: Form fields have left-aligned icons for visual clarity
- **Color Scheme**: Primary blue theme with proper dark mode variants
- **Spacing**: Consistent padding and margins throughout
- **Typography**: Clear hierarchy with proper font sizes and weights
