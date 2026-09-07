// Temporary in-memory data
let users = [
    { id: 1, name: "John Doe", email: "john@example.com", course: "MERN" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", course: "React" }
];

// Get all users (with bonus search)
exports.getUsers = (req, res) => {
    const search = req.query.search;
    if (search) {
        const filteredUsers = users.filter(user => user.name.toLowerCase().includes(search.toLowerCase()));
        return res.json(filteredUsers);
    }
    res.json(users);
};

// Get single user
exports.getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

// Create user (WITH DUPLICATE EMAIL CHECK)
exports.createUser = (req, res) => {
    const { name, email, course } = req.body;
    if (!name || !email || !course) return res.status(400).json({ message: "Name, email, and course are required" });
    
    // CHECK IF EMAIL ALREADY EXISTS
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
        return res.status(400).json({ message: "This email already exists" });
    }
    
    const newUser = { id: users.length + 1, name, email, course };
    users.push(newUser);
    res.status(201).json(newUser);
};

// Update user (WITH DUPLICATE EMAIL CHECK)
exports.updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const { name, email, course } = req.body;
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });
    if (!name || !email || !course) return res.status(400).json({ message: "Name, email, and course are required" });
    
    // CHECK IF EMAIL ALREADY EXISTS (but not the same user's email)
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id);
    if (existingUser) {
        return res.status(400).json({ message: "This email already exists" });
    }

    users[userIndex] = { id, name, email, course };
    res.json(users[userIndex]);
};

// Delete user
exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });

    users.splice(userIndex, 1);
    res.json({ message: "User deleted successfully" });
};