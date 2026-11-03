# 11 - Deployment Guide

## Environments

Development

Testing

Production

## Required Environment Variables

DATABASE_URL

JWT_SECRET

PORT

CLIENT_URL

NODE_ENV

## Backend

-   Build TypeScript
-   Run migrations
-   Seed roles and permissions
-   Start server

## Frontend

-   Build production bundle
-   Configure API base URL
-   Deploy static assets

## Recommended Stack

Frontend - Vercel or Netlify

Backend - Render / Railway / VPS

Database - PostgreSQL

## Security

-   HTTPS
-   Strong JWT secret
-   Helmet
-   CORS
-   Rate limiting
-   Environment validation

## Logging

Use Pino

Log: - Authentication failures - Access approvals - Revocations - Errors

## Backup Strategy

Daily PostgreSQL backup

Weekly restore verification

## Production Checklist

-   Environment variables configured
-   Migrations executed
-   Seed data loaded
-   Health endpoint verified
-   Logs monitored
-   README updated

## Future CI/CD

GitHub Actions - Lint - Test - Build - Deploy
