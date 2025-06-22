import { db } from "../../../configs/db";
import { VideoData } from "../../../configs/schema";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { videoScript, audioFileUrl, captions, imageList, createdBy } = await req.json();

        console.log('Received data:', { videoScript, audioFileUrl, captions, imageList, createdBy });

        if (!videoScript || !audioFileUrl || !captions || !imageList || !createdBy) {
            console.log('Missing fields:', { 
                hasVideoScript: !!videoScript, 
                hasAudioFileUrl: !!audioFileUrl, 
                hasCaptions: !!captions, 
                hasImageList: !!imageList, 
                hasCreatedBy: !!createdBy 
            });
            return NextResponse.json({ error: 'Missing required video data fields.' }, { status: 400 });
        }
        
        const result = await db.insert(VideoData).values({
            script: videoScript,
            audioFileUrl: audioFileUrl,
            captions: captions,
            imageList: imageList,
            createdBy: createdBy
        }).returning({ id: VideoData.id });

        return NextResponse.json({ 
            success: true,
            videoId: result[0]?.id,
            message: 'Video saved successfully'
        });

    } catch (error) {
        console.error('Error saving video data:', error);
        return NextResponse.json(
            { error: 'Failed to save video data.', details: error.message },
            { status: 500 }
        );
    }
} 