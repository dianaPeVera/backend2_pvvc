const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    // Otros datos que quieras incluir en el token
  };

  const options = {
    expiresIn: '1h', // Tiempo de expiración del token
  };

  return jwt.sign(payload, 'tu_secreto_secreto', options);
};
