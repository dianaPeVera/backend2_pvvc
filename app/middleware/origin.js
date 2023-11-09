const checkOrigin = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      const token = authorizationHeader.split(' ').pop();

      if (token === '123456') {
          next();
          // TODO: Origin
          // console.log(req.headers);
      } else {
          res.status(409);
          res.send({ error: "Tu por aqui no pasas!" });
      }
  } else {
      res.status(401); // Unauthorized
      res.send({ error: "Falta el encabezado de autorización" });
  }
}

module.exports = checkOrigin;


/*
const jwt = require('./jsonWebToken');

const checkOrigin = (req, res, next) => {
  const token = req.headers.authorization.split(' ').pop();

  try {
    const decodedToken = jwt.verify(token, 'tu_secreto_secreto');
    // Si el token es válido, puedes acceder a la información decodificada en decodedToken
    // Puedes incluir lógica adicional para verificar si el usuario tiene los permisos necesarios, etc.
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

module.exports = checkOrigin;
*/
