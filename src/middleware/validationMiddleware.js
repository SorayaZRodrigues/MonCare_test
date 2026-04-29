// Basic required field validator to keep controllers beginner-friendly.
function validateRequiredFields(fields) {
  return (req, res, next) => {
    const missingFields = fields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: 'Campos obrigatórios ausentes',
        missingFields
      });
    }

    return next();
  };
}

module.exports = { validateRequiredFields };
