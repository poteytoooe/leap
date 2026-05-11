const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_PATH = path.join(__dirname, '../mock-db.json');

const loadDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error loading database:', err);
    return { users: [] };
  }
};

const saveDB = (db) => {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving database:', err);
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || '12h' }
  );
};

const register = async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;
  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const db = loadDB();
    
    // Check if user already exists
    if (db.users.some(u => u.email === email)) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = {
      user_id: Math.max(...db.users.map(u => u.user_id), 0) + 1,
      email,
      first_name,
      last_name,
      password_hash,
      role,
      is_active: 1,
      date_joined: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        role: newUser.role,
        first_name: newUser.first_name,
        last_name: newUser.last_name
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const db = loadDB();
    const user = db.users.find(u => u.email === email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, login };