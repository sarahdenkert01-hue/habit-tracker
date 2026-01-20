# Habit Management Components

## Overview
Comprehensive habit management components for the habit tracker app with full CRUD operations, filtering, sorting, and dark mode support.

## Components Created

### 1. HabitForm (src/components/HabitForm/HabitForm.jsx)
**Purpose**: Create and edit habits with full validation

**Features**:
- ✅ Name field (required, min 2 characters)
- ✅ Description textarea (optional)
- ✅ Category dropdown with ability to create new categories
- ✅ Color picker with 8 predefined colors from habitUtils
- ✅ Frequency select (daily, weekly, custom)
- ✅ Target days per week for custom frequency
- ✅ Archive/unarchive toggle (edit mode only)
- ✅ Form validation with error messages
- ✅ Save/Cancel buttons with loading states
- ✅ Uses Modal component for display
- ✅ Full dark mode support

**Usage**:
\`\`\`jsx
import HabitForm from '../components/HabitForm';

<HabitForm
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
  habit={editingHabit} // null for create mode
  existingCategories={categories}
/>
\`\`\`

### 2. HabitList (src/components/HabitList/HabitList.jsx)
**Purpose**: Main component for displaying and managing habits

**Features**:
- ✅ Responsive grid layout (1/2/3 columns)
- ✅ Filter by category
- ✅ Search by name
- ✅ Sort options (name, streak, category, date)
- ✅ Archive filter toggle
- ✅ Empty state messages
- ✅ Create new habit button
- ✅ Alert notifications for actions
- ✅ Loading states with spinner
- ✅ Uses HabitCard, HabitFilters, HabitForm components
- ✅ Full dark mode support

**Usage**:
\`\`\`jsx
import { HabitList } from '../components/HabitList';

<HabitList />
\`\`\`

### 3. HabitCard (src/components/HabitList/HabitCard.jsx)
**Purpose**: Display individual habit with actions

**Features**:
- ✅ Habit name with color indicator (left border)
- ✅ Category badge
- ✅ Current streak with flame icon
- ✅ Longest streak with flame icon
- ✅ Quick complete checkbox for today
- ✅ Edit/delete buttons
- ✅ Click to expand for description
- ✅ Archived badge when applicable
- ✅ Smooth animations and transitions
- ✅ Confirmation dialog for delete
- ✅ Full dark mode support

**Usage**:
\`\`\`jsx
import HabitCard from './HabitCard';

<HabitCard
  habit={habit}
  completions={completions}
  onToggleComplete={handleToggle}
  onEdit={handleEdit}
  onDelete={handleDelete}
  isCompletedToday={isCompletedToday}
/>
\`\`\`

### 4. HabitFilters (src/components/HabitList/HabitFilters.jsx)
**Purpose**: Filter and sort controls for habit list

**Features**:
- ✅ Search input with icon
- ✅ Category filter dropdown
- ✅ Sort dropdown (name, streak, category, date)
- ✅ Show archived toggle checkbox
- ✅ Clear filters button
- ✅ Responsive grid layout
- ✅ Accessible labels
- ✅ Full dark mode support

**Usage**:
\`\`\`jsx
import HabitFilters from './HabitFilters';

<HabitFilters
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
  sortBy={sortBy}
  setSortBy={setSortBy}
  showArchived={showArchived}
  setShowArchived={setShowArchived}
  categories={categories}
  onClearFilters={handleClearFilters}
/>
\`\`\`

## Hooks Used
- \`useHabits\` - CRUD operations for habits
- \`useCompletions\` - Track habit completions

## Utilities Used
- \`calculateStreak\` - Calculate current and longest streaks
- \`isHabitCompletedToday\` - Check if habit is completed today
- \`getHabitColors\` - Get predefined color palette

## Common Components Used
- \`Modal\` - Modal wrapper
- \`LoadingSpinner\` - Loading indicator
- \`Alert\` - Alert notifications

## Icons Used (lucide-react)
- \`PlusCircle\` - Add new habit
- \`Edit\` - Edit habit
- \`Trash\` - Delete habit
- \`Check\` - Complete checkbox
- \`Flame\` - Streak indicators
- \`Search\` - Search input
- \`Filter\` - Category filter
- \`SortAsc\` - Sort dropdown
- \`X\` - Close/clear actions
- \`Archive\` - Archive habit
- \`ArchiveRestore\` - Unarchive habit
- \`Save\` - Save button

## State Management
All components use React hooks for local state and Firebase hooks for data persistence:
- Form state in HabitForm
- Filter/sort state in HabitList
- Expansion state in HabitCard

## Styling
- Tailwind CSS v4 with custom theme
- Dark mode support via \`dark:\` classes
- Responsive breakpoints (md, lg)
- Smooth transitions and animations
- Accessible colors and contrast

## Validation
- Name field: Required, minimum 2 characters
- Target days: 1-7 range for custom frequency
- All fields trimmed before submission

## Error Handling
- Try/catch blocks for all async operations
- User-friendly error messages via Alert component
- Console logging for debugging
- Confirmation dialogs for destructive actions
