import type { TUser } from '../types/TUser';
import { usersResponseMock } from './user-mock';

interface CreateUserPayload {
  name: string;
  email: string;
}

export const createUserAPI = async (
  payload: CreateUserPayload,
): Promise<TUser> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const USERS_STORAGE_KEY = 'kanban_users';
  const storedUsers = localStorage.getItem(USERS_STORAGE_KEY);
  const existingUsers = storedUsers ? JSON.parse(storedUsers) : [];
  const allUsers = [...usersResponseMock, ...existingUsers];

  const maxId = Math.max(0, ...allUsers.map(user => user.id));
  const newId = maxId + 1;

  const newUser: TUser = {
    id: newId,
    name: payload.name,
    email: payload.email,
  };

  return newUser;
};
