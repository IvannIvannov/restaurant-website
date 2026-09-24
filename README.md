# RESTAURANT Website

A modern bilingual restaurant website built with **Next.js, TypeScript, Supabase and Vercel**.

The project demonstrates a complete restaurant booking experience with authentication, customer profiles, reservation management and an admin dashboard.

---

## Live Demo

**Production:**  
https://restaurant-website-mu-mauve.vercel.app

---

## Project Overview

This project is a full-stack restaurant website created as a portfolio project.

It includes:

- bilingual support
- responsive design
- online reservations
- authentication
- editable customer profiles
- reservation history
- reservation cancellation
- admin reservation management
- Supabase database integration
- Row Level Security
- password recovery flow
- SEO configuration
- Vercel deployment

The branding, contact information and menu content are demo placeholders and are not connected to a real restaurant.

---

## Main Features

### Customer Experience

Users can:

- create an account
- log in securely
- manage their profile
- select reservation date and time
- choose number of guests
- choose a preferred seating area
- enter contact details
- review reservation details before submitting
- view upcoming reservations
- check reservation status
- cancel eligible reservations
- log out

---

### Reservation Flow

The reservation process is divided into clear steps:

1. Select a date
2. Select guest count
3. Select a time
4. Select seating preference
5. Enter contact information
6. Review reservation details
7. Confirm reservation

Reservation data is stored in Supabase and connected to the authenticated user.

---

## Customer Account

The customer dashboard includes:

- full name
- email
- phone number
- account role
- editable profile information
- upcoming reservations
- reservation status
- reservation cancellation
- quick access to create a new reservation

Profile changes are saved directly in Supabase.

---

## Admin Dashboard

Administrators can:

- view all reservations
- filter reservations by status
- see guest contact details
- see reservation notes
- confirm reservations
- cancel reservations
- mark reservations as completed

Admin access is controlled through the `role` field in the Supabase `profiles` table.

---

## Reservation Statuses

The reservation system supports the following statuses:

```text
pending
confirmed
cancelled
completed
```

---

## Seating Preferences

Customers can choose between:

```text
inside
outside
none
```

`none` represents no seating preference.

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- React Day Picker
- date-fns

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Row Level Security
- SQL Functions
- SQL Triggers

### Deployment

- Vercel
- GitHub

### Development Tools

- Visual Studio Code
- GitHub Desktop
- npm
- Next.js development server

---

## Authentication

Authentication is handled with Supabase Auth.

Supported functionality includes:

- Sign up
- Log in
- Log out
- Protected customer pages
- Protected admin functionality
- Password recovery flow
- Session-based authentication

For the current portfolio/demo version, email confirmation is disabled.

Custom SMTP can be connected later when a production domain is available.

---

## Password Recovery

The application includes a complete password recovery flow.

The flow is:

```text
Login
↓
Forgot Password
↓
Recovery Email
↓
Supabase Callback
↓
Reset Password
↓
Login
```

Relevant routes:

```text
/[locale]/forgot-password
/[locale]/reset-password
/auth/callback
```

The recovery flow is ready in the application.

Production email delivery can be enabled later through a custom SMTP provider.

---

## Database Structure

### `profiles`

Stores additional information for authenticated users.

Fields:

```text
id
full_name
phone
role
created_at
updated_at
```

Available roles:

```text
customer
admin
```

The `id` is connected to the corresponding Supabase Auth user.

---

### `reservations`

Stores restaurant reservations.

Fields:

```text
id
user_id
reservation_date
reservation_time
guests
seating_preference
guest_name
phone
email
note
status
created_at
updated_at
```

---

## Database Logic

The project uses database-side logic for safer and more consistent behavior.

Included functionality:

- automatic profile creation after registration
- automatic `updated_at` handling
- admin role verification
- secure reservation cancellation
- authenticated reservation creation
- Row Level Security policies

---

## Profile Creation

When a new user registers through Supabase Auth, a corresponding row is automatically created in the `profiles` table.

The profile stores additional information such as:

```text
full_name
phone
role
```

New users receive the default role:

```text
customer
```

---

## Security

Security is handled primarily through Supabase Row Level Security.

Customers can only:

- view their own profile
- update allowed profile fields
- view their own reservations
- create reservations connected to their own account
- cancel their own eligible reservations

Administrators can:

- view all reservations
- update reservation statuses

Sensitive values are not stored directly in the repository.

---

## Row Level Security

RLS is enabled for:

```text
profiles
reservations
```

The application uses policies that restrict access based on the currently authenticated user's ID.

---

## Profile Security

Users are only allowed to update:

```text
full_name
phone
```

They cannot update sensitive fields such as:

```text
role
id
created_at
updated_at
```

This prevents users from manually changing their account role to `admin`.

---

## Reservation Security

Users can create reservations only for their own authenticated account.

Reservation creation checks:

```text
auth.uid() = user_id
```

