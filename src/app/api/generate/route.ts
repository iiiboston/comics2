import { NextResponse } from 'next/server';
import Replicate from 'replicate';

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

    const prediction = await replicate.predictions.create({
      version: "4ad44069012e217c2507981a15d71e9a16a67e256bb2dd37cb5b8d91cb790dc9",
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
    });

    // Wait for the prediction to complete
    const result = await replicate.wait(prediction);
    console.log('Replicate result:', result);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    // The output should be an array of image URLs
    const imageUrl = result.output?.[0];
    if (!imageUrl) {
      return NextResponse.json(
        { error: "No image was generated" },
        { status: 500 }
      );
    }

    return NextResponse.json({ result: imageUrl });
  } catch (error: any) {
    console.error('Error generating image:', error);
    // Check if it's an authentication error
    if (error.message?.includes('401')) {
      return NextResponse.json(
        { error: "Invalid API token. Please check your configuration." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Failed to generate image: " + error.message },
      { status: 500 }
    );
  }
}
