// Interfaces for typed data
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'parent' | 'child';
  pin: string;
}

export interface Child {
  id: string;
  name: string;
  age: number;
  email: string;
  phone: string;
  school: string;
  avatar: string;
  isActive: boolean;
  parentId: string;
  accounts: {
    spending: {
      id: string;
      balance: number;
      restrictions: string[];
    };
    savings: {
      id: string;
      balance: number;
      goals: SavingsGoal[];
    };
    investing?: {
      id: string;
      balance: number;
      investments: Investment[];
    };
  };
}

export interface Parent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  childrenIds: string[];
  bankAccounts: BankAccount[];
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  number: string;
  isDefault: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'payment' | 'allowance' | 'chore';
  category: string;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  fromAccount?: string;
  toAccount?: string;
}

export interface Allowance {
  id: string;
  childId: string;
  amount: number;
  frequency: 'weekly' | 'bi-weekly' | 'monthly';
  day: string;
  isActive: boolean;
  nextPaymentDate: string;
  allocation: {
    spending: number;
    savings: number;
    giving: number;
  };
}

export interface Chore {
  id: string;
  childId: string;
  name: string;
  value: number;
  dueDay: string;
  completed: boolean;
  enabled: boolean;
  lastCompleted?: string;
  recurrence: 'daily' | 'weekly' | 'monthly' | 'once';
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: Date;
  childId: string;
  imageUrl?: string;
  createdDate?: string;
  completed?: boolean;
}

export interface Investment {
  id: string;
  childId: string;
  symbol: string;
  name: string;
  shares: number;
  purchasePrice: number;
  currentPrice: number;
  purchaseDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'transaction' | 'chore' | 'allowance' | 'goal' | 'system';
  relatedId?: string;
}

// Mock user data (parents and children)
export const users: User[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: 'man',
    role: 'parent',
    pin: '1234'
  },
  {
    id: 'c1',
    name: 'Emma Smith',
    email: 'emma.smith@example.com',
    avatar: 'girl',
    role: 'child',
    pin: '0000'
  },
  {
    id: 'c2',
    name: 'Noah Smith',
    email: 'noah.smith@example.com',
    avatar: 'boy',
    role: 'child',
    pin: '1111'
  }
];

// Mock parent data
export const parents: Parent[] = [
  {
    id: 'p1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '555-123-4567',
    avatar: 'man',
    childrenIds: ['c1', 'c2'],
    bankAccounts: [
      {
        id: 'ba1',
        name: 'Main Checking',
        type: 'checking',
        balance: 5243.75,
        number: '**** 1234',
        isDefault: true
      },
      {
        id: 'ba2',
        name: 'Savings Account',
        type: 'savings',
        balance: 12500.00,
        number: '**** 5678',
        isDefault: false
      },
      {
        id: 'ba3',
        name: 'Credit Card',
        type: 'credit',
        balance: -450.25,
        number: '**** 9012',
        isDefault: false
      }
    ]
  }
];

// Mock children data
export const children: Child[] = [
  {
    id: 'c1',
    name: 'Emma Smith',
    age: 15,
    email: 'emma.smith@example.com',
    phone: '555-987-6543',
    school: 'Lincoln High School',
    avatar: 'girl',
    isActive: true,
    parentId: 'p1',
    accounts: {
      spending: {
        id: 'acc1',
        balance: 45.75,
        restrictions: ['Online Games', 'Streaming Services']
      },
      savings: {
        id: 'acc2',
        balance: 125.50,
        goals: [
          {
            id: 'goal1',
            childId: 'c1',
            name: 'New Bike',
            targetAmount: 200.00,
            currentAmount: 75.00,
            imageUrl: 'https://example.com/bike.jpg',
            createdDate: '2023-01-15',
            targetDate: new Date('2023-06-15'),
            completed: false
          },
          {
            id: 'goal2',
            childId: 'c1',
            name: 'Summer Camp',
            targetAmount: 300.00,
            currentAmount: 50.50,
            createdDate: '2023-02-10',
            targetDate: new Date('2023-07-01'),
            completed: false
          }
        ]
      },
      investing: {
        id: 'acc3',
        balance: 100.00,
        investments: [
          {
            id: 'inv1',
            childId: 'c1',
            symbol: 'AAPL',
            name: 'Apple Inc.',
            shares: 0.5,
            purchasePrice: 150.00,
            currentPrice: 180.00,
            purchaseDate: '2023-03-01'
          },
          {
            id: 'inv2',
            childId: 'c1',
            symbol: 'MSFT',
            name: 'Microsoft Corporation',
            shares: 0.25,
            purchasePrice: 280.00,
            currentPrice: 300.00,
            purchaseDate: '2023-03-15'
          }
        ]
      }
    }
  },
  {
    id: 'c2',
    name: 'Noah Smith',
    age: 13,
    email: 'noah.smith@example.com',
    phone: '555-789-0123',
    school: 'Washington Middle School',
    avatar: 'boy',
    isActive: true,
    parentId: 'p1',
    accounts: {
      spending: {
        id: 'acc4',
        balance: 32.40,
        restrictions: ['In-App Purchases']
      },
      savings: {
        id: 'acc5',
        balance: 75.25,
        goals: [
          {
            id: 'goal3',
            childId: 'c2',
            name: 'Video Game',
            targetAmount: 60.00,
            currentAmount: 45.00,
            createdDate: '2023-02-20',
            targetDate: new Date('2023-05-01'),
            completed: false
          }
        ]
      }
    }
  }
];

