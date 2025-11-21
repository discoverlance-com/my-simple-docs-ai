# My Simple AI Docs

**My Simple AI Docs** is a modern web application that lets you upload documents (PDFs) and ask AI-powered questions about their content. Powered by Google Gemini and built with React, TanStack Router, and Tailwind CSS, it provides a seamless, document-grounded Q&A experience.

---

## Features

- **AI Document Q&A:** Upload a PDF and interact with an AI assistant that answers questions strictly based on your document.
- **File Upload:** Securely upload PDF files; files are processed and stored using Google Gemini.
- **Chat Interface:** User-friendly chat UI for asking questions and viewing AI responses.
- **SPA Routing:** Fast, file-based navigation using TanStack Router.
- **Modern UI:** Built with React, Tailwind CSS, and Radix UI for accessibility and style.
- **Error Handling:** Robust error boundaries and notifications for a smooth user experience.
- **File Management:** Option to purge stored files from the AI backend.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Installation

```bash
npm install
```

### Running the App (Development)

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run serve
```

---

## Usage

1. **Upload a PDF Document:**  
   Use the dropzone on the homepage to upload your PDF file.

2. **Ask Questions:**  
   Once uploaded, use the chat interface to ask questions about the document. The AI will answer using only the document’s content.

3. **Purge Files:**  
   Use the "Purge Already Stored Files" button to delete all files stored in the AI backend.

---

## Environment Variables

Create a `.env` file and add your Google Gemini API key:

```
GEMINI_API_KEY=your_google_gemini_api_key
AI_NAME=Your AI Name (optional)
```

---

## Project Structure

- `src/routes/` — Application routes (pages, API endpoints, chat interface)
- `src/components/` — Reusable UI components
- `src/lib/` — Utility functions and AI query logic
- `public/` — Static assets (icons, manifest, etc.)

---

## Technologies Used

- **React 19**
- **TanStack Router** (file-based routing)
- **Google Gemini AI** (document Q&A)
- **Tailwind CSS** (styling)
- **Radix UI** (accessible UI primitives)
- **Sonner** (toast notifications)
- **Vite** (build tool)
- **Zod** (validation)
- **Vitest** (testing)

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## License

MIT

---

## Acknowledgements

- [TanStack](https://tanstack.com/)
- [Google Gemini](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
```
