import { HistoryItem, AnalysisResult } from '../types';

const STORAGE_KEY = 'salah_foods_history_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn('Failed to parse history from storage', e);
    return [];
  }
};

export const saveToHistory = (result: AnalysisResult) => {
  try {
    const history = getHistory();
    // Create new item
    const newItem: HistoryItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      result
    };
    
    // Add to beginning of array and limit to 50 items to prevent storage overflow
    const updatedHistory = [newItem, ...history].slice(0, 50);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error('Failed to save history', e);
  }
};

export const deleteFromHistory = (id: string): HistoryItem[] => {
  try {
    const history = getHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (e) {
    console.error('Failed to delete history item', e);
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(STORAGE_KEY);
};