import type { TUser } from '../types/TUser';
import { usersResponseMock } from './user-mock';

const USERS_STORAGE_KEY = 'kanban_users';

export const findAllUsersAPI = async (): Promise<TUser[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsers) {
        try {
          const users = JSON.parse(storedUsers);
          resolve(users);
          return;
        } catch (error) {
          console.error('Error parsing stored users:', error);
        }
      }

      localStorage.setItem(
        USERS_STORAGE_KEY,
        JSON.stringify(usersResponseMock),
      );
      resolve(usersResponseMock);
    }, 500);
  });
};
