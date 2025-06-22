import { NextResponse } from 'next/server';
import Replicate from "replicate";
import axios from 'axios';
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { storage } from "../../../configs/FirebaseConfig";
import { v4 as uuidv4 } from 'uuid';

const ConvertImageToBase64 = async (imageUrl) => {
  try {
    const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    return Buffer.from(resp.data, 'binary').toString('base64');
  } catch(e) {
    console.error('Failed to convert image to base64:', e);
    throw new Error('Could not convert image to base64');
  }
}

export async function POST(req) {
  try {
    const { prompts } = await req.json();

    if (!prompts || !Array.isArray(prompts) || prompts.length === 0) {
      return NextResponse.json({ error: 'Prompts are required and must be a non-empty array' }, { status: 400 });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    const predictionPromises = prompts.map(prompt => 
      replicate.predictions.create({
        version: "bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe",
        input: {
          prompt: prompt,
          height: 1024,
          width: 1024,
          num_outputs: 1,
        },
      })
    );

    const predictions = await Promise.all(predictionPromises);

    const pollInterval = 1500;
    const timeout = 60000;

    const waitPromises = predictions.map(async (prediction) => {
      let currentPrediction = prediction;
      let elapsedTime = 0;
      while (currentPrediction.status !== "succeeded" && currentPrediction.status !== "failed" && elapsedTime < timeout) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        currentPrediction = await replicate.predictions.get(currentPrediction.id);
        elapsedTime += pollInterval;
      }
      if (currentPrediction.status !== 'succeeded' || !currentPrediction.output) {
        throw new Error(`Failed to generate image for one of the prompts. Status: ${currentPrediction.status}`);
      }
      return currentPrediction.output[0];
    });

    const imageUrls = await Promise.all(waitPromises);
    
    const uploadPromises = imageUrls.map(async (url) => {
      const base64Data = await ConvertImageToBase64(url);
      const base64Image = `data:image/png;base64,${base64Data}`;
      const fileName = `ai-short-video-files/${Date.now()}.png`;
      
      const storageRef = ref(storage, fileName);
      
      await uploadString(storageRef, base64Image, 'data_url');
      
      const downloadUrl = await getDownloadURL(storageRef);
      console.log('Image uploaded to Firebase:', downloadUrl);
      return downloadUrl;
    });

    const uploadedUrls = await Promise.all(uploadPromises);
    
    return NextResponse.json({ result: uploadedUrls });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'An error occurred during image generation.', details: error.message },
      { status: 500 }
    );
  }
}

