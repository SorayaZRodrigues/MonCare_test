const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger');

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const patientRoutes = require('./routes/patientRoutes');
const professionalRoutes = require('./routes/professionalRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Home Healthcare API is running' });
});

app.use('/auth', authRoutes);
app.use('/services', serviceRoutes);
app.use('/patients', patientRoutes);
app.use('/professionals', professionalRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/admin', adminRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// 404 handler for unknown routes.
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;
