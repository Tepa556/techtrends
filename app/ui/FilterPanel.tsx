"use client";

import { useState } from 'react';
import { useThemeStore } from '@/app/lib/ThemeStore';

export interface FilterOptions {
  timeFilter: string;
  sortBy: string;
  minRating: number;
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  isOpen: boolean;
  onToggle: () => void;
  showResultCount?: boolean;
  resultCount?: number;
}

export default function FilterPanel({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle, 
  showResultCount = false, 
  resultCount = 0 
}: FilterPanelProps) {
  const { theme } = useThemeStore();

  const timeOptions = [
    { value: 'all', label: 'Все время' },
    { value: 'today', label: 'Сегодня' },
    { value: 'week', label: 'Неделя' },
    { value: 'month', label: 'Месяц' },
    { value: 'year', label: 'Год' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Новые' },
    { value: 'oldest', label: 'Старые' },
    { value: 'popular', label: 'Популярные' },
    { value: 'rating', label: 'По рейтингу' },
    { value: 'comments', label: 'По комментариям' }
  ];

  const ratingOptions = [
    { value: 0, label: 'Любой рейтинг' },
    { value: 5, label: 'От +5' },
    { value: 10, label: 'От +10' },
    { value: 25, label: 'От +25' },
    { value: 50, label: 'От +50' }
  ];

  const resetFilters = () => {
    onFiltersChange({
      timeFilter: 'all',
      sortBy: 'newest',
      minRating: 0
    });
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = filters.timeFilter !== 'all' || filters.sortBy !== 'newest' || filters.minRating > 0;

  return (
    <div className="mb-6">
      {/* Кнопка фильтров и результаты */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggle}
            className={`inline-flex items-center px-4 py-2 rounded-lg border font-bold transition-colors ${
              theme === 'dark' 
                ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600' 
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.121A1 1 0 013 6.414V4z" />
            </svg>
            Фильтры
            {hasActiveFilters && (
              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-md transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Сбросить
            </button>
          )}
        </div>

        {showResultCount && (
          <div className={`text-sm font-bold ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Найдено: {resultCount} {resultCount === 1 ? 'статья' : resultCount < 5 ? 'статьи' : 'статей'}
          </div>
        )}
      </div>

      {/* Панель фильтров */}
      {isOpen && (
        <div className={`p-4 rounded-lg border transition-all duration-200 ${
          theme === 'dark' 
            ? 'border-gray-600 bg-gray-800' 
            : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Фильтр по времени */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Период времени
              </label>
              <select
                value={filters.timeFilter}
                onChange={(e) => updateFilter('timeFilter', e.target.value)}
                className={`w-full px-3 py-2 rounded-md border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Сортировка */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Сортировка
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                className={`w-full px-3 py-2 rounded-md border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Минимальный рейтинг */}
            <div>
              <label className={`block text-sm font-bold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Минимальный рейтинг
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => updateFilter('minRating', parseInt(e.target.value))}
                className={`w-full px-3 py-2 rounded-md border text-sm ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
                } focus:outline-none focus:ring-1 focus:ring-blue-500`}
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Активные фильтры */}
          {hasActiveFilters && (
            <div className={`mt-4 pt-4 border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`}>
              <div className="flex flex-wrap gap-2">
                <span className={`text-sm font-bold ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Активные фильтры:
                </span>
                
                {filters.timeFilter !== 'all' && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    theme === 'dark' 
                      ? 'bg-blue-900 text-blue-200' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {timeOptions.find(opt => opt.value === filters.timeFilter)?.label}
                  </span>
                )}
                
                {filters.sortBy !== 'newest' && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    theme === 'dark' 
                      ? 'bg-green-900 text-green-200' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {sortOptions.find(opt => opt.value === filters.sortBy)?.label}
                  </span>
                )}
                
                {filters.minRating > 0 && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                    theme === 'dark' 
                      ? 'bg-purple-900 text-purple-200' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    Рейтинг {filters.minRating}+
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 