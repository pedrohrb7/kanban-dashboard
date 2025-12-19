import type { TColumnResponse } from '../../types/TColumn';

import { columnsResponseMock } from '../kanban-mock';

export const findAllColumnsAPI = async (): Promise<TColumnResponse[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(columnsResponseMock);
    }, 3000);
  });
};
