import { NextResponse } from 'next/server';
import Replicate from 'replicate';

type ErrorWithMessage = {
  message?: string;
};

export async function POST(req: Request) {
  try {
    // Check if API token exists
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not set');
      return NextResponse.json(
        { error: "API token not configured" },
        { status: 401 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const { prompt = "A cute dog named Djeny" } = await req.json();
    console.log('Generating image for prompt:', prompt);

    try {
      const output = await replicate.run(
        "sundai-club/falcon:4ad44069012e217c2507981a15d71e9a16a67e256bb2dd37cb5b8d91cb790dc9",
        {
          input: {
            prompt: prompt,
            model: "dev",
            go_fast: false,
            lora_scale: 1,
            megapixels: "1",
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            guidance_scale: 3,
            output_quality: 80,
            prompt_strength: 0.8,
            extra_lora_scale: 1,
            num_inference_steps: 28
          }
        }
      );

      console.log('Replicate output:', output);

      if (!output || (Array.isArray(output) && output.length === 0)) {
        return NextResponse.json(
          { error: "No image was generated" },
          { status: 500 }
        );
      }

      const imageUrl = Array.isArray(output) ? output[0] : output;
      return NextResponse.json({ result: imageUrl });
      
    } catch (replicateError: unknown) {
      console.error('Replicate API error:', replicateError);
      return NextResponse.json(
        { error: "Failed to generate image with Replicate" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const err = error as ErrorWithMessage;
    // Check if it's an authentication error
    if (err.message?.includes('401')) {
      return NextResponse.json(
        { error: "Invalid API token. Please check your configuration." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
