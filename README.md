# 💸 Expense Splitter

A simple and responsive **React + TypeScript** application for splitting expenses between people, calculating balances, and showing who should pay whom.

---

## ✨ Features

- 👥 Add, edit, and delete people
- 💰 Add, edit, and delete expenses
- ➗ Equal expense splitting
- 🎯 Exact amount splitting
- 📊 Automatic balance calculation
- 🤝 Settlement suggestions
- 💾 Local storage persistence
- 📱 Responsive interface
- ✅ Input validation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | User interface |
| TypeScript | Type-safe JavaScript |
| Vite | Development and build tool |
| CSS | Styling and responsive layout |
| Local Storage | Browser data persistence |

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/dinukezara/expense-splitter.git
```

### 2. Go to the project directory

```bash
cd expense-splitter
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the URL displayed by Vite in your browser.

Usually:

```text
http://localhost:5173
```

---

## 📦 Build for Production

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 💡 How to Use

1. Add at least two people.
2. Enter an expense description.
3. Enter the expense amount.
4. Select who paid for the expense.
5. Select the people who should share the expense.
6. Choose **Equal Split** or **Exact Amount**.
7. Add the expense.
8. Check the calculated balances.
9. Check **Settle Up** to see who should pay whom.

---

## ➗ Equal Split Example

Suppose there are three people:

- Alice
- Bob
- Charlie

Alice pays:

```text
LKR 3,000
```

and the expense is split equally between all three.

Each person's share is:

```text
LKR 3,000 / 3 = LKR 1,000
```

The balances become:

```text
Alice    + LKR 2,000
Bob      - LKR 1,000
Charlie  - LKR 1,000
```

The settlement suggestions are:

```text
Bob     → Alice    LKR 1,000
Charlie → Alice    LKR 1,000
```

---

## 🎯 Exact Split

The application also supports exact amount splitting.

For example, for an expense of:

```text
LKR 5,000
```

you can specify:

```text
Alice    LKR 2,000
Bob      LKR 1,500
Charlie  LKR 1,500
```

The application validates that the exact amounts equal the total expense.

---

## 📊 Balance Calculation

The application automatically calculates each person's balance.

A positive balance means the person should receive money.

```text
+ LKR 2,000
```

A negative balance means the person owes money.

```text
- LKR 1,000
```

A zero balance means the person is completely settled.

---

## 🤝 Settle Up

The **Settle Up** feature converts balances into simple payment suggestions.

For example:

```text
Bob pays Alice LKR 1,000
Charlie pays Alice LKR 1,000
```

This makes it easier for everyone to settle their expenses.

---

## 💾 Local Storage

The application stores people and expenses using browser **Local Storage**.

This means your data remains available after:

- Refreshing the page
- Closing and reopening the browser tab
- Restarting the development server

No backend or database is required for the current version.

---

## ✏️ Editing and Deleting

### People

Users can:

- Add people
- Rename people
- Delete unused people

A person who is already referenced by an expense cannot be deleted until the related expense is removed.

### Expenses

Users can:

- Add expenses
- Edit existing expenses
- Delete expenses

Balances and settlement suggestions automatically update when expenses change.

---

## ✅ Validation

The application includes validation for:

- Empty descriptions
- Invalid expense amounts
- Negative amounts
- Missing payer
- Missing participants
- Invalid exact split amounts
- Exact splits that do not equal the expense total
- Duplicate people
- Deleting people referenced by existing expenses

---

## 📁 Project Structure

```text
expense-splitter/
│
├── src/
│   ├── components/
│   │   ├── Balances.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── PeopleSection.tsx
│   │   └── Settlements.tsx
│   │
│   ├── hooks/
│   │   └── useLocalStorage.ts
│   │
│   ├── utils/
│   │   ├── balances.ts
│   │   ├── money.ts
│   │   ├── settlements.ts
│   │   └── split.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── types.ts
│
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🧠 Main Concepts

This project demonstrates several important React and TypeScript concepts:

- React functional components
- React state management
- React hooks
- Custom React hooks
- TypeScript types
- Component props
- Form handling
- Input validation
- Array operations
- Expense calculation algorithms
- Local Storage
- Responsive CSS
- Reusable utility functions

---

## 🔧 Available Commands

Start development:

```bash
npm run dev
```

Create production build:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

---

## 🌟 Future Improvements

Possible future improvements include:

- User authentication
- Multiple expense groups
- Shared groups between users
- Cloud database
- Expense categories
- Expense history
- Export reports
- Dark mode
- Real-time synchronization

---

## 👤 Author

**Dinuka**

GitHub: [@dinukezara](https://github.com/dinukezara)

---

## 📄 License

This project was created for educational and portfolio purposes.

---

⭐ **Expense Splitter** — Split expenses, calculate balances, and settle up easily.
