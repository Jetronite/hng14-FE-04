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

  function handleSubmit(e: React.FormEvent) {
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
      frequency: 'daily',
    });

    setName('');
    setDescription('');
    setError(null);
  }

  return (
    <form data-testid="habit-form" onSubmit={handleSubmit} className="border p-4 rounded mb-4">
      <input
        data-testid="habit-name-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Habit name"
        className="block border p-2 mb-2 w-full"
      />

      <input
        data-testid="habit-description-input"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="block border p-2 mb-2 w-full"
      />

      <select data-testid="habit-frequency-select" disabled className="block border p-2 mb-2 w-full">
        <option value="daily">Daily</option>
      </select>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <div className="flex gap-2">
        <button data-testid="habit-save-button" type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}