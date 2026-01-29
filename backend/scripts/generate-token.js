const jwt = require('jsonwebtoken');

const userId = process.argv[2];
const expiresIn = process.argv[3] || '7d';
const secret = process.env.JWT_SECRET;

if (!userId) {
  console.error('Usage: node scripts/generate-token.js <userId> [expiresIn]');
  process.exit(1);
}

if (!secret) {
  console.error('JWT_SECRET is not set');
  process.exit(1);
}

const token = jwt.sign({ sub: userId }, secret, { expiresIn });
console.log(token);