Customers cannot freely update reservation statuses.

Reservation cancellation is handled through a dedicated secure database function.

---

## Admin Security

Admin access is validated through the user's `role` in the `profiles` table.

The database includes a secure function that checks whether the currently authenticated user has the role:

```text
admin
```

Admin permissions are enforced by Supabase policies and not only by the frontend.

---

## Environment Variables

Create a `.env.local` file in the root directory.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Do not commit `.env.local`.

A safe `.env.example` file can be included in the repository:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

---

## Environment Security

The project does not expose:

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SECRET_KEY
database password
```

Only the Supabase publishable configuration is used in the browser.

Security is enforced through Supabase Row Level Security.

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/IvannIvannov/restaurant-website.git
```

Enter the project directory:

```bash
cd restaurant-website
```

Install dependencies:

```bash
npm install
```

Create a local environment file:

```text
.env.local
```

Add the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Start the development server:

```bash
npm run dev
```

Open the application:

```text
http://localhost:3000
```

---

## Production Build

To test the production build locally:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

## Deployment

The project is deployed with Vercel.

Production URL:

```text
https://restaurant-website-mu-mauve.vercel.app
```

The GitHub repository is connected to Vercel.

New pushes to the production branch can automatically trigger a new deployment.

---

## Vercel Environment Variables

The following environment variables are configured in Vercel:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

These variables are required for the deployed application to communicate with Supabase.

---

## Supabase URL Configuration

The production site URL is configured in Supabase Auth.

```text
https://restaurant-website-mu-mauve.vercel.app
```

Allowed authentication callback URLs include:

```text
http://localhost:3000/auth/callback
https://restaurant-website-mu-mauve.vercel.app/auth/callback
```

This allows authentication flows to work in both local development and production.

---

## Main Routes

```text
/
├── /bg
├── /en
├── /bg/menu
├── /en/menu
├── /bg/reservations
├── /en/reservations
├── /bg/register
├── /en/register
├── /bg/login
├── /en/login
├── /bg/account
├── /en/account
├── /bg/admin
├── /en/admin
├── /bg/forgot-password
├── /en/forgot-password
├── /bg/reset-password
├── /en/reset-password
└── /auth/callback
```

---

## Internationalization

The website supports two languages:

```text
Bulgarian
English
```

Localized routes:

```text
/bg
/en
```

The interface includes localized:

- navigation
- reservation flow
- authentication pages
- account dashboard
- admin dashboard
- contact section
- event section
- footer
- metadata

---

## Responsive Design

The application is optimized for:

- desktop
- tablet
- mobile

The homepage includes a dedicated responsive navigation system.

On smaller screens, the desktop navigation is replaced with a mobile menu.

---

## Mobile Navigation

The mobile navigation includes:

- Menu
- Events
- Contact
- Login / Account
- Reservations
- Bulgarian / English language switcher

The mobile menu automatically closes after navigation.

---

## Menu

The website includes a demo restaurant menu.

The menu content is intentionally generic and created for portfolio purposes.

It is not copied from a real restaurant.

---

## Events Section

The homepage contains a demo events section presenting examples such as:

- special evenings
- private events
- group reservations

This section can later be connected to a CMS or database if required.

---

## Contact Section

The website includes a contact section with demo information.

It contains:

- address
- opening hours
- phone
- email
- reservation button

All contact information currently displayed is placeholder content.

---

## Footer

The footer includes:

- brand information
- navigation links
- account links
- registration link
- language switcher
- portfolio demo notice

---

## SEO

The project includes technical SEO configuration.

Included:

- localized metadata
- page titles
- meta descriptions
- Open Graph metadata
- Twitter metadata
- canonical URLs
- alternate language URLs
- sitemap
- robots.txt
- favicon

---

## Sitemap

The sitemap is generated automatically through Next.js.

Available at:

```text
/sitemap.xml
```

Production:

```text
https://restaurant-website-mu-mauve.vercel.app/sitemap.xml
```

The sitemap contains public pages such as:

```text
/bg
/en
/bg/menu
/en/menu
/bg/reservations
/en/reservations
```

Private authentication and account pages are intentionally excluded.

---

## Robots.txt

The project includes a generated `robots.txt`.

Available at:

```text
/robots.txt
```

Production:

```text
https://restaurant-website-mu-mauve.vercel.app/robots.txt
```

It allows public indexing and references the sitemap.

---

## Favicon

The application includes a custom favicon using the visual identity of the demo restaurant website.

The favicon is stored as:

```text
app/icon.svg
```

Next.js automatically uses this file as the site icon.

---

## Project Structure

A simplified version of the project structure:

