import { useState, useMemo } from 'react';
import { Target, TrendingUp, Calendar, Award } from 'lucide-react';
import { useHabits, useCompletions } from '../hooks/useFirebase';
import HabitList from './HabitList/HabitList';
import HabitForm from './HabitForm/HabitForm';
import Modal from './common/Modal';
import LoadingSpinner from './common/LoadingSpinner';
import Alert from './common/Alert';

const Dashboard = () => {
  const { habits, loading: habitsLoading, addHabit, updateHabit, deleteHabit, toggleArchive } = useHabits();
  const { completions, loading: completionsLoading } = useCompletions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  // Calculate statistics
  const stats = useMemo(() => {
    const activeHabits = habits.filter((h) => !h.archived);
    const today = new Date().toDateString();
    
    // Get today's completions
    const todayCompletions = completions.filter(
      (c) => c.date?.toDate().toDateString() === today
    );
    
    // Calculate completion rate for today
    const completionRate = activeHabits.length > 0
      ? Math.round((todayCompletions.length / activeHabits.length) * 100)
      : 0;
    
    // Calculate current streaks
    const habitsWithStreaks = activeHabits.filter((h) => {
      const habitCompletions = completions.filter((c) => c.habitId === h.id);
      if (habitCompletions.length === 0) return false;
      
      // Check if completed today or yesterday for active streak
      const sortedDates = habitCompletions
        .map((c) => c.date?.toDate())
        .sort((a, b) => b - a);
      
      const lastCompletion = sortedDates[0];
      const daysSinceLastCompletion = Math.floor(
        (new Date() - lastCompletion) / (1000 * 60 * 60 * 24)
      );
      
      return daysSinceLastCompletion <= 1;
    });

    return {
      totalHabits: activeHabits.length,
      completionRate,
      activeStreaks: habitsWithStreaks.length,
      todayCompleted: todayCompletions.length,
    };
  }, [habits, completions]);

  const handleAddHabit = async (habitData) => {
    try {
      await addHabit(habitData);
      setIsModalOpen(false);
      showAlert('Habit created successfully!', 'success');
    } catch (error) {
      showAlert('Failed to create habit', 'error');
      console.error('Error creating habit:', error);
    }
  };

  const handleEditHabit = async (habitData) => {
    try {
      await updateHabit(editingHabit.id, habitData);
      setIsModalOpen(false);
      setEditingHabit(null);
      showAlert('Habit updated successfully!', 'success');
    } catch (error) {
      showAlert('Failed to update habit', 'error');
      console.error('Error updating habit:', error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteHabit(habitId);
      showAlert('Habit deleted successfully!', 'success');
    } catch (error) {
      showAlert('Failed to delete habit', 'error');
      console.error('Error deleting habit:', error);
    }
  };

  const handleToggleArchive = async (habitId, archived) => {
    try {
      await toggleArchive(habitId, archived);
      showAlert(`Habit ${archived ? 'unarchived' : 'archived'} successfully!`, 'success');
    } catch (error) {
      showAlert('Failed to archive habit', 'error');
      console.error('Error archiving habit:', error);
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const openAddModal = () => {
    setEditingHabit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (habit) => {
    setEditingHabit(habit);
    setIsModalOpen(true);
  };

  if (habitsLoading || completionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Alert */}
      {alert.show && <Alert message={alert.message} type={alert.type} />}

      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome Back!
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your habits and build better routines.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Target}
          label="Total Habits"
          value={stats.totalHabits}
          color="bg-blue-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Completion Rate"
          value={`${stats.completionRate}%`}
          color="bg-green-500"
        />
        <StatCard
          icon={Award}
          label="Active Streaks"
          value={stats.activeStreaks}
          color="bg-purple-500"
        />
        <StatCard
          icon={Calendar}
          label="Completed Today"
          value={stats.todayCompleted}
          color="bg-orange-500"
        />
      </div>

      {/* Habits Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Your Habits
          </h3>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add Habit
          </button>
        </div>

        <HabitList
          habits={habits}
          completions={completions}
          onEdit={openEditModal}
          onDelete={handleDeleteHabit}
          onToggleArchive={handleToggleArchive}
        />
      </div>

      {/* Add/Edit Habit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <HabitForm
          habit={editingHabit}
          onSubmit={editingHabit ? handleEditHabit : handleAddHabit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

// StatCard Component
const StatCard = ({ icon, label, value, color }) => {
  const Icon = icon;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
