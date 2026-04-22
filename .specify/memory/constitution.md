<!--
Sync Impact Report
Version change: [0.0.0] -> 1.0.0
- Initialized constitution with centralized SOLID and Clean Architecture principles.
- Reinforced Differential Privacy and Semaphore System requirements as per spec-fidelity.md.
- Defined technical stack: Next.js 15+, Vanilla CSS, Zustand.
- Established mandatory traceability headers for all components.
Templates requiring updates:
- .specify/templates/plan-template.md (✅ aligned)
- .specify/templates/spec-template.md (✅ aligned)
- .specify/templates/tasks-template.md (✅ aligned)
-->

# SAE Constitution

## Core Principles

### I. SOLID Principles Integration
All frontend development must strictly adhere to the SOLID principles to ensure maintainability and testability.
- **Single Responsibility (SRP)**: Each component, hook, or service must have one reason to change.
- **Open/Closed (OCP)**: Entities should be open for extension but closed for modification.
- **Liskov Substitution (LSP)**: Subtypes must be substitutable for their base types.
- **Interface Segregation (ISP)**: No client should be forced to depend on methods it does not use.
- **Dependency Inversion (DIP)**: Depend on abstractions, not concretions.

### II. Clean Architecture Layers
The project structure is divided into well-defined layers to ensure a decoupled and testable system.
- **UI Layer (Components)**: Purely presentational elements that receive data and callbacks via props.
- **Presentation Layer (Hooks/State)**: Manages UI state, formatting, and interaction logic.
- **Domain Layer (Use Cases/Entities)**: Contains business logic and high-level rules, independent of frameworks.
- **Data Layer (API Services/Mocks)**: Handles external data fetching and mapping.

### III. Differential Privacy by Design (NON-NEGOTIABLE)
Privacy is a first-class citizen in SAE. The application must enforce absolute separation of sensitive data based on user roles.
- **Role-Based Sanitization**: Clinical data (diagnostics, medical conditions) must never exist in the DOM or state of the Tutor role.
- **Server-Driven Labels**: Transformation from clinical data to operational labels must happen exclusively on the server.
- **Mandatory Visual Indicators**: Any restricted field visible to a Tutor must include the lock icon (🔒).

### IV. Resilient AI State (Degraded Mode)
Components consuming AI Motor outputs must be designed to work without them.
- **Fallback UI**: If AI scores are unavailable, show operational labels or empty states gracefully.
- **No Raw Scores for Tutores**: Risk percentages are restricted. Tutores only see color-coded labels + icons.

### V. Universal Accessibility (WCAG 2.1 AA)
We build for all users, ensuring a premium and inclusive experience.
- **Multimodal Feedback**: States must be communicated through color, icons, and text simultaneously (Semaphore System).
- **Interactive Standards**: Touch targets must be at least 44x44px. All features must be keyboard-navigable.

## Additional Constraints

### Technology Stack
- **Framework**: Next.js 15+ (React 19).
- **Styling**: Vanilla CSS / CSS Modules for custom, premium aesthetics.
- **State Management**: Zustand for global state, React Context for feature-scoped state.
- **Data Fetching**: Typed services with full TypeScript interface contracts.

## Development Workflow

### Feature Implementation Cycle
Every Story must follow the standard cycle: Spec -> Design -> Implementation -> Validation.
- **Traceability**: All components must include headers referencing Epic, HU, UX, and QA requirements.
- **Manual Verification**: Peer review must verify privacy compliance and accessibility.

## Governance
This constitution is the supreme law of the SAE frontend.
- **Amendments**: Require a written justification and a version bump.
- **Compliance**: Continuous auditing via `/privacy-check` is mandatory.

**Version**: 1.0.0 | **Ratified**: 2026-04-21 | **Last Amended**: 2026-04-21
