// Type for the expense category
export type ExpenseCategory = {
  id: number;
  name: string;
  description: string;
};

// Type for the expense itself
export type Expense = {
  id: number;
  amount: number | null;
  category: number;
  description: string | null;
  date: string | null;
  createAt: string | null;
};

// Type to hold both the category and the expense
export type ExpenseWithCategory = {
  expense_category: {
    id: number;
    name: string;
    description: string;
  } | null;
  expenses: {
    id: number;
    amount: number | null;
    category: number;
    description: string | null;
    date: string | null;
    createAt: string | null;
  };
};

export type SaleWithCategory = {
  sales_category: {
    id: number;
    name: string;
    description: string;
  } | null;
  sales: {
    id: number;
    amount: number | null;
    category: number;
    description: string | null;
    date: string | null;
    createAt: string | null;
  };
};
