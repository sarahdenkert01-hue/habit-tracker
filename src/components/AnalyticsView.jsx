import { useState, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay, isSameDay } from 'date-fns';
import { useHabits, useCompletions } from '../hooks/useFirebase';
import LoadingSpinner from './common/LoadingSpinner';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState(30); // days
  const { habits, loading: habitsLoading } = useHabits();
  const { completions, loading: completionsLoading } = useCompletions();

  const activeHabits = habits.filter((h) => !h.archived);

  // Calculate completion rate over time
  const completionRateData = useMemo(() => {
    const data = [];
    const today = new Date();

    for (let i = timeRange - 1; i >= 0; i--) {
      const date = startOfDay(subDays(today, i));
      const dateStr = format(date, 'MM/dd');

      const dayCompletions = completions.filter((c) =>
        isSameDay(c.date?.toDate(), date)
      );

      const rate = activeHabits.length > 0
        ? Math.round((dayCompletions.length / activeHabits.length) * 100)
        : 0;

      data.push({
        date: dateStr,
        rate,
        completed: dayCompletions.length,
        total: activeHabits.length,
      });
    }

    return data;
  }, [completions, activeHabits, timeRange]);

  // Calculate habit comparison data
  const habitComparisonData = useMemo(() => {
    return activeHabits.map((habit) => {
      const last30Days = completions.filter((c) => {
        const completionDate = c.date?.toDate();
        const daysDiff = (new Date() - completionDate) / MS_PER_DAY;
        return c.habitId === habit.id && daysDiff <= 30;
      });

      return {
        name: habit.name,
        completions: last30Days.length,
        color: habit.color || '#6366f1',
      };
    }).sort((a, b) => b.completions - a.completions);
  }, [activeHabits, completions]);

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const totalCompletions = completions.length;
    const last7Days = completions.filter((c) => {
      const completionDate = c.date?.toDate();
      const daysDiff = (new Date() - completionDate) / MS_PER_DAY;
      return daysDiff <= 7;
    });

    const last30Days = completions.filter((c) => {
      const completionDate = c.date?.toDate();
      const daysDiff = (new Date() - completionDate) / MS_PER_DAY;
      return daysDiff <= 30;
    });

    const avgCompletionsPerDay = last30Days.length / 30;
    const weeklyAvg = last7Days.length / 7;

    return {
      totalCompletions,
      last7Days: last7Days.length,
      last30Days: last30Days.length,
      avgPerDay: avgCompletionsPerDay.toFixed(1),
      weeklyAvg: weeklyAvg.toFixed(1),
    };
  }, [completions]);

  if (habitsLoading || completionsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics & Insights
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your progress and identify patterns
        </p>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Completions"
          value={overallStats.totalCompletions}
          subtitle="All time"
        />
        <StatCard
          label="Last 7 Days"
          value={overallStats.last7Days}
          subtitle="Recent activity"
        />
        <StatCard
          label="Last 30 Days"
          value={overallStats.last30Days}
          subtitle="Monthly total"
        />
        <StatCard
          label="Daily Average"
          value={overallStats.avgPerDay}
          subtitle="Last 30 days"
        />
      </div>

      {/* Time Range Filter */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Range:
        </label>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value={7}>Last 7 Days</option>
          <option value={14}>Last 14 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* Completion Rate Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Completion Rate Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={completionRateData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px' }}
              label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.5rem',
                color: '#F9FAFB',
              }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Habit Comparison Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Habit Performance (Last 30 Days)
        </h3>
        {habitComparisonData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={habitComparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis 
                stroke="#9CA3AF"
                style={{ fontSize: '12px' }}
                label={{ value: 'Completions', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#F9FAFB',
                }}
              />
              <Bar dataKey="completions" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No data available yet. Start tracking your habits!
          </div>
        )}
      </div>

      {/* Best Performing Habits */}
      {habitComparisonData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Top Performing Habits
          </h3>
          <div className="space-y-3">
            {habitComparisonData.slice(0, 5).map((habit, index) => (
              <div
                key={habit.name}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold text-gray-500 dark:text-gray-400">
                    #{index + 1}
                  </span>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: habit.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {habit.name}
                  </span>
                </div>
                <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                  {habit.completions} completions
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// StatCard Component
const StatCard = ({ label, value, subtitle }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
    <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
      {value}
    </p>
    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
  </div>
);

export default AnalyticsView;
