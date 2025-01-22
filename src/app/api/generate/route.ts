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

    let reqBody;
    try {
      reqBody = await req.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { prompt = "A cute dog named Djeny" } = reqBody;
    console.log('Generating image for prompt:', prompt);

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    try {
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

      console.log('Created prediction:', prediction);
      
      const result = await replicate.wait(prediction);
      console.log('Prediction result:', result);

      if (result.error) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      if (!result.output || !Array.isArray(result.output) || result.output.length === 0) {
        return NextResponse.json(
          { error: "No image was generated" },
          { status: 500 }
        );
      }

      return NextResponse.json({ result: result.output[0] });
      
    } catch (replicateError: unknown) {
      console.error('Replicate API error:', replicateError);
      const err = replicateError as ErrorWithMessage;
      return NextResponse.json(
        { error: err.message || "Failed to generate image with Replicate" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const err = error as ErrorWithMessage;
    if (err.message?.includes('401')) {
      return NextResponse.json(
        { error: "Invalid API token. Please check your configuration." },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: err.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
