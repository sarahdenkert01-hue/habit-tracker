import { useState, useMemo } from 'react';
import { PlusCircle } from 'lucide-react';
import { useHabits } from '../../hooks/useFirebase';
import { useCompletions } from '../../hooks/useFirebase';
import { calculateStreak, isHabitCompletedToday } from '../../utils/habitUtils';
import HabitCard from './HabitCard';
import HabitFilters from './HabitFilters';
import HabitForm from '../HabitForm/HabitForm';
import LoadingSpinner from '../common/LoadingSpinner';
import Alert from '../common/Alert';

const HabitList = () => {
  const { habits, loading: habitsLoading, error: habitsError, addHabit, updateHabit, deleteHabit } = useHabits();
  const { completions, loading: completionsLoading, error: completionsError, addCompletion, removeCompletion } = useCompletions();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showArchived, setShowArchived] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [alert, setAlert] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set();
    habits.forEach((habit) => {
      if (habit.category) cats.add(habit.category);
    });
    return Array.from(cats).sort();
  }, [habits]);

  // Filter and sort habits
  const filteredHabits = useMemo(() => {
    let filtered = habits;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((habit) =>
        habit.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((habit) => habit.category === selectedCategory);
    }

    // Filter by archived status
    if (!showArchived) {
      filtered = filtered.filter((habit) => !habit.archived);
    }

    // Sort habits
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'streak': {
          const streakA = calculateStreak(completions, a.id).current;
          const streakB = calculateStreak(completions, b.id).current;
          return streakB - streakA;
        }
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'date':
          return (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [habits, completions, searchQuery, selectedCategory, sortBy, showArchived]);

  const handleToggleComplete = async (habitId, isCompleted) => {
    try {
      if (isCompleted) {
        await removeCompletion(habitId, new Date());
      } else {
        await addCompletion(habitId, new Date());
      }
    } catch {
      setAlert({ type: 'error', message: 'Failed to update completion status' });
    }
  };

  const handleCreateHabit = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  const handleEditHabit = (habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleSubmitHabit = async (habitData) => {
    try {
      if (editingHabit) {
        await updateHabit(editingHabit.id, habitData);
        setAlert({ type: 'success', message: 'Habit updated successfully!' });
      } else {
        await addHabit(habitData);
        setAlert({ type: 'success', message: 'Habit created successfully!' });
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to save habit. Please try again.' });
      throw error;
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabit(habitId);
      setAlert({ type: 'success', message: 'Habit deleted successfully!' });
    } catch {
      setAlert({ type: 'error', message: 'Failed to delete habit. Please try again.' });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('name');
    setShowArchived(false);
  };

  if (habitsLoading || completionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (habitsError || completionsError) {
    return (
      <div className="p-4">
        <Alert
          type="error"
          message={habitsError || completionsError}
          onClose={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Habits
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {filteredHabits.length} {filteredHabits.length === 1 ? 'habit' : 'habits'}
          </p>
        </div>
        <button
          onClick={handleCreateHabit}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          New Habit
        </button>
      </div>

      {/* Alert */}
      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Filters */}
      {habits.length > 0 && (
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
      )}

      {/* Habit Grid */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <PlusCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            {habits.length === 0 ? 'No habits yet' : 'No habits found'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {habits.length === 0
              ? 'Create your first habit to start tracking your progress'
              : 'Try adjusting your filters or search query'}
          </p>
          {habits.length === 0 && (
            <button
              onClick={handleCreateHabit}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-colors"
            >
              <PlusCircle className="w-5 h-5" />
              Create Your First Habit
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              completions={completions}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
              isCompletedToday={isHabitCompletedToday(completions, habit.id)}
            />
          ))}
        </div>
      )}

      {/* Habit Form Modal */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleSubmitHabit}
        habit={editingHabit}
        existingCategories={categories}
      />
    </div>
  );
};

export default HabitList;
