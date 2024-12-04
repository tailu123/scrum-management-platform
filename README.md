# Scrum Website

A modern Scrum and Agile Development website built with React and Node.js, following SOLID principles.

## Project Structure

```
scrum-website/
├── backend/
│   ├── routes/          # Route handlers (SRP: Each route handles specific resource)
│   ├── services/        # Business logic (SRP: Each service handles specific domain)
│   └── server.js        # Express application setup
├── frontend/
│   └── src/
│       ├── components/  # React components (SRP: Each component has a single responsibility)
│       ├── hooks/       # Custom hooks (SRP: Each hook handles specific functionality)
│       └── services/    # API services
└── package.json
```

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
- Each component, service, and route handles one specific aspect of the application
- Services are separated by domain (Sprints, Tasks, Users)
- Components are focused on specific UI elements and their interactions

### Open-Closed Principle (OCP)
- Services are designed to be extended without modification
- Component props allow for customization without changing the component
- Routes can be extended by adding new endpoints without modifying existing ones

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   ```

2. Start the backend server:
   ```bash
   npm run dev
   ```

3. Start the frontend development server:
   ```bash
   npm run client
   ```

## Adding New Features

To add new features while maintaining SOLID principles:

1. Create a new service in `backend/services/` for new business logic
2. Add new routes in `backend/routes/` for new endpoints
3. Create new React components in `frontend/src/components/`
4. Add new custom hooks in `frontend/src/hooks/` if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request
