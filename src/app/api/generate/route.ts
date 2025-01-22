import { NextResponse } from 'next/server';
import Replicate from 'replicate';

export async function POST(req: Request) {
  if (!process.env.REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "API token not configured" },
      { status: 401 }
    );
  }

  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const output = await replicate.run(
      "sundai-club/falcon:4ad44069012e217c2507981a15d71e9a16a67e256bb2dd37cb5b8d91cb790dc9",
      {
        input: {
          prompt,
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

    if (!output || (Array.isArray(output) && output.length === 0)) {
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: 500 }
      );
    }

    const imageUrl = Array.isArray(output) ? output[0] : output;
    return NextResponse.json({ result: imageUrl });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
