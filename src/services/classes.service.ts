import { api } from '../lib/axios';
import { ClasseSchema, ClassesListSchema, type Classe } from '../types/api';

export const classesService = {
  async getAll(): Promise<Classe[]> {
    const response = await api.get('/classes');
    const parsed = ClassesListSchema.parse(response.data);
    return parsed.data;
  },

  async getById(id: string): Promise<Classe> {
    const response = await api.get(`/classes/${id}`);
    return ClasseSchema.parse(response.data);
  },
};
