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
  xp: number; // Experience points earned through quizzes
  completedQuizzes: string[]; // IDs of completed quizzes
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

// Educational Videos
export interface FinanceVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  likes: number;
  views: number;
  tags: string[];
  forAgeGroups: number[]; // E.g., [8, 9, 10, 11, 12] for videos suitable for ages 8-12
}

export const financeVideos: FinanceVideo[] = [
  {
    id: 'v1',
    title: 'What is Money?',
    description: 'Learn the basics of money - what it is, where it comes from, and why we use it!',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=What+is+Money',
    videoUrl: 'https://example.com/videos/what-is-money',
    duration: '2:30',
    likes: 1254,
    views: 5628,
    tags: ['basics', 'money', 'beginners'],
    forAgeGroups: [6, 7, 8, 9, 10]
  },
  {
    id: 'v2',
    title: 'Saving vs. Spending',
    description: 'Why is it important to save? Learn about the difference between saving and spending money.',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=Saving+vs+Spending',
    videoUrl: 'https://example.com/videos/saving-vs-spending',
    duration: '3:15',
    likes: 987,
    views: 4321,
    tags: ['saving', 'spending', 'budgeting'],
    forAgeGroups: [8, 9, 10, 11, 12]
  },
  {
    id: 'v3',
    title: 'What are Stocks?',
    description: 'Learn how stocks work and why companies sell them. Explained for kids!',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=What+Are+Stocks',
    videoUrl: 'https://example.com/videos/stocks-for-kids',
    duration: '2:45',
    likes: 756,
    views: 3892,
    tags: ['investing', 'stocks', 'advanced'],
    forAgeGroups: [10, 11, 12, 13, 14]
  },
  {
    id: 'v4',
    title: 'Setting Money Goals',
    description: 'How to set financial goals and save up for something you really want.',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=Setting+Money+Goals',
    videoUrl: 'https://example.com/videos/setting-money-goals',
    duration: '2:20',
    likes: 1089,
    views: 4723,
    tags: ['goals', 'saving', 'planning'],
    forAgeGroups: [7, 8, 9, 10, 11, 12]
  },
  {
    id: 'v5',
    title: 'What is Interest?',
    description: 'Learn how interest works and why it helps your money grow when you save.',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=What+Is+Interest',
    videoUrl: 'https://example.com/videos/interest-explained',
    duration: '3:05',
    likes: 842,
    views: 3678,
    tags: ['interest', 'saving', 'advanced'],
    forAgeGroups: [9, 10, 11, 12, 13]
  },
  {
    id: 'v6',
    title: 'What is a Budget?',
    description: 'Learn how to make a simple budget and track your money.',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=What+Is+A+Budget',
    videoUrl: 'https://example.com/videos/budgeting-basics',
    duration: '2:50',
    likes: 976,
    views: 4102,
    tags: ['budgeting', 'planning', 'basics'],
    forAgeGroups: [8, 9, 10, 11, 12]
  },
  {
    id: 'v7',
    title: 'Needs vs. Wants',
    description: 'Understanding the difference between things you need and things you want.',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=Needs+vs+Wants',
    videoUrl: 'https://example.com/videos/needs-vs-wants',
    duration: '2:15',
    likes: 1324,
    views: 5876,
    tags: ['basics', 'spending', 'decisions'],
    forAgeGroups: [6, 7, 8, 9, 10]
  },
  {
    id: 'v8',
    title: 'How Banks Work',
    description: 'What do banks do with your money? Learn how banks keep your money safe.',
    thumbnailUrl: 'https://via.placeholder.com/400x600.png?text=How+Banks+Work',
    videoUrl: 'https://example.com/videos/banks-explained',
    duration: '3:30',
    likes: 763,
    views: 3421,
    tags: ['banks', 'saving', 'intermediate'],
    forAgeGroups: [8, 9, 10, 11, 12]
  }
];

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
    xp: 175, // Some initial XP
    completedQuizzes: ['q1', 'q2'], // Already completed two quizzes
    accounts: {
      spending: {
        id: 'acc1',
        balance: 7.32,
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
    xp: 0, // No initial XP
    completedQuizzes: [], // No completed quizzes
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
    purchasePrice: 7.23,
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

// Function to get investments by child ID
export const getInvestmentsByChildId = (childId: string): Investment[] => {
  // Check if child has investments in their account
  const child = children.find(c => c.id === childId);
  if (child?.accounts.investing?.investments) {
    return child.accounts.investing.investments;
  }
  // If not, check the mock investments
  return mockInvestments.filter(investment => investment.childId === childId);
};

// Function to get videos
export const getFinanceVideos = () => {
  return financeVideos;
};

// Function to get video by ID
export const getFinanceVideoById = (videoId: string): FinanceVideo | undefined => {
  return financeVideos.find(video => video.id === videoId);
};

// Function to get videos by age group
export const getFinanceVideosByAge = (age: number): FinanceVideo[] => {
  return financeVideos.filter(video => video.forAgeGroups.includes(age));
};

// Quiz related interfaces
export interface Quiz {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  questions: QuizQuestion[];
  category: 'saving' | 'spending' | 'investing' | 'budgeting' | 'general';
  forAgeGroups: number[]; // E.g., [8, 9, 10, 11, 12] for quizzes suitable for ages 8-12
  imageUrl?: string;
  completionTime: string; // Estimated time to complete, e.g., "5 min"
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number; // Index of the correct option (0-based)
  explanation: string; // Explanation of the correct answer
}

// Mock quiz data
export const quizzes: Quiz[] = [
  {
    id: 'q1',
    title: 'Money Basics',
    description: 'Learn the basics of money and test your knowledge!',
    difficulty: 'easy',
    xpReward: 50,
    category: 'general',
    forAgeGroups: [6, 7, 8, 9, 10],
    imageUrl: 'https://via.placeholder.com/400x600.png?text=Money+Basics',
    completionTime: '5 min',
    questions: [
      {
        id: 'q1-1',
        question: 'What is money used for?',
        options: [
          'To buy things we need and want',
          'Only for playing games',
          'Only for adults to use',
          'To make paper airplanes'
        ],
        correctOption: 0,
        explanation: 'Money is a tool we use to buy things we need (like food) and things we want (like toys).'
      },
      {
        id: 'q1-2',
        question: 'What should you do when you receive money as a gift?',
        options: [
          'Spend it all right away',
          'Thank the person and consider saving some of it',
          'Give it all to someone else',
          'Hide it under your bed'
        ],
        correctOption: 1,
        explanation: 'It\'s always good to thank someone for a gift, and saving some of your money is a smart habit.'
      },
      {
        id: 'q1-3',
        question: 'Which of these is NOT a place to keep your money safe?',
        options: [
          'A bank',
          'A piggy bank at home',
          'A savings account',
          'In your pocket on the playground'
        ],
        correctOption: 3,
        explanation: 'Money in your pocket while playing could easily fall out and get lost.'
      }
    ]
  },
  {
    id: 'q2',
    title: 'Saving Smart',
    description: 'Test your knowledge about saving money!',
    difficulty: 'medium',
    xpReward: 75,
    category: 'saving',
    forAgeGroups: [8, 9, 10, 11, 12],
    imageUrl: 'https://via.placeholder.com/400x600.png?text=Saving+Smart',
    completionTime: '7 min',
    questions: [
      {
        id: 'q2-1',
        question: 'Why is it important to save money?',
        options: [
          'So you can buy everything you see',
          'So you have money for future needs and goals',
          'Because parents say so',
          'To make your wallet heavier'
        ],
        correctOption: 1,
        explanation: 'Saving helps you prepare for the future and achieve your financial goals, like buying something special.'
      },
      {
        id: 'q2-2',
        question: 'What is a savings goal?',
        options: [
          'A game you play with money',
          'Something specific you want to save money for',
          'A type of bank account',
          'Money you give to others'
        ],
        correctOption: 1,
        explanation: 'A savings goal is something specific you want to buy or do in the future, and you\'re saving money to make it happen.'
      },
      {
        id: 'q2-3',
        question: 'If you save $5 every week, how much will you have after 4 weeks?',
        options: [
          '$15',
          '$20',
          '$25',
          '$10'
        ],
        correctOption: 1,
        explanation: '$5 x 4 weeks = $20. Saving regularly adds up over time!'
      },
      {
        id: 'q2-4',
        question: 'What does "interest" mean when talking about a savings account?',
        options: [
          'How much you like your money',
          'Extra money the bank gives you for keeping your savings with them',
          'A fee you pay to the bank',
          'Money you lose over time'
        ],
        correctOption: 1,
        explanation: 'Interest is extra money a bank pays you as a reward for keeping your money in a savings account.'
      }
    ]
  },
  {
    id: 'q3',
    title: 'Smart Spending',
    description: 'Learn how to make good decisions when spending money!',
    difficulty: 'medium',
    xpReward: 75,
    category: 'spending',
    forAgeGroups: [9, 10, 11, 12, 13],
    imageUrl: 'https://via.placeholder.com/400x600.png?text=Smart+Spending',
    completionTime: '6 min',
    questions: [
      {
        id: 'q3-1',
        question: 'What is the difference between a "need" and a "want"?',
        options: [
          'They are the same thing',
          'Needs are things you must have to live, wants are things that are nice to have',
          'Wants are more important than needs',
          'Needs are only for adults'
        ],
        correctOption: 1,
        explanation: 'Needs are things you must have to live (like food, water, shelter), while wants are things that are nice to have but not necessary (like toys or games).'
      },
      {
        id: 'q3-2',
        question: 'What should you do before buying something expensive?',
        options: [
          'Buy it right away before someone else does',
          'Think about it, compare prices, and make sure you really want it',
          'Ask your friends to buy it for you',
          'Borrow money from someone else to buy it'
        ],
        correctOption: 1,
        explanation: 'It\'s smart to think carefully before spending a lot of money. Compare prices and make sure it\'s something you really want or need.'
      },
      {
        id: 'q3-3',
        question: 'If something is on sale or discounted, it means:',
        options: [
          'It costs more than usual',
          'It costs less than the normal price',
          'It\'s broken or damaged',
          'You have to buy more than one'
        ],
        correctOption: 1,
        explanation: 'A sale or discount means the item costs less than its normal price, which can be a good opportunity to save money.'
      }
    ]
  },
  {
    id: 'q4',
    title: 'Investing Basics',
    description: 'Learn about how money can grow through investing!',
    difficulty: 'hard',
    xpReward: 100,
    category: 'investing',
    forAgeGroups: [11, 12, 13, 14, 15],
    imageUrl: 'https://via.placeholder.com/400x600.png?text=Investing+Basics',
    completionTime: '8 min',
    questions: [
      {
        id: 'q4-1',
        question: 'What is investing?',
        options: [
          'Spending all your money right away',
          'Putting money into something that might grow in value over time',
          'Hiding your money so nobody can find it',
          'Borrowing money from others'
        ],
        correctOption: 1,
        explanation: 'Investing means putting your money into something (like stocks or a business) with the hope that it will grow in value over time.'
      },
      {
        id: 'q4-2',
        question: 'What is a stock?',
        options: [
          'A type of money only used in stores',
          'A small piece of ownership in a company',
          'A special kind of bank account',
          'A loan you give to friends'
        ],
        correctOption: 1,
        explanation: 'When you buy a stock, you\'re buying a small piece of ownership in a company. If the company does well, your stock may become more valuable.'
      },
      {
        id: 'q4-3',
        question: 'Why is it important to invest money for a long time instead of a short time?',
        options: [
          'Because it\'s more fun to wait',
          'It doesn\'t matter how long you invest',
          'Long-term investing gives your money more time to grow and can help handle ups and downs in the market',
          'Because banks require it'
        ],
        correctOption: 2,
        explanation: 'Investing for longer periods gives your money more time to grow and helps smooth out the ups and downs that happen in the short term.'
      },
      {
        id: 'q4-4',
        question: 'What is risk when talking about investing?',
        options: [
          'The chance that you might gain or lose money',
          'A type of bank account',
          'The cost of buying stocks',
          'A guarantee that you\'ll make money'
        ],
        correctOption: 0,
        explanation: 'Risk refers to the possibility that an investment might not perform as expected, which could mean making less money than you hoped or even losing some money.'
      }
    ]
  },
  {
    id: 'q5',
    title: 'Money Superhero Challenge!',
    description: 'Save the day by solving money mysteries and becoming a Financial Superhero!',
    difficulty: 'easy',
    xpReward: 120,
    category: 'general',
    forAgeGroups: [8, 9, 10, 11, 12, 13, 14, 15],
    imageUrl: 'https://via.placeholder.com/400x600.png?text=Money+Superhero',
    completionTime: '10 min',
    questions: [
      {
        id: 'q5-1',
        question: "SUPERHERO SCENARIO: Oh no! Your friend spent all their allowance on candy and now can't buy the movie ticket they wanted. What money superpower would have helped them?",
        options: [
          'Invisibility Power',
          'Super Speed',
          'Budget Planning Power',
          'Mind Reading'
        ],
        correctOption: 2,
        explanation: "Budget Planning Power helps you decide in advance how to spend your money wisely so you don't run out before buying things that are important to you!"
      },
      {
        id: 'q5-2',
        question: "MONEY MYSTERY: The Case of the Disappearing Dollars! You got $20 for your birthday but it's quickly vanishing. What's the best superhero strategy to solve this mystery?",
        options: [
          'Hide the money under your pillow',
          'Keep track of what you spend in a Money Journal',
          'Spend it all immediately before it disappears',
          'Blame your little brother or sister'
        ],
        correctOption: 1,
        explanation: "Every superhero knows that tracking your spending in a Money Journal gives you the power to see exactly where your money goes!"
      },
      {
        id: 'q5-3',
        question: "SUPERHERO CHALLENGE: You've discovered two identical toys, but one costs $15 and the other costs $10. What money superpower should you use?",
        options: [
          'Super Strength to take both',
          'Teleportation to avoid the decision',
          'Comparison Shopping Power',
          'X-ray vision'
        ],
        correctOption: 2,
        explanation: "Comparison Shopping Power helps you find the best deal! Why pay more for the same thing? That's how money superheroes save their dollars for other things they want!"
      },
      {
        id: 'q5-4',
        question: 'SUPER VILLAIN ALERT! "Impulse Buyer" is trying to trick you into spending all your money on things you don\'t need! Which superhero defense works best?',
        options: [
          'The "Wait-A-Day" Shield - wait 24 hours before buying something expensive',
          'The Invisible Cloak - hide from the villain',
          'Super Scream - yell until your parents buy it for you',
          'Money Doubling Ray - just make more money appear'
        ],
        correctOption: 0,
        explanation: "The \"Wait-A-Day\" Shield gives you time to think about whether you really need something or if you're just excited in the moment. Many wants feel less important after waiting!"
      },
      {
        id: 'q5-5',
        question: "SUPERHERO TEAM-UP! You and your friend both want to buy an expensive game. What's the best teamwork strategy?",
        options: [
          'Rock-Paper-Scissors to decide who buys it',
          'Save money together and share the game',
          'Ask your parents to buy two games',
          'Decide to buy different games instead'
        ],
        correctOption: 1,
        explanation: "Money Superheroes know the power of teamwork! By pooling your money and sharing the game, you both get to play while spending less. That's financial teamwork!"
      }
    ]
  }
];

// Helper function to get quizzes
export const getQuizzes = (): Quiz[] => {
  return quizzes;
};

// Get quizzes suitable for a child's age
export const getQuizzesByAge = (age: number): Quiz[] => {
  return quizzes.filter(quiz => quiz.forAgeGroups.includes(age));
};

// Get a specific quiz by ID
export const getQuizById = (quizId: string): Quiz | undefined => {
  return quizzes.find(quiz => quiz.id === quizId);
};

// Function to add XP to a child's account
export const addChildXP = (childId: string, xpAmount: number): Child | undefined => {
  const child = getChildById(childId);
  if (child) {
    child.xp += xpAmount;
    return child;
  }
  return undefined;
};

// Function to mark a quiz as completed by a child
export const completeQuiz = (childId: string, quizId: string): boolean => {
  const child = getChildById(childId);
  if (child && !child.completedQuizzes.includes(quizId)) {
    child.completedQuizzes.push(quizId);
    return true;
  }
  return false;
}; 