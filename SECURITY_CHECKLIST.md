# Security Checklist

This document outlines the security checklist for the Theatre App.

## Authentication & Authorization (Clerk)
- [x] All API routes performing write operations (POST, PUT, PATCH, DELETE) are protected by `auth()` middleware.
- [ ] Role-based access control is implemented where necessary (e.g., admin roles).
- [ ] User privileges cannot be escalated.
- [ ] Users can only edit or delete their own data (e.g., ratings, comments).

## Database (MongoDB)
- [x] MongoDB connection string is stored in `.env.local` and not hardcoded.
- [ ] Database is not publicly accessible.
- [ ] All database queries are sanitized to prevent injection attacks.

## API Security
- [x] API keys (TMDB, Gemini) are stored in `.env.local` and not exposed on the client-side.
- [ ] Server-side validation is implemented for all user inputs.
- [ ] Rate limiting is implemented on sensitive endpoints to prevent abuse.

## General
- [x] No hardcoded secrets in the codebase.
- [ ] Environment variables are correctly configured on Vercel.
- [ ] Dependencies are regularly updated to patch security vulnerabilities.