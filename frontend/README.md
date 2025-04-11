# MuneemJee - Accounting PWA

A Progressive Web Application (PWA) for small teams to manage expense invoices, track payments, reconcile statements, and generate a double-entry accounting daybook.

## Features

- User authentication and authorization
- Invoice management (upload, scan, email)
- OCR processing for invoice data extraction
- Transaction recording and management
- Statement reconciliation
- Double-entry accounting daybook
- PWA capabilities (offline access, installable)

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- MongoDB (via API routes)
- AWS S3 for file storage
- AWS Textract for OCR

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Deployment

This application is deployed as a unified project on Vercel, with both frontend and API functionality.

## Environment Variables

Required environment variables:

```
# AWS
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
NEXT_PUBLIC_AWS_REGION=
NEXT_PUBLIC_AWS_S3_BUCKET=

# Authentication
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# MongoDB
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_EXPIRATION=
``` 