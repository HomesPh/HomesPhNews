# 🚀 CI/CD Pipeline Documentation

This document explains the multi-layered automation and security strategy implemented via GitHub Actions for **Laravel**, **TypeScript**, and **Python**.

## 🏗️ Pipeline Architecture

The pipeline is split into distinct jobs within our workflows, ensuring code quality, security, and stability across our entire tech stack.

### 1. 🧪 Test Execution
Automatically runs the test suites for all platforms.
- **Laravel (PHP)**: Uses `php artisan test` (PHPUnit) to validate backend logic.
- **TypeScript**: Uses `npm test` (Jest/Vitest) for frontend/logic testing.
- **Python**: Uses `pytest` for web crawler and data processing logic.
- **Outcome**: Ensures that no new changes break existing functionality.

### 2.  Code Quality & Linting
Ensures the codebase remains clean, readable, and consistent.
- **Laravel**: Uses **Laravel Pint** to enforce modern PHP coding standards.
- **TypeScript**: Uses **ESLint** for code quality and **Prettier** for formatting.
- **Python**: Uses **Ruff**, a lightning-fast linter to catch errors early.

### 3. 🛡️ Security Scanning
A multi-layered security suite that runs on every push and pull request.
- **Dependency Audits**: 
  - `composer audit` for Laravel packages.
  - `npm audit` for TypeScript/JavaScript libraries.
- **SAST (Static Application Security Testing)**: 
  - **CodeQL**: Performs deep data-flow analysis to find vulnerabilities like SQL injection or XSS across PHP, TypeScript, and Python.
- **Python Security**: Uses **Bandit** to scan for common security issues in Python code.

---

## ⚡ Smart Workflow Logic

### Branch Scalability
The pipeline is configured to detect and run on **all branches** (`**`). This ensures that every feature branch, hotfix, and main branch is held to the same high quality standards before merging.

### Automated Setup
The workflows handle the heavy lifting of environment setup:
- **PHP**: Installs extensions, copies `.env.example`, and generates application keys.
- **Node.js**: Automatically caches `npm` modules for faster run times.
- **Python**: Installs dependencies from `requirements.txt` and sets up the selected version.

---

## 🛠️ Requirements for Success
- **Laravel**: Ensure a `.env.example` exists for the CI to copy.
- **TypeScript**: Ensure `lint` and `test` scripts are defined in `package.json`.
- **Python**: Ensure `requirements.txt` is up to date for dependency installation.
