'use client';

import { useState } from 'react';
import { validateHabitName } from '@/lib/validators';
import { Habit } from '@/types/habit';

type Props = {
  onSave: (habit: Partial<Habit>) => void;
  initialData?: Habit | null;
  onCancel: () => void;
};

export default function HabitForm({ onSave, initialData, onCancel }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [error, setError] = useState<string | null>(null);
  const [frequency, setFrequency] = useState<Habit['frequency']>(
    initialData?.frequency || 'daily'
  );

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const validation = validateHabitName(name);

    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    onSave({
      ...initialData,
      name: validation.value,
      description,
      frequency,
    });

    setName('');
    setDescription('');
    setError(null);
  }

  return (
    <form
      data-testid="habit-form"
      onSubmit={handleSubmit}
      aria-label="Habit form"
      className={
        "w-full max-w-lg mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-8 flex flex-col gap-5 md:gap-6"
      }
    >
      <h3 className="text-lg md:text-2xl font-semibold text-gray-800">
        Habit Details
      </h3>

      {/* NAME */}
      <div className="relative">
        <label
          htmlFor="name"
          className="absolute -top-2 left-3 px-1 bg-white text-xs md:text-sm text-gray-500"
        >
          Habit Name
        </label>
        <input
          id="name"
          data-testid="habit-name-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink Water"
          required
          aria-label="Habit name"
          className="w-full mt-2 px-4 py-3 md:py-4 text-sm md:text-base rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="relative">
        <label
          htmlFor="description"
          className="absolute -top-2 left-3 px-1 bg-white text-xs md:text-sm text-gray-500"
        >
          Description
        </label>
        <input
          id="description"
          data-testid="habit-description-input"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
          aria-label="Habit description"
          className="w-full mt-2 px-4 py-3 md:py-4 text-sm md:text-base rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FREQUENCY */}
      <div className="relative">
        <label
          htmlFor="frequency"
          className="absolute -top-2 left-3 px-1 bg-white text-xs md:text-sm text-gray-500"
        >
          Frequency
        </label>
        <select
          id="frequency"
          data-testid="habit-frequency-select"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as Habit['frequency'])}
          aria-label="Habit frequency"
          className="w-full mt-2 px-4 py-3 md:py-4 text-sm md:text-base rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="biweekly">Biweekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 text-sm md:text-base" role="alert">
          {error}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          data-testid="habit-save-button"
          type="submit"
          className="w-full sm:w-auto py-3 md:py-4 px-5 text-sm md:text-base font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="w-full sm:w-auto py-3 md:py-4 px-5 text-sm md:text-base font-semibold rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}