```text
restaurant-website
│
├── app
│   ├── auth
│   │   └── callback
│   │       └── route.ts
│   │
│   ├── [locale]
│   │   ├── account
│   │   ├── admin
│   │   ├── forgot-password
│   │   ├── login
│   │   ├── menu
│   │   ├── register
│   │   ├── reservations
│   │   ├── reset-password
│   │   │
│   │   ├── HomeHeader.tsx
│   │   ├── auth.module.css
│   │   ├── home-header.module.css
│   │   ├── home-sections.module.css
│   │   ├── layout.tsx
│   │   ├── page.module.css
│   │   └── page.tsx
│   │
│   ├── icon.svg
│   ├── layout.tsx
│   ├── page.tsx
│   ├── robots.ts
│   └── sitemap.ts
│
├── lib
│   └── supabase
│       ├── client.ts
│       └── server.ts
│
├── messages
│   ├── bg.json
│   └── en.json
│
├── public
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Supabase Client

The project uses separate Supabase clients for browser and server environments.

```text
lib/supabase/client.ts
lib/supabase/server.ts
```

The browser client is used for client-side authentication and database operations.

The server client is used inside server components and authentication-related server routes.

---

## Reservation Form

The reservation interface includes:

- custom date picker
- past-date restrictions
- guest number controls
- manual guest number input
- half-hour time intervals
- seating preference buttons
- customer details
- optional notes
- reservation summary
- final confirmation step

Available reservation times currently range from:

```text
11:00
to
22:30
```

in 30-minute intervals.

---

## Customer Data Autofill

When a logged-in customer creates a reservation, available profile information is automatically loaded.

The reservation form can prefill:

```text
full_name
phone
email
```

This reduces repeated data entry.

---

## Profile Editing

Customers can edit their personal profile.

Editable fields:

```text
full_name
phone
```

Changes are saved to the Supabase `profiles` table.

The updated values are then available for future reservations.

---

## Reservation Cancellation

Customers can cancel reservations with eligible statuses.

Eligible statuses include:

```text
pending
confirmed
```

Cancellation is performed through a secure database function.

Customers cannot cancel another user's reservation.

---

## Reservation Management

Administrators can change reservation status between:

```text
pending
confirmed
cancelled
completed
```

The customer account reflects the updated reservation status.

---

## Admin Filters

The admin dashboard includes filters for:

```text
all
pending
confirmed
cancelled
completed
```

This makes reservation management easier for restaurant staff.

---

## Demo Data

This project uses demo content for portfolio presentation.

Demo content includes:

- restaurant branding
- menu items
- event descriptions
- contact information
- restaurant address
- phone number
- email address

No real customer or restaurant data should be committed to the repository.

---

## GitHub Safety

The repository should never contain:

```text
.env.local
.env
Supabase secret keys
Supabase service role keys
database passwords
real customer data
private credentials
```

Safe repository content includes:

```text
.env.example
source code
demo data
public configuration names
CSS
TypeScript
JSON translation files
documentation
```

---

## Email Configuration

The application currently uses Supabase authentication.

For the portfolio/demo environment:

```text
Confirm email: disabled
Custom SMTP: not enabled
```

For a real production environment, the recommended setup is:

1. Register a custom domain
2. Add the domain to an email provider
3. Verify DNS records
4. Configure custom SMTP in Supabase
5. Enable email confirmation
6. Test registration confirmation
7. Test password recovery
8. Configure branded email templates

---

## Future Email Setup

A future production sender could use an address such as:

```text
noreply@yourdomain.com
```

Possible email flows:

- signup confirmation
- password reset
- email address change
- reservation confirmation
- reservation cancellation
- admin notifications

---

## Future Improvements

Possible future improvements include:

- production SMTP
- email confirmation
- custom production domain
- branded email templates
- reservation confirmation emails
- reservation cancellation emails
- admin email notifications
- restaurant availability management
- table assignment
- blocked reservation dates
- opening-day restrictions
- maximum reservations per time slot
- dashboard analytics
- customer reservation history
- image optimization
- social sharing preview image
- custom Open Graph image
- Privacy Policy
- Terms and Conditions
- GDPR consent flow
- cookie consent
- real restaurant branding
- CMS integration

---

## Portfolio Note

This project is a portfolio/demo restaurant website.

It is designed to demonstrate practical full-stack development skills including:

- frontend development
- responsive UI
- authentication
- database integration
- authorization
- security
- multilingual interfaces
- deployment
- SEO
- reservation workflows
- administrative tools

The project is not currently connected to a real restaurant business.

---

## Skills Demonstrated

This project demonstrates experience with:

- React architecture
- Next.js App Router
- TypeScript
- client components
- server components
- dynamic routes
- multilingual routing
- Supabase authentication
- PostgreSQL
- database security
- Row Level Security
- SQL functions
- SQL triggers
- responsive design
- CSS Modules
- form management
- authentication flows
- role-based access
- deployment workflows
- environment variables
- Git and GitHub
- Vercel
- technical SEO

---

## Author

Portfolio project created as a full-stack restaurant reservation website.

---

## License

This project is intended for portfolio and educational purposes.

Demo branding, content and contact information are placeholders.
