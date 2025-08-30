# Security Checklist

This document outlines the security checklist for the Theatre App.

## Authentication & Authorization (Clerk)
- [x] All API routes performing write operations (POST, PUT, PATCH, DELETE) are protected by `auth()` middleware.
- [x] Role-based access control is implemented where necessary (e.g., admin roles).
- [x] User privileges cannot be escalated.
- [x] Users can only edit or delete their own data (e.g., ratings, comments).

## Database (MongoDB)
- [x] MongoDB connection string is stored in `.env.local` and not hardcoded.
- [x] Database is not publicly accessible.
- [x] All database queries are sanitized to prevent injection attacks.

## API Security
- [x] API keys (TMDB, Gemini) are stored in `.env.local` and not exposed on the client-side.
- [x] Server-side validation is implemented for all user inputs.
- [x] Rate limiting is implemented on sensitive endpoints to prevent abuse.

## General
- [x] No hardcoded secrets in the codebase.
- [x] Environment variables are correctly configured on Vercel.
- [x] Dependencies are regularly updated to patch security vulnerabilities.