# GRC SaaS Platform

A comprehensive Governance, Risk Management, and Compliance (GRC) SaaS application built with modern technologies to streamline compliance work, automate evidence collection, and centralize risk and vendor management.

## 🚀 Features

### Compliance Management
- **Control Mapping**: Map common controls to various compliance requirements
- **Control Crosswalks**: Map controls across multiple frameworks for reuse
- **Automated Evidence Collection**: "Hypersyncs" integration with third-party services
- **Control Testing**: Automated and manual control effectiveness testing
- **Compliance Dashboards**: Real-time compliance status and metrics

### Risk Management
- **Risk Register**: Centralized repository for risk tracking
- **Risk Assessment**: Likelihood, impact, and risk scoring
- **Risk Treatment**: Mitigation strategies and action plans
- **Control-Risk Mapping**: Link controls to risks for continuous monitoring
- **Historical Analysis**: Track risk changes over time

### Vendor Management
- **Vendor Repository**: Centralized vendor information and documents
- **Security Questionnaires**: Automated tailored questionnaires
- **Risk Assessment**: Vendor risk level evaluation
- **Contract Management**: Track renewals and key dates
- **Vendor Dashboard**: Exportable status and risk summaries

### Audit Management
- **Audit Preparation**: Centralize audit work and evidence
- **Auditor Collaboration**: Dedicated auditor access with limited permissions
- **Audit Tracking**: Progress monitoring and request management
- **Evidence Management**: Reuse existing controls and evidence

### Task Management
- **Integration**: Connect with Jira, Asana, and ServiceNow
- **Issue Tracking**: Link tasks to risks and controls
- **Workflow Management**: Automated task creation and escalation
- **Progress Monitoring**: Real-time task status and completion tracking

### User Access Reviews
- **Automated Reviews**: Streamlined user access review processes
- **Real-time Visibility**: Live access status monitoring
- **Alert System**: Notifications for required adjustments

## 🛠 Technology Stack

### Frontend
- **TypeScript**: Type-safe JavaScript development
- **React 18**: Modern React with hooks and concurrent features
- **Emotion**: CSS-in-JS styling with dynamic capabilities
- **Chart.js**: Interactive data visualizations
- **React Query**: Server state management and caching
- **React Router**: Client-side routing
- **Vite**: Fast build tool and development server

### Backend
- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe server development
- **Express.js**: Web application framework
- **MariaDB**: Relational database
- **Knex.js**: SQL query builder and migrations
- **JWT**: Authentication and authorization
- **Winston**: Logging framework
- **Helmet**: Security middleware

### Development Tools
- **ESLint**: Code linting
- **Jest**: Testing framework
- **Nodemon**: Development server auto-restart
- **Concurrently**: Run multiple commands simultaneously

## 📁 Project Structure

```
grc-saas/
├── src/
│   ├── client/                 # Frontend React application
│   │   ├── components/         # React components
│   │   │   ├── Auth/          # Authentication components
│   │   │   ├── Compliance/    # Compliance management
│   │   │   ├── Risk/          # Risk management
│   │   │   ├── Vendor/        # Vendor management
│   │   │   ├── Audit/         # Audit management
│   │   │   ├── Task/          # Task management
│   │   │   ├── Dashboard/     # Dashboard and analytics
│   │   │   ├── Layout/        # Layout components
│   │   │   └── Settings/      # Application settings
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service functions
│   │   ├── App.tsx            # Main application component
│   │   ├── main.tsx           # Application entry point
│   │   └── index.css          # Global styles
│   ├── server/                # Backend Node.js application
│   │   ├── routes/            # API route handlers
│   │   │   ├── auth.ts        # Authentication routes
│   │   │   ├── users.ts       # User management
│   │   │   ├── compliance.ts  # Compliance endpoints
│   │   │   ├── risks.ts       # Risk management
│   │   │   ├── vendors.ts     # Vendor management
│   │   │   ├── audits.ts      # Audit management
│   │   │   ├── tasks.ts       # Task management
│   │   │   ├── dashboard.ts   # Dashboard data
│   │   │   └── integrations.ts # Third-party integrations
│   │   ├── middleware/        # Express middleware
│   │   │   ├── auth.ts        # Authentication middleware
│   │   │   └── errorHandler.ts # Error handling
│   │   ├── database/          # Database configuration
│   │   │   ├── connection.ts  # Database connection
│   │   │   ├── migrations/    # Database migrations
│   │   │   └── seeds/         # Database seed data
│   │   ├── utils/             # Utility functions
│   │   │   └── logger.ts      # Logging configuration
│   │   └── index.ts           # Server entry point
│   └── shared/                # Shared code between client and server
│       ├── types/             # TypeScript type definitions
│       └── utils/             # Shared utility functions
├── dist/                      # Built application files
├── logs/                      # Application logs
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tsconfig.server.json       # Server TypeScript configuration
├── vite.config.ts             # Vite configuration
├── index.html                 # HTML template
└── README.md                  # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MariaDB 10.6+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grc-saas
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure the following variables in `.env`:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=grc_user
   DB_PASSWORD=grc_password
   DB_NAME=grc_saas
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key
   
   # Server
   PORT=5000
   NODE_ENV=development
   
   # Frontend
   FRONTEND_URL=http://localhost:3000
   
   # Logging
   LOG_LEVEL=info
   ```

