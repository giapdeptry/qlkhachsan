const required = (name) => {
  const val = process.env[name];
  if (val === undefined || val === null || String(val).trim() === '') {
    throw new Error(`[ENV] Missing required environment variable: ${name}`);
  }
  return val;
};

const getNumber = (name, { defaultValue } = {}) => {
  const val = process.env[name];
  if (val === undefined || val === null || String(val).trim() === '') {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`[ENV] Missing required environment variable: ${name}`);
  }
  const num = Number(val);
  if (Number.isNaN(num)) throw new Error(`[ENV] Invalid number for ${name}: ${val}`);
  return num;
};

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  URL_CLIENT: required('URL_CLIENT'),

  // DB
  MONGO_URI: process.env.MONGO_URI,
  CONNECT_DB: required('CONNECT_DB'),

  // Optional but frequently needed
  // You can add more required vars as you integrate more services.


  // Security
  SECRET_CRYPTO: required('SECRET_CRYPTO'),

  // Payments / Integrations (some may be unused in some flows)
  GROQ_API_KEY: required('GROQ_API_KEY'),
  // Add other required vars here if you want strict validation everywhere.

  // Server
  PORT: getNumber('PORT', { defaultValue: 3001 }),
};

module.exports = env;

