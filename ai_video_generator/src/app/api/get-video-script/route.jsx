import { NextResponse } from 'next/server';
import { main } from '@/configs/AiModels';

export async function POST(req) {
  try {
    const { prompt } = await req.json();
    console.log(prompt);

    // Call the main function with the prompt
    const result = await main(prompt);
    console.log('AI Result:', result);

    let parsedResult;
    try {
      const match = result.match(/\[[\s\S]*\]/);
      if (match) {
        parsedResult = JSON.parse(match[0]);
      } else {
        throw new Error('No JSON object found in AI result');
      }
    } catch (parseError) {
      console.error('Failed to parse AI result as JSON:', parseError);
      return NextResponse.json({
        error: 'Failed to parse AI result as JSON',
        rawResult: result
      }, { status: 500 });
    }

    return NextResponse.json({
      result: parsedResult
    });
  } catch (e) {
    console.error('API Route Error:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
