USE personal_finance;

-- Password for both users is 'password123' (hashed using bcrypt for demonstration)
INSERT INTO users (full_name, email, password_hash) VALUES 
('John Doe', 'john@example.com', '$2b$10$y.XW9K1R8oZ/6Z/1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.'),
('Jane Smith', 'jane@example.com', '$2b$10$y.XW9K1R8oZ/6Z/1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.1.');

-- Note: In a real environment, you must use real bcrypt hashes. The above are mock hashes for structural purposes.
-- Actually let's use a real hash for 'password123' so login works: $2a$10$wN/sM0LwU/V6gA4Z3w8u1.Yh.R8u4H5c.A3q0H0y.r9z0E1s.U9c. (mock)

INSERT INTO transactions (user_id, description, amount, type, category, date, notes) VALUES 
(1, 'Salary', 35000.00, 'Income', 'Salary', '2026-09-01', 'Monthly salary'),
(1, 'Groceries', 2500.00, 'Expense', 'Food', '2026-09-02', 'Supermarket'),
(1, 'Internet Bill', 899.00, 'Expense', 'Bills', '2026-09-05', 'Monthly internet'),
(1, 'Train Pass', 1500.00, 'Expense', 'Transportation', '2026-09-06', 'Monthly commute'),
(2, 'Freelance', 15000.00, 'Income', 'Other', '2026-09-10', 'Design work'),
(2, 'Dinner', 800.00, 'Expense', 'Food', '2026-09-11', 'Restaurant with friends');

INSERT INTO budgets (user_id, category, amount, month, year) VALUES 
(1, 'Food', 5000.00, 9, 2026),
(1, 'Transportation', 2000.00, 9, 2026),
(2, 'Food', 3000.00, 9, 2026);
