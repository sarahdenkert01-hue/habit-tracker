import { useState, useEffect } from 'react';
import { Save, X, Archive, ArchiveRestore } from 'lucide-react';
import Modal from '../common/Modal';
import { getHabitColors } from '../../utils/habitUtils';

const HabitForm = ({ isOpen, onClose, onSubmit, habit = null, existingCategories = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    color: getHabitColors()[0],
    frequency: 'daily',
    targetDaysPerWeek: 7,
    archived: false,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name || '',
        description: habit.description || '',
        category: habit.category || '',
        color: habit.color || getHabitColors()[0],
        frequency: habit.frequency || 'daily',
        targetDaysPerWeek: habit.targetDaysPerWeek || 7,
        archived: habit.archived || false,
      });
      setShowNewCategory(!existingCategories.includes(habit.category));
    } else {
      setFormData({
        name: '',
        description: '',
        category: existingCategories.length > 0 ? existingCategories[0] : '',
        color: getHabitColors()[0],
        frequency: 'daily',
        targetDaysPerWeek: 7,
        archived: false,
      });
      setShowNewCategory(existingCategories.length === 0);
    }
    setErrors({});
  }, [habit, isOpen, existingCategories]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Habit name must be at least 2 characters';
    }
    
    if (formData.frequency === 'custom' && formData.targetDaysPerWeek < 1) {
      newErrors.targetDaysPerWeek = 'Target days must be at least 1';
    }
    
    if (formData.frequency === 'custom' && formData.targetDaysPerWeek > 7) {
      newErrors.targetDaysPerWeek = 'Target days cannot exceed 7';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
      };
      
      if (formData.frequency !== 'custom') {
        delete submitData.targetDaysPerWeek;
      }
      
      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error('Error submitting habit:', error);
      setErrors({ submit: 'Failed to save habit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      color: getHabitColors()[0],
      frequency: 'daily',
      targetDaysPerWeek: 7,
      archived: false,
    });
    setErrors({});
    setIsSubmitting(false);
    onClose();
  };

  const handleCategoryChange = (value) => {
    if (value === '__new__') {
      setShowNewCategory(true);
      setFormData({ ...formData, category: '' });
    } else {
      setShowNewCategory(false);
      setFormData({ ...formData, category: value });
    }
  };

  const toggleArchive = () => {
    setFormData({ ...formData, archived: !formData.archived });
  };

  const colors = getHabitColors();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={habit ? 'Edit Habit' : 'Create New Habit'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Habit Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Morning Exercise"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="Optional description or notes"
            disabled={isSubmitting}
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          {!showNewCategory && existingCategories.length > 0 ? (
            <div className="flex gap-2">
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                disabled={isSubmitting}
              >
                {existingCategories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__new__">+ Create New Category</option>
              </select>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                placeholder="e.g., Health, Productivity"
                disabled={isSubmitting}
              />
              {existingCategories.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setShowNewCategory(false);
                    setFormData({ ...formData, category: existingCategories[0] });
                  }}
                  className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-10 h-10 rounded-lg border-2 transition-all ${
                  formData.color === color
                    ? 'border-gray-900 dark:border-gray-100 scale-110'
                    : 'border-transparent hover:border-gray-400 dark:hover:border-gray-600'
                }`}
                style={{ backgroundColor: color }}
                disabled={isSubmitting}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        {/* Frequency Select */}
        <div>
          <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Frequency
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            disabled={isSubmitting}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        {/* Target Days Per Week */}
        {formData.frequency === 'custom' && (
          <div>
            <label htmlFor="targetDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Days Per Week
            </label>
            <input
              type="number"
              id="targetDays"
              min="1"
              max="7"
              value={formData.targetDaysPerWeek}
              onChange={(e) => setFormData({ ...formData, targetDaysPerWeek: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 ${
                errors.targetDaysPerWeek ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            />
            {errors.targetDaysPerWeek && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.targetDaysPerWeek}</p>
            )}
          </div>
        )}

        {/* Archive Toggle (Edit Mode Only) */}
        {habit && (
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formData.archived ? 'Archived' : 'Active'}
            </span>
            <button
              type="button"
              onClick={toggleArchive}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              {formData.archived ? (
                <>
                  <ArchiveRestore className="w-4 h-4" />
                  Unarchive
                </>
              ) : (
                <>
                  <Archive className="w-4 h-4" />
                  Archive
                </>
              )}
            </button>
          </div>
        )}

        {/* Submit Error */}
        {errors.submit && (
          <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : habit ? 'Update Habit' : 'Create Habit'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Cancel"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default HabitForm;
