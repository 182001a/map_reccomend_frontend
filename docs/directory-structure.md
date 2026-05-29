# Directory Structure

This project keeps `App.tsx` as the application entry point and places feature code under `src`.

```text
src/
  components/
    layout/     App-wide and screen layout components
    ui/         Reusable small UI components, when needed
  constants/    Shared constants and message definitions
  dao/          API clients, request functions, and persistence access
  hooks/        Stateful reusable logic
  navigation/   Route and navigator definitions, when navigation is introduced
  screens/      Screen-level React components
  types/        Shared TypeScript types
  utils/        Stateless utility functions
```

Current implementation intentionally creates only directories that contain code. Add new directories from the structure above when the corresponding responsibility is introduced.