4. **Set up the database**
   ```bash
   # Create database
   mysql -u root -p -e "CREATE DATABASE grc_saas;"
   mysql -u root -p -e "CREATE USER 'grc_user'@'localhost' IDENTIFIED BY 'grc_password';"
   mysql -u root -p -e "GRANT ALL PRIVILEGES ON grc_saas.* TO 'grc_user'@'localhost';"
   
   # Run migrations
   npm run db:migrate
   
   # Seed database (development only)
   npm run db:seed
   ```

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run dev:server  # Backend on port 5000
   npm run dev:client  # Frontend on port 3000
   ```

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🔧 Configuration

### Database Migrations

Create a new migration:
```bash
npx knex migrate:make migration_name
```

Run migrations:
```bash
npm run db:migrate
```

Rollback migrations:
```bash
npm run db:rollback
```

### Environment Configuration

The application supports different environments:
- **Development**: Full logging, hot reload, debug tools
- **Production**: Optimized builds, error handling, security headers

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permission levels
- **Rate Limiting**: API request throttling
- **Helmet Security**: Security headers and protection
- **Input Validation**: Request data validation
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Cross-origin request handling

## 📊 Key Integrations

### Hypersyncs (Evidence Collection)
- Cloud provider APIs (AWS, Azure, GCP)
- Security tools (vulnerability scanners, SIEM)
- Infrastructure monitoring
- Configuration management tools

### Task Management
- **Jira**: Issue tracking and project management
- **Asana**: Team collaboration and task management
- **ServiceNow**: IT service management

### Notifications
- **Email**: SMTP integration for notifications
- **Slack**: Webhook integration for team alerts
- **Microsoft Teams**: Collaboration notifications

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Monitoring and Logging

- **Winston Logging**: Structured logging with multiple transports
- **Error Tracking**: Comprehensive error handling and reporting
- **Performance Monitoring**: Request timing and resource usage
- **Health Checks**: Application health endpoints

## 🚀 Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t grc-saas .

# Run with Docker Compose
docker-compose up -d
```

### Manual Deployment

1. Build the application
2. Set up production database
3. Configure environment variables
4. Start the server with PM2 or similar process manager

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📝 API Documentation

The API documentation is available at `/api/docs` when running the development server.

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/logout` - User logout

### Core Endpoints
- `/api/compliance/*` - Compliance management
- `/api/risks/*` - Risk management
- `/api/vendors/*` - Vendor management
- `/api/audits/*` - Audit management
- `/api/tasks/*` - Task management
- `/api/dashboard/*` - Dashboard data

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core GRC functionality
- ✅ Basic integrations
- ✅ User management
- ✅ Dashboard and reporting

### Phase 2 (Planned)
- [ ] Advanced analytics and AI insights
- [ ] Mobile application
- [ ] Advanced workflow automation
- [ ] Third-party marketplace integrations

### Phase 3 (Future)
- [ ] Multi-tenant architecture
- [ ] Advanced compliance frameworks
- [ ] Machine learning risk prediction
- [ ] Enterprise SSO integration

---

Built with ❤️ by the GRC Team