// Mock allowance data
export const allowances: Allowance[] = [
  {
    id: 'all1',
    childId: 'c1',
    amount: 20.00,
    frequency: 'weekly',
    day: 'Sunday',
    isActive: true,
    nextPaymentDate: '2023-04-23',
    allocation: {
      spending: 70,
      savings: 20,
      giving: 10
    }
  },
  {
    id: 'all2',
    childId: 'c2',
    amount: 15.00,
    frequency: 'bi-weekly',
    day: 'Friday',
    isActive: true,
    nextPaymentDate: '2023-04-28',
    allocation: {
      spending: 60,
      savings: 30,
      giving: 10
    }
  }
];

// Mock chores data
export const chores: Chore[] = [
  {
    id: 'chore1',
    childId: 'c1',
    name: 'Clean room',
    value: 5.00,
    dueDay: 'Saturday',
    completed: false,
    enabled: true,
    recurrence: 'weekly'
  },
  {
    id: 'chore2',
    childId: 'c1',
    name: 'Do dishes',
    value: 2.00,
    dueDay: 'Daily',
    completed: true,
    lastCompleted: '2023-04-18',
    enabled: true,
    recurrence: 'daily'
  },
  {
    id: 'chore3',
    childId: 'c1',
    name: 'Take out trash',
    value: 1.00,
    dueDay: 'Monday',
    completed: true,
    lastCompleted: '2023-04-17',
    enabled: true,
    recurrence: 'weekly'
  },
  {
    id: 'chore4',
    childId: 'c2',
    name: 'Homework',
    value: 3.00,
    dueDay: 'Weekdays',
    completed: false,
    enabled: true,
    recurrence: 'weekly'
  },
  {
    id: 'chore5',
    childId: 'c2',
    name: 'Walk the dog',
    value: 2.00,
    dueDay: 'Daily',
    completed: false,
    enabled: true,
    recurrence: 'daily'
  }
];

// Mock transaction data
export const transactions: Transaction[] = [
  {
    id: 'tx1',
    userId: 'c1',
    amount: 20.00,
    type: 'allowance',
    category: 'Income',
    description: 'Weekly Allowance',
    date: '2023-04-16',
    status: 'completed',
    fromAccount: 'ba1',
    toAccount: 'acc1'
  },
  {
    id: 'tx2',
    userId: 'c1',
    amount: 5.00,
    type: 'chore',
    category: 'Income',
    description: 'Completed Chore: Clean room',
    date: '2023-04-15',
    status: 'completed',
    fromAccount: 'ba1',
    toAccount: 'acc1'
  },
  {
    id: 'tx3',
    userId: 'c1',
    amount: 12.50,
    type: 'payment',
    category: 'Shopping',
    description: 'Online Purchase',
    date: '2023-04-14',
    status: 'completed',
    fromAccount: 'acc1'
  },
  {
    id: 'tx4',
    userId: 'c1',
    amount: 15.00,
    type: 'transfer',
    category: 'Savings',
    description: 'Transfer to New Bike Goal',
    date: '2023-04-10',
    status: 'completed',
    fromAccount: 'acc1',
    toAccount: 'acc2'
  },
  {
    id: 'tx5',
    userId: 'c2',
    amount: 15.00,
    type: 'allowance',
    category: 'Income',
    description: 'Bi-weekly Allowance',
    date: '2023-04-14',
    status: 'completed',
    fromAccount: 'ba1',
    toAccount: 'acc4'
  },
  {
    id: 'tx6',
    userId: 'c2',
    amount: 7.99,
    type: 'payment',
    category: 'Entertainment',
    description: 'Movie Rental',
    date: '2023-04-12',
    status: 'completed',
    fromAccount: 'acc4'
  },
  {
    id: 'tx7',
    userId: 'c1',
    amount: 50.00,
    type: 'deposit',
    category: 'Gift',
    description: 'Birthday Money from Grandma',
    date: '2023-04-05',
    status: 'completed',
    toAccount: 'acc1'
  }
];

