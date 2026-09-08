// Temporary in-memory data
let users = [
    { id: 1, name: "John Doe", email: "john@example.com", course: "MERN" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", course: "React" }
];

// Helper function to generate unique IDs
const generateId = () => {
    return users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
};

// Helper function to validate email
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Get all users (Supports search by name, email, course AND course filter)
exports.getUsers = (req, res) => {
    const { search, course } = req.query;
    let filteredUsers = [...users];

    // Search by name, email, or course
    if (search) {
        const searchLower = search.toLowerCase();
        filteredUsers = filteredUsers.filter(user => 
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower) ||
            user.course.toLowerCase().includes(searchLower)
        );
    }

    // Filter by specific course
    if (course) {
        filteredUsers = filteredUsers.filter(user => 
            user.course.toLowerCase() === course.toLowerCase()
        );
    }

    return res.json(filteredUsers);
};

// Get single user
exports.getUserById = (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

// Create user (Trim inputs, validate email format)
exports.createUser = (req, res) => {
    // Trim inputs
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const course = req.body.course?.trim();

    if (!name || !email || !course) return res.status(400).json({ message: "Name, email, and course are required" });
    
    // Validate email format
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
    
    // Check duplicate email
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) return res.status(400).json({ message: "This email already exists" });
    
    // Use safer ID generation
    const newUser = { id: generateId(), name, email, course };
    users.push(newUser);
    res.status(201).json(newUser);
};

// Update user (Trim inputs, validate email)
exports.updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    // Trim inputs
    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const course = req.body.course?.trim();
    
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) return res.status(404).json({ message: "User not found" });
    if (!name || !email || !course) return res.status(400).json({ message: "Name, email, and course are required" });

    // Validate email
    if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
    
    // Check duplicate email
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== id);
    if (existingUser) return res.status(400).json({ message: "This email already exists" });

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