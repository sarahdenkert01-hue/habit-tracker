import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek } from 'date-fns';
import { useHabits, useCompletions } from '../hooks/useFirebase';
import LoadingSpinner from './common/LoadingSpinner';

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits, loading: habitsLoading } = useHabits();
  const { completions, loading: completionsLoading, addCompletion, removeCompletion } = useCompletions();

  const activeHabits = habits.filter((h) => !h.archived);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Get completions for a specific date and habit
  const getCompletionStatus = (date, habitId) => {
    return completions.some(
      (c) =>
        c.habitId === habitId &&
        isSameDay(c.date?.toDate(), date)
    );
  };

  // Toggle completion for a habit on a specific date
  const toggleCompletion = async (date, habitId) => {
    try {
      const isCompleted = getCompletionStatus(date, habitId);
      if (isCompleted) {
        await removeCompletion(habitId, date);
      } else {
        await addCompletion(habitId, date);
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  if (habitsLoading || completionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Habit Calendar
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Visualize your habit completion history
        </p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={handlePreviousMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <button
            onClick={handleToday}
            className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Today
          </button>
        </div>

        <button
          onClick={handleNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Habits List */}
      {activeHabits.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No active habits found. Create a habit to start tracking!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeHabits.map((habit) => (
            <div
              key={habit.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Habit Header */}
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: habit.color || '#6366f1' }}
                  />
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {habit.name}
                  </h4>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Week Day Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-600 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-2">
                  {calendarDays.map((day, index) => {
                    const isCompleted = getCompletionStatus(day, habit.id);
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const isToday = isSameDay(day, new Date());
                    const isFuture = day > new Date();

                    return (
                      <button
                        key={index}
                        onClick={() => !isFuture && toggleCompletion(day, habit.id)}
                        disabled={isFuture}
                        className={`
                          aspect-square rounded-lg border-2 transition-all
                          ${!isCurrentMonth && 'opacity-30'}
                          ${isToday && 'ring-2 ring-indigo-500'}
                          ${isFuture && 'cursor-not-allowed opacity-20'}
                          ${!isFuture && 'hover:scale-105'}
                          ${
                            isCompleted
                              ? 'bg-green-500 border-green-600 dark:bg-green-600 dark:border-green-700'
                              : 'bg-gray-100 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                          }
                        `}
                      >
                        <div className="flex flex-col items-center justify-center h-full">
                          <span
                            className={`text-sm font-medium ${
                              isCompleted
                                ? 'text-white'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {format(day, 'd')}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-gray-700 dark:text-gray-300">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600" />
            <span className="text-gray-700 dark:text-gray-300">Not Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-700 border-2 border-indigo-500" />
            <span className="text-gray-700 dark:text-gray-300">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
