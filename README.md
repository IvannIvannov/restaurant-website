# Restaurant Website

A modern bilingual restaurant website built with Next.js, TypeScript, Supabase, and a fully responsive custom UI.

The project includes an interactive menu, reservation system, authentication, user accounts, admin reservation management, localization, SEO, accessibility improvements, and production deployment.

---

## Live Demo

https://restaurant-website-mu-mauve.vercel.app

---

## Features

- Bilingual interface in Bulgarian and English
- Responsive design for desktop, tablet, and mobile
- Interactive restaurant menu with page-flip experience
- Reservation system with:
  - date selection
  - time selection
  - guest count
  - seating preference
  - contact information
  - notes
- User registration and login
- Password reset flow
- User account area
- Reservation history and management
- Reservation cancellation
- Admin reservation management
- Reservation status updates
- Supabase authentication
- Supabase database with Row Level Security
- Custom modal system
- Lazy-loaded modal components for improved performance
- Accessibility improvements
- Reduced motion support
- Custom loading, error, and 404 states
- SEO metadata
- Open Graph preview
- Sitemap
- robots.txt
- Production deployment with Vercel

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- CSS Modules
- Motion
- React Day Picker
- date-fns
- Lucide React

### Backend & Database

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security
- Database functions and triggers

### Additional Tools

- Cloudinary
- Vercel
- GitHub
- GitHub Desktop

---

## Main Pages

- Home
- Menu
- Reservations
- Login
- Registration
- Account
- Admin
- Forgot Password
- Reset Password
- Custom 404 Page

Both Bulgarian and English versions are available through localized routes:

```text
/bg
/en
```

---

## Reservation System

The reservation flow allows users to choose:

- reservation date
- available time
- number of guests
- preferred seating area
- contact details
- optional reservation notes

Reservations are stored in Supabase and can be managed from both the user's account and the admin dashboard.

---

## Authentication

The project includes:

- email and password registration
- login
- logout
- password reset
- protected account access
- admin access control

Authentication is handled through Supabase.

---

## User Account

Authenticated users can:

- view their profile
- edit personal information
- view reservations
- check reservation status
- cancel eligible reservations
- create a new reservation

---

## Admin Dashboard

Administrators can:

- view all reservations
- filter reservations by status
- confirm reservations
- cancel reservations
- mark reservations as completed
- review guest and reservation information

---

## Interactive Menu

The menu uses a page-flip interface to create a digital restaurant menu experience.

Features include:

- desktop and mobile layouts
- page navigation
- zoomed menu pages
- menu modal access
- responsive controls
- optimized image delivery

---

## Localization

The website supports:

- Bulgarian
- English

Navigation, authentication, reservations, account pages, system states, and accessibility labels are localized.

---

## Accessibility

Accessibility improvements include:

- keyboard navigation
- focus management
- accessible modal dialogs
- ARIA labels
- improved color contrast
- reduced motion support
- semantic navigation structure

---

## Performance

The project was optimized through:

- dynamic loading of heavy modal components
- reduced initial JavaScript loading
- lazy loading
- production build optimization
- responsive asset handling

The deployed website achieved strong Lighthouse results across:

- Performance
- Accessibility
- Best Practices
- SEO

---

## SEO

Implemented SEO features include:

- page metadata
- localized metadata
- Open Graph image
- sitemap.xml
- robots.txt
- structured page titles and descriptions

---

## Environment Variables

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit `.env.local` or private credentials to GitHub.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev -- --webpack
```

Open:

```text
http://localhost:3000
```

---

## Production Build

Run:

```bash
npm run build
```

Then:

```bash
npm start
```

---

## Project Structure

```text
app/
├── [locale]/
│   ├── account/
│   ├── admin/
│   ├── forgot-password/
│   ├── login/
│   ├── menu/
│   ├── register/
│   ├── reservations/
│   ├── reset-password/
│   └── ...
├── auth/
├── error.tsx
├── loading.tsx
├── not-found.tsx
└── ...

lib/
├── supabase/
└── ...

messages/
├── bg.json
└── en.json

public/
└── images/
```

---

## Deployment

The project is deployed with Vercel.

Production URL:

```text
https://restaurant-website-mu-mauve.vercel.app
```

---

## Project Purpose

This project was developed as a portfolio project demonstrating a complete restaurant website experience with both frontend and backend functionality.

It combines:

- UI/UX design
- frontend development
- authentication
- database integration
- reservation management
- localization
- accessibility
- performance optimization
- production deployment

---

## Author

Developed by Ivan Ivanov.
