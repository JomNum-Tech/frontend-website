# JomNum Tech Website

A modern, responsive website for JomNum Tech, built with Next.js and TypeScript. This site showcases courses, instructors, and information about JomNum Tech, providing an engaging experience for prospective students and visitors. It also features an admin panel for managing users, roles, and storage.

## 🚀 Project Overview

JomNum Tech's website is designed to:
- Present detailed information about available courses
- Introduce instructors and the teaching methodology
- Provide contact and location details
- Answer frequently asked questions
- Allow users to get in touch via a contact form
- Enable administrators to manage users, roles, and storage

## 🛠️ Tech Stack
- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** CSS Modules
- **Package Manager:** npm (or yarn, pnpm, bun)
- **API:** Next.js Route Handlers (app/api)

## 📁 Project Structure

- `app/` - Next.js app directory (routing, pages)
  - `(root)/` - Public pages (about, contact, courses, profile, unauthorized, etc.)
  - `(admin)/admin/` - Admin panel (list-table, role-stats, storage, users)
  - `(auth)/` - Authentication (login, register, sign-in, sign-up)
  - `api/` - API routes for admin, storage, users, roles, etc.
  - `layout.tsx` - Main layout files for each section
- `components/` - Reusable UI and section components
  - `about/`, `contact/`, `course/`, `footer/`, `header/`, `homepage/`, `navbar/`, `ui/`, `admin/`, `animation/`, `banner/` - Organized by feature/section
- `hooks/` - Custom React hooks (admin role, storage, users, etc.)
- `lib/` - Utility functions and services (roleService, error handling, etc.)
- `types/` - TypeScript type definitions (admin, storage, users, etc.)
- `public/` - Static assets (images, icons)
- `styles/` - Global styles

## 🛡️ Features

### Admin Panel
- User management (view, filter, and manage users)
- Role management (assign, update, and view role stats)
- Storage management (file upload, file manager)
- Dashboard and statistics

### Authentication
- User registration and login
- Modal-based sign-in
- Protected routes for admin and profile

### Storage Management
- File upload and management for admin users
- API endpoints for file operations

### Courses & Content
- Course listing and detail pages
- About, contact, and FAQ sections

## 🏁 Getting Started

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd jomnumtech-website
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
yarn install
   # or
pnpm install
   # or
bun install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   # or
yarn dev
   # or
pnpm dev
   # or
bun dev
   ```
4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Commit and push (`git commit -m 'Add feature' && git push origin feature/your-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or feedback, please contact the JomNum Tech team at [jomnumtech@example.com] or open an issue in this repository.
