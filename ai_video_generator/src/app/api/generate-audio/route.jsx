import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import fs from 'fs';
import util from 'util';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../configs/FirebaseConfig";

// Create client with API key authentication
const client = new TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
});

export async function POST(req) {
    try {
        const { text, id } = await req.json();
        
        console.log('Received text:', text);
        console.log('Received id:', id);
        
        // Check if we have the API key
        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json({
                error: 'Google Cloud API key not configured. Please set GOOGLE_API_KEY in your environment variables.',
                message: 'Audio generation requires Google Cloud Text-to-Speech API key'
            }, { status: 500 });
        }
        const storageRef=ref(storage,'ai-short-video-files/'+id+'.mp3')
        const request = {
          input: { text },
          voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
          audioConfig: { audioEncoding: 'MP3' },
        };
        
        const [response] = await client.synthesizeSpeech(request);
        
        const audioBuffer=Buffer.from(response.audioContent,'binary');

        await uploadBytes(storageRef,audioBuffer,{contentType:'audio/mp3'})

        const downloadUrl=await getDownloadURL(storageRef);
        console.log('Audio content written to file: output.mp3', downloadUrl);
        
        return NextResponse.json({Result:downloadUrl});
    } catch (error) {
        console.error('Text-to-Speech API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

  