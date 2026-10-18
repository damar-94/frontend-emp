export interface Category {
  id: number;
  name: string;
  createdAt: string;
}

export interface CreateCategorySchema {
  name: string;
}

export interface EditCategorySchema {
  id: number;
  name: string;
}
