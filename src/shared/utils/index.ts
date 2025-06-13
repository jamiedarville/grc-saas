// Shared utility functions for the GRC SaaS platform

import { RiskAssessment, Risk } from '../types';

/**
 * Calculate risk score based on likelihood and impact
 */
export const calculateRiskScore = (likelihood: number, impact: number): number => {
  return likelihood * impact;
};

/**
 * Get risk level based on score
 */
export const getRiskLevel = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
  if (score <= 5) return 'low';
  if (score <= 10) return 'medium';
  if (score <= 15) return 'high';
  return 'critical';
};

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Format date and time for display
 */
export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Calculate days until due date
 */
export const getDaysUntilDue = (dueDate: Date | string): number => {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if date is overdue
 */
export const isOverdue = (dueDate: Date | string): boolean => {
  return getDaysUntilDue(dueDate) < 0;
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Convert string to slug format
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get status color for UI components
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    active: '#10B981',
    inactive: '#6B7280',
    pending: '#F59E0B',
    completed: '#10B981',
    overdue: '#EF4444',
    critical: '#DC2626',
    high: '#F59E0B',
    medium: '#3B82F6',
    low: '#10B981',
    effective: '#10B981',
    partially_effective: '#F59E0B',
    ineffective: '#EF4444',
    not_tested: '#6B7280'
  };
  return statusColors[status.toLowerCase()] || '#6B7280';
};

/**
 * Calculate compliance percentage
 */
export const calculateCompliancePercentage = (
  totalRequirements: number,
  compliantRequirements: number
): number => {
  if (totalRequirements === 0) return 0;
  return Math.round((compliantRequirements / totalRequirements) * 100);
};

/**
 * Get priority weight for sorting
 */
export const getPriorityWeight = (priority: string): number => {
  const weights: Record<string, number> = {
    urgent: 4,
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };
  return weights[priority.toLowerCase()] || 1;
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const missingFields = requiredFields.filter(field => 
    !data[field] || (typeof data[field] === 'string' && data[field].trim() === '')
  );
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Generate random color
 */
export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Calculate control effectiveness score
 */
export const calculateControlEffectiveness = (
  testResults: Array<{ passed: boolean; weight: number }>
): number => {
  if (testResults.length === 0) return 0;
  
  const totalWeight = testResults.reduce((sum, result) => sum + result.weight, 0);
  const passedWeight = testResults
    .filter(result => result.passed)
    .reduce((sum, result) => sum + result.weight, 0);
  
  return Math.round((passedWeight / totalWeight) * 100);
};

/**
 * Get next review date based on frequency
 */
export const getNextReviewDate = (
  lastReview: Date,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually'
): Date => {
  const date = new Date(lastReview);
  
  switch (frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'annually':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }
  
  return date;
};

/**
 * Export data to CSV format
 */
export const exportToCSV = (data: any[], filename: string): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    )
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  window.URL.revokeObjectURL(url);
};

/**
 * Search and filter utilities
 */
export const searchInObject = (obj: any, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase();
  
  const searchRecursive = (value: any): boolean => {
    if (typeof value === 'string') {
      return value.toLowerCase().includes(term);
    }
    if (typeof value === 'number') {
      return value.toString().includes(term);
    }
    if (Array.isArray(value)) {
      return value.some(item => searchRecursive(item));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some((val: any) => searchRecursive(val));
    }
    return false;
  };
  
  return searchRecursive(obj);
};

/**
 * Sort array by multiple criteria
 */
export const multiSort = <T>(
  array: T[],
  sortCriteria: Array<{ key: keyof T; direction: 'asc' | 'desc' }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const criteria of sortCriteria) {
      const { key, direction } = criteria;
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};