const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const TEST_USERS = [
  {
    user_id: 1,
    email: 'admin@leap.com',
    password_hash: '$2a$12$mEiv1hXWJg.YIbeQ/AO8B.k1h9r6k9mTPPtPMsHhlOhhgKDkLipLC',
    role: 'admin',
    first_name: 'Admin',
    last_name: 'User'
  },
  {
    user_id: 2,
    email: 'student@leap.com',
    password_hash: '$2a$12$OKR9HTPOXAeqSsmTXc.Z9.2oZzV3bc/jBPfETaMdXYwxBFShFu9zm',
    role: 'student',
    first_name: 'John',
    last_name: 'Doe'
  },
  {
    user_id: 3,
    email: 'instructor@leap.com',
    password_hash: '$2a$12$sl5Mb3m0K1QU6ZKS2zHmHOaZ3AhUP7sGwj/t.PkNZ3XZyVigCUa4a',
    role: 'instructor',
    first_name: 'Jane',
    last_name: 'Smith'
  },

  {
  user_id: 4,
  email: 'admin@leap.com',
  password_hash: '$2a$12$mEiv1hXWJg.YIbeQ/AO8B.k1h9r6k9mTPPtPMsHhlOhhgKDkLipLC',
  role: 'admin',
  first_name: 'Admin',
  last_name: 'User'
  }
];

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME || '12h' }
  );
};

const register = async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;
  if (!email || !password || !first_name || !last_name || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  res.status(201).json({
    message: 'Registration disabled for testing - use login instead',
    user: { email, role }
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const user = TEST_USERS.find(u => u.email === email);
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