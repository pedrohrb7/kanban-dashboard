import { create } from 'zustand';
import type { TStatusType } from '../types';

export type SortDirection = 'asc' | 'desc';

interface KanbanFiltersState {
  statusFilter: TStatusType | 'all';
  responsibleFilter: number | 'all';
  searchQuery: string;
  sortBy: 'createdAt';
  sortDirection: SortDirection;
  currentPage: number;
  tasksPerPage: number;

  setStatusFilter: (status: TStatusType | 'all') => void;
  setResponsibleFilter: (userId: number | 'all') => void;
  setSearchQuery: (query: string) => void;
  setSortDirection: (direction: SortDirection) => void;
  setCurrentPage: (page: number) => void;
  resetFilters: () => void;
}

export const useKanbanFilters = create<KanbanFiltersState>(set => ({
  statusFilter: 'all',
  responsibleFilter: 'all',
  searchQuery: '',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  currentPage: 1,
  tasksPerPage: 10,

  setStatusFilter: status => set({ statusFilter: status, currentPage: 1 }),
  setResponsibleFilter: userId =>
    set({ responsibleFilter: userId, currentPage: 1 }),
  setSearchQuery: query => set({ searchQuery: query, currentPage: 1 }),
  setSortDirection: direction => set({ sortDirection: direction }),
  setCurrentPage: page => set({ currentPage: page }),
  resetFilters: () =>
    set({
      statusFilter: 'all',
      responsibleFilter: 'all',
      searchQuery: '',
      sortDirection: 'desc',
      currentPage: 1,
    }),
}));
