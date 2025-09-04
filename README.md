# Versa – AI-Powered Legal Document Transformation

Versa is a frontend-first SaaS platform for intelligent document parsing and transformation. It integrates multiple AI providers and is built with a focus on security, modularity, and maintainable system design.

---

## Features
- React + Next.js frontend with client-side PDF parsing (PDF.js).  
- API key management with AES-256 encryption.  
- Integration with multiple AI providers (OpenAI, Anthropic, Google AI).  
- Abstraction and fallback handling across AI providers.  
- Error handling, retry logic, and request validation on the backend.  
- Usage tracking and logging for user activity.  

---

## System Architecture
The system is structured into four layers: Client, API, Processing Core, and Persistence. This separation provides clarity of responsibility and supports future scalability.

![System Architecture](https://drive.google.com/uc?id=1UDwmaFDc5aWQW-l5TZzFnaF2n_cUExod)

---

## Technology Stack
- **Frontend**: React, Next.js, PDF.js, Framer Motion  
- **Backend**: Node.js, Supabase, Prisma  
- **Database**: PostgreSQL  
- **AI Providers**: OpenAI, Anthropic, Google AI  

---

## Getting Started
```bash
# Clone repository
git clone https://github.com/your-username/versa.git

# Install dependencies
npm install

# Run locally
npm run dev
