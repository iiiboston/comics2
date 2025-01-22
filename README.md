# AI Image Generator

A Next.js application that generates images using the Replicate AI API and the Falcon model.

## Features

- Image generation from text prompts
- Real-time loading states
- Error handling
- Responsive design
- Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Replicate API key

## Setup

1. Clone the repository:
```bash
git clone [your-repo-url]
cd comics2
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Replicate API key:
```
REPLICATE_API_TOKEN=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `REPLICATE_API_TOKEN` - Your Replicate API key

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Replicate API

## License

MIT