// Mock notifications
export const notifications: NotificationItem[] = [
  {
    id: 'notif1',
    userId: 'c1',
    title: 'Allowance Received',
    message: 'Your weekly allowance of $20.00 has been deposited to your account.',
    date: '2023-04-16',
    read: true,
    type: 'allowance',
    relatedId: 'tx1'
  },
  {
    id: 'notif2',
    userId: 'c1',
    title: 'Chore Completed',
    message: 'You earned $5.00 for completing: Clean room',
    date: '2023-04-15',
    read: false,
    type: 'chore',
    relatedId: 'chore1'
  },
  {
    id: 'notif3',
    userId: 'c1',
    title: 'Almost there!',
    message: 'You\'re 62.5% of the way to your New Bike goal!',
    date: '2023-04-10',
    read: false,
    type: 'goal',
    relatedId: 'goal1'
  },
  {
    id: 'notif4',
    userId: 'c2',
    title: 'Allowance Received',
    message: 'Your bi-weekly allowance of $15.00 has been deposited to your account.',
    date: '2023-04-14',
    read: true,
    type: 'allowance',
    relatedId: 'tx5'
  },
  {
    id: 'notif5',
    userId: 'c2',
    title: 'Reminder',
    message: 'Don\'t forget to complete your chores this week!',
    date: '2023-04-17',
    read: false,
    type: 'system'
  }
];

// Function to get child by ID
export const getChildById = (id: string): Child | undefined => {
  return children.find(child => child.id === id);
};

// Function to get parent by ID
export const getParentById = (id: string): Parent | undefined => {
  return parents.find(parent => parent.id === id);
};

// Function to get user by ID
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Function to get children by parent ID
export const getChildrenByParentId = (parentId: string): Child[] => {
  return children.filter(child => child.parentId === parentId);
};

// Function to get transactions by user ID
export const getTransactionsByUserId = (userId: string): Transaction[] => {
  return transactions.filter(transaction => transaction.userId === userId);
};

// Function to get chores by child ID
export const getChoresByChildId = (childId: string): Chore[] => {
  return chores.filter(chore => chore.childId === childId);
};

// Function to get allowance by child ID
export const getAllowanceByChildId = (childId: string): Allowance | undefined => {
  return allowances.find(allowance => allowance.childId === childId);
};

// Function to get notifications by user ID
export const getNotificationsByUserId = (userId: string): NotificationItem[] => {
  return notifications.filter(notification => notification.userId === userId);
};

// Function to get savings goals by child ID
export const getSavingsGoalsByChildId = (childId: string): SavingsGoal[] => {
  // First check the standalone savings goals array
  const goals = savingsGoals.filter(goal => goal.childId === childId);
  if (goals.length > 0) {
    return goals;
  }
  
  // If no goals found in standalone array, check the child's accounts
  const child = children.find(c => c.id === childId);
  if (child?.accounts.savings.goals) {
    // Convert date strings to Date objects to match our interface
    return child.accounts.savings.goals.map(goal => ({
      ...goal,
      targetDate: goal.targetDate ? new Date(goal.targetDate) : undefined
    }));
  }
  
  return [];
}

export function addSavingsGoal(goalData: Omit<SavingsGoal, 'id'>): SavingsGoal {
  const newGoal: SavingsGoal = {
    ...goalData,
    id: `sg${savingsGoals.length + 1}`, // Simple ID generation for mock data
  };
  
  savingsGoals.push(newGoal);
  return newGoal;
}

export const mockInvestments: Investment[] = [
  {
    id: 'i1',
    childId: 'c1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 2,
    purchasePrice: 150.75,
    currentPrice: 165.30,
    purchaseDate: '2023-06-15',
  },
  {
    id: 'i2',
    childId: 'c1',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    shares: 1,
    purchasePrice: 290.20,
    currentPrice: 315.75,
    purchaseDate: '2023-07-22',
  },
  {
    id: 'i3',
    childId: 'c2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    shares: 0.5,
    purchasePrice: 120.50,
    currentPrice: 135.80,
    purchaseDate: '2023-08-10',
  },
  {
    id: 'i4',
    childId: 'c3',
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    shares: 1.5,
    purchasePrice: 245.30,
    currentPrice: 230.10,
    purchaseDate: '2023-05-05',
  },
];

let savingsGoals: SavingsGoal[] = [
  {
    id: 'sg1',
    name: 'New Bike',
    targetAmount: 250,
    currentAmount: 125,
    targetDate: new Date('2024-12-31'),
    childId: 'c1',
  },
  {
    id: 'sg2',
    name: 'Video Game',
    targetAmount: 60,
    currentAmount: 40,
    targetDate: new Date('2024-08-15'),
    childId: 'c1',
  },
  {
    id: 'sg3',
    name: 'Holiday Gift',
    targetAmount: 100,
    currentAmount: 10,
    childId: 'c2',
  },
]; 