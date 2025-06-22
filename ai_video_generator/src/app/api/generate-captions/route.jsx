import { AssemblyAI } from 'assemblyai'
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { audioFileUrl } = await req.json()
    
    if (!audioFileUrl) {
      return NextResponse.json({ error: 'Audio file URL is required' }, { status: 400 })
    }

    const client = new AssemblyAI({
      apiKey: process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY,
    })

    console.log('Starting transcription for:', audioFileUrl)

    const transcript = await client.transcripts.create({
      audio_url: audioFileUrl,
      speaker_labels: true,
      punctuate: true,
      format_text: true
    });

    if (transcript.status !== 'completed') {
        console.error('Transcription failed:', transcript)
        return NextResponse.json({ error: 'Transcription failed to complete.', status: transcript.status }, { status: 500 })
    }

    if (transcript.status === 'error') {
      console.error('Transcription error:', transcript.error)
      return NextResponse.json({ error: transcript.error }, { status: 500 })
    }

    let captions = [];
    if (transcript.words && transcript.words.length > 0) {
        captions = transcript.words.map(word => ({
            start: word.start,
            end: word.end,
            text: word.text,
            confidence: word.confidence,
            speaker: word.speaker || 'A'
        }));
    } else if (transcript.utterances && transcript.utterances.length > 0) {
        captions = transcript.utterances.map(utterance => ({
            start: utterance.start,
            end: utterance.end,
            text: utterance.text,
            speaker: utterance.speaker
        }));
    } else if (transcript.text) {
        // Fallback for cases where no utterances or words are available
        captions.push({
            start: 0,
            end: transcript.audio_duration || 0,
            text: transcript.text,
            speaker: 'A'
        });
    }

    console.log('Transcription completed successfully')
    
    return NextResponse.json({
      success: true,
      captions: captions,
      fullText: transcript.text,
      duration: transcript.audio_duration
    })

  } catch (error) {
    console.error('Captions generation error:', error)
    return NextResponse.json({ 
      error: 'Failed to generate captions',
      details: error.message 
    }, { status: 500 })
  }
}