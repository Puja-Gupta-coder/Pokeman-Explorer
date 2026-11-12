# Pokémon Explorer

Pokémon Explorer is a custom React project built for the final project stage. It uses the public PokeAPI to display Pokémon data, supports search and filtering, and includes a favorites feature using local storage.

Project pitch link: https://www.loom.com/share/b159fad43f404c1c97359feb062af961

## Features

- Search Pokémon by name
- Filter by type
- Display a reusable Pokémon card grid
- View a separate details page for each Pokémon
- Save favorites locally in the browser
- Graceful fallback to demo data when the live API is unavailable
- Responsive design for desktop and mobile layouts

## Tech stack

- React
- Vite
- React Router
- PokeAPI
- Oxlint

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deployment options

This project is ready to deploy to services such as:

- Vercel
- Netlify

Typical deployment steps:

1. Push the project to GitHub.
2. Import the repository into Vercel or Netlify.
3. Select the project root.
4. Deploy using the default Vite build settings.

## Project note

The app includes a mock fallback dataset so the UI remains fully usable in demo scenarios when the external API is unavailable. This helps maintain a complete user experience during instructor review.
