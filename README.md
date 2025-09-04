# Versa – AI-Powered Legal Document Transformation

Versa is a platform designed to make complex legal documents more accessible without losing legal precision. Unlike traditional summarization tools that either oversimplify or remain inaccessible, Versa focuses on **context-preserving transformation** — adapting legal text into different levels of readability while maintaining accuracy.

### Problem Statement
Legal documents are inherently dense and difficult to interpret, creating barriers for individuals and businesses. Existing solutions either dilute critical legal nuance or remain unusable for non-experts.

### Engineering Solution
Versa implements an **AI-powered, multi-provider translation pipeline** that allows users to transform legal documents into clear, accessible formats. The platform ensures:  

- **Accuracy Preservation**: Legal meaning is retained across all transformations.  
- **Provider Abstraction**: Multiple AI providers (OpenAI, Anthropic, Google AI) are supported through a unified abstraction layer.  
- **Scalable Frontend-First Architecture**: Client-side parsing, secure backend orchestration, and real-time user feedback.  

### Core Engineering Highlights
- **Multi-Provider AI Abstraction**: Vendor-independent design for cost optimization, reliability, and feature flexibility.  
- **Dynamic Prompt System**: Modular templates for different transformation contexts (plain-language, child-friendly, structured JSON).  
- **Real-Time PDF Pipeline**: Hybrid client-server processing optimized for large documents.  
- **Security-First Key Management**: AES-256 encryption, rate limiting, and session-based authorization.  
- **User-Centric Frontend**: component-driven architecture with smooth real-time feedback and error handling.  

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

### Frontend
- **Frameworks**: Next.js 15, React 19, TypeScript 5  
- **UI & Styling**: Tailwind CSS, PostCSS, Autoprefixer, Framer Motion, heroicons
- **File Handling**: react-pdftotext (PDF parsing), react-dropzone (file uploads)  

### Backend
- **Runtime & API**: Node.js, Next.js API Routes  
- **Authentication & Security**: NextAuth.js, Prisma adapter, bcrypt, AES-256 encrypted API keys  
- **Database**: PostgreSQL with Prisma ORM  

### AI Integration
- **Providers**: OpenAI, Anthropic, Google AI, Mistral AI, Cohere  
- **Models**: GPT-4o, GPT-4o Mini, GPT-3.5 Turbo, Claude 3.5 Sonnet, Claude 3 Haiku, Gemini 1.5 Pro, Gemini 1.5 Flash, Mistral Large, Command R+  

### Architecture Highlights
- Component-driven frontend with reusable UI modules  
- Serverless API routes with input validation and rate limiting  
- Client-side PDF parsing for privacy and reduced server load  
- Multi-provider AI abstraction for vendor independence and reliability  
- Secure session-based authentication with JWT and encrypted key storage  

---

## Getting Started
```bash
# Clone repository
git clone https://github.com/aviroopjana/versa.git

# Install dependencies
npm install

# Run locally
npm run dev
