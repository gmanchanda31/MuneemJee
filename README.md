# Accounting PWA

A Progressive Web Application for small teams to manage expense invoices, track payments, reconcile statements, and generate a double-entry accounting daybook.

## Project Structure

```
accounting-pwa/
├── frontend/          # Next.js PWA frontend
├── backend/           # NestJS backend API
└── README.md
```

## Technology Stack

### Frontend
- Next.js
- TypeScript
- shadcn/ui (Radix UI + Tailwind CSS)
- Workbox (PWA capabilities)

### Backend
- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- AWS Services (S3, Textract, SES)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- pnpm (v8 or higher)
- PostgreSQL
- AWS Account (for S3, Textract, SES)

### Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   pnpm install

   # Install backend dependencies
   cd ../backend
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Configure the necessary environment variables

4. Start development servers:
   ```bash
   # Start frontend (from frontend directory)
   pnpm dev

   # Start backend (from backend directory)
   pnpm start:dev
   ```

## Features

- User authentication and authorization
- Invoice management (upload, scan, email)
- OCR processing for invoice data extraction
- Transaction recording and management
- Statement reconciliation
- Double-entry accounting daybook
- PWA capabilities (offline access, installable)

## License

MIT 
