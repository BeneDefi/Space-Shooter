# Overview

This is a mobile-first space shooter game called "Galaxiga" inspired by classic arcade games like Galaga and Space Invaders. Built with React, TypeScript, and HTML5 Canvas, the game features a player spaceship that battles waves of alien enemies in a space environment. The application uses a fullstack architecture with an Express.js backend and React frontend, optimized specifically for medium and small screen mobile devices.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **Styling**: Tailwind CSS with Radix UI components for consistent, responsive design
- **Game Engine**: Custom HTML5 Canvas-based game engine with object-oriented design
- **State Management**: Zustand stores for game state, audio management, and UI state
- **Mobile-First Design**: Optimized for touch controls and small screens with responsive layouts

## Game Engine Components
- **GameEngine**: Main game loop handling updates, rendering, and collision detection
- **Player**: Spaceship controlled by touch or keyboard input with smooth interpolation
- **Enemy**: AI-controlled alien ships with oscillating movement patterns
- **Bullet**: Projectile system supporting both player and enemy bullets
- **Particle**: Visual effects system for explosions and impacts
- **CollisionSystem**: Handles all collision detection between game objects

## State Management Pattern
- **useGameState**: Manages game phases (ready, playing, ended), score, lives, and level progression
- **useAudio**: Controls background music, sound effects, and mute functionality
- **Reactive Updates**: Game state changes trigger UI updates automatically

## Input System
- **Touch Controls**: Full-screen touch area for mobile movement with smooth position interpolation
- **Keyboard Support**: Arrow keys and WASD for desktop play
- **Custom Events**: Touch input dispatches custom events to game engine for consistent handling

## Backend Architecture
- **Server**: Express.js with TypeScript serving both API and static files
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Session Management**: In-memory storage for development with extensible storage interface
- **Development Setup**: Vite middleware integration for hot reloading

## Build System
- **Development**: Vite dev server with React Hot Reload and error overlay
- **Production**: Vite builds frontend to static files, esbuild bundles backend
- **Asset Pipeline**: Support for GLTF/GLB models, audio files, and GLSL shaders (Three.js ready)

# External Dependencies

## Core Dependencies
- **React Ecosystem**: React 18, React DOM for UI rendering and component architecture
- **Vite**: Modern build tool with fast HMR and optimized production builds
- **TypeScript**: Type safety and improved developer experience
- **Tailwind CSS**: Utility-first CSS framework for responsive mobile design

## UI Component Library
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives including dialogs, buttons, cards, and form controls
- **Lucide React**: Icon library for consistent iconography

## Backend Dependencies
- **Express.js**: Web framework for API routes and static file serving
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect
- **Neon Database**: Serverless PostgreSQL database for scalable data storage

## Game Development
- **Canvas 2D API**: Native HTML5 Canvas for high-performance game rendering
- **Web Audio API**: Browser audio management for sound effects and background music
- **Custom Game Engine**: No external game framework dependencies for maximum control

## Development Tools
- **tsx**: TypeScript execution for development server
- **esbuild**: Fast JavaScript bundler for production backend builds
- **PostCSS**: CSS processing with Tailwind CSS integration

## Database Connection
- **@neondatabase/serverless**: Serverless PostgreSQL client for edge computing compatibility
- **Environment Variables**: DATABASE_URL for connection configuration