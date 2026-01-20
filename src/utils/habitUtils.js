import { format, startOfDay, differenceInDays, addDays, subDays, isToday, isSameDay } from 'date-fns';

export const calculateStreak = (completions, habitId) => {
  if (!completions || completions.length === 0) {
    return { current: 0, longest: 0 };
  }

  // Filter completions for this habit
  const habitCompletions = completions
    .filter((c) => c.habitId === habitId)
    .map((c) => startOfDay(c.date.toDate()))
    .sort((a, b) => b - a); // Sort descending (newest first)

  if (habitCompletions.length === 0) {
    return { current: 0, longest: 0 };
  }

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let checkDate = startOfDay(new Date());

  // Calculate current streak
  for (const completion of habitCompletions) {
    const diff = differenceInDays(checkDate, completion);
    
    if (diff === 0 || diff === 1) {
      currentStreak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Calculate longest streak
  let prevDate = null;
  for (const completion of habitCompletions.sort((a, b) => a - b)) {
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diff = differenceInDays(completion, prevDate);
      if (diff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    prevDate = completion;
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
};

export const isHabitCompletedToday = (completions, habitId) => {
  if (!completions) return false;
  
  return completions.some(
    (c) => c.habitId === habitId && isToday(c.date.toDate())
  );
};

export const isHabitCompletedOnDate = (completions, habitId, date) => {
  if (!completions) return false;
  
  return completions.some(
    (c) => c.habitId === habitId && isSameDay(c.date.toDate(), date)
  );
};

export const getCompletionRate = (completions, habitId, days = 30) => {
  if (!completions) return 0;
  
  const habitCompletions = completions.filter((c) => c.habitId === habitId);
  const completionDays = habitCompletions.length;
  
  return Math.round((completionDays / days) * 100);
};

export const getCompletionsByDate = (completions, habitId) => {
  if (!completions) return {};
  
  const result = {};
  completions
    .filter((c) => c.habitId === habitId)
    .forEach((c) => {
      const dateKey = format(c.date.toDate(), 'yyyy-MM-dd');
      result[dateKey] = true;
    });
  
  return result;
};

export const getHabitColors = () => [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Green
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
];

export const formatDate = (date) => {
  return format(date, 'MMM dd, yyyy');
};

export const getWeeklyStats = (completions, habitId) => {
  const today = new Date();
  const weeklyData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const isCompleted = isHabitCompletedOnDate(completions, habitId, date);
    weeklyData.push({
      date: format(date, 'EEE'),
      completed: isCompleted ? 1 : 0,
    });
  }
  
  return weeklyData;
};

export const exportToJSON = (habits, completions) => {
  const data = {
    habits,
    completions,
    exportDate: new Date().toISOString(),
  };
  
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (habits, completions) => {
  const rows = [
    ['Date', 'Habit Name', 'Category', 'Completed'],
  ];
  
  completions.forEach((completion) => {
    const habit = habits.find((h) => h.id === completion.habitId);
    if (habit) {
      rows.push([
        format(completion.date.toDate(), 'yyyy-MM-dd'),
        habit.name,
        habit.category || '',
        'Yes',
      ]);
    }
  });
  
  const csv = rows.map((row) => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `habit-tracker-export-${format(new Date(), 'yyyy-MM-dd')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
