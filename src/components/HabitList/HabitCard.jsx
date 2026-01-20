import { useState } from 'react';
import { Flame, Edit, Trash, Check } from 'lucide-react';
import { calculateStreak } from '../../utils/habitUtils';

const HabitCard = ({ 
  habit, 
  completions, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  isCompletedToday 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const streaks = calculateStreak(completions, habit.id);

  const handleToggleComplete = async (e) => {
    e.stopPropagation();
    setIsProcessing(true);
    try {
      await onToggleComplete(habit.id, isCompletedToday);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(habit);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
      onDelete(habit.id);
    }
  };

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4"
      style={{ borderLeftColor: habit.color }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {habit.name}
            </h3>
            {habit.category && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                {habit.category}
              </span>
            )}
          </div>
          
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isProcessing}
            className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${
              isCompletedToday
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-500'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isCompletedToday ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompletedToday && <Check className="w-5 h-5" />}
          </button>
        </div>

        {/* Streak Info */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Current: <span className="font-semibold text-gray-900 dark:text-gray-100">{streaks.current}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Best: <span className="font-semibold text-gray-900 dark:text-gray-100">{streaks.longest}</span>
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && habit.description && (
          <div className="mb-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{habit.description}</p>
            {habit.frequency && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Frequency: {habit.frequency}
                {habit.frequency === 'custom' && habit.targetDaysPerWeek && 
                  ` (${habit.targetDaysPerWeek} days/week)`
                }
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleEdit}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Edit habit"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Delete habit"
          >
            <Trash className="w-4 h-4" />
            Delete
          </button>
          {habit.archived && (
            <span className="ml-auto px-2 py-0.5 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded">
              Archived
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
