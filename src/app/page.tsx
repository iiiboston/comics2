'use client';

import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setImage(null); // Clear previous image
      
      console.log('Sending request with prompt:', prompt);
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate image');
      }

      const data = await response.json();
      console.log('Received response:', data);

      if (data.error) {
        setError(data.error);
        return;
      }

      if (!data.result) {
        setError('No image URL received from the API');
        return;
      }

      setImage(data.result);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">AI Image Generator</h1>
        
        <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here... (e.g., 'A beautiful sunset over mountains')"
            className="w-full p-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          
          <button
            onClick={generateImage}
            disabled={loading || !prompt.trim()}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Image...
              </span>
            ) : (
              'Generate Image'
            )}
          </button>

          {error && (
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">Creating your masterpiece...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          )}

          {image && (
            <div className="mt-8">
              <img 
                src={image} 
                alt="Generated image" 
                className="w-full rounded-lg shadow-lg"
                onError={() => setError('Failed to load the generated image. Please try again.')}
              />
              <p className="mt-2 text-sm text-gray-500 text-center">
                Generated from prompt: "{prompt}"
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
