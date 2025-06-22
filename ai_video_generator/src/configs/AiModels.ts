// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

async function main(prompt: string) {
  const ai = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `

Write a script to generate 30 seconds video on topic : Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field
`,
        },
      ],
    },
    {
      role: 'model',
      parts: [
        {
          text: `**Comprehending the Brief**

I'm solidifying the fundamental parameters. The goal is clear: a 30-second video script in JSON, centered on an intriguing historical event. I'm focusing now on the necessary JSON fields: \`imagePrompt\` and \`contentText\`. Next, I'll identify how to ensure each field provides the necessary content.


**Structuring the Narrative**

I've fleshed out the story outline, settling on the "Great Emu War" for its brevity and visual appeal. Now, I'm breaking down the chosen story into concise scenes, estimating around 6-7 scenes for a dynamic 30-second script. The plan is roughly 4-6 seconds per scene, ensuring a punchy narrative.


**Crafting the Script**

I've been working on scene-by-scene content and image prompts. The "Great Emu War" is proving perfect, with clear visuals. I'm focusing now on sharpening image prompts to convey the conflict concisely and effectively, refining each scene to stay within the 30-second timeframe. The goal is compelling, yet brief, content that resonates. I'm making each scene more detailed in the image descriptions.


**Fine-tuning Scene Details**

I'm focused on scene-by-scene refinements now. The \`contentText\` and \`imagePrompt\` pairs are coming together, with the "Great Emu War" narrative proving highly adaptable. I'm fine-tuning the balance of "show, don't tell."  Ensuring each image complements the text is critical for a short, punchy, narrative. I've re-written the scene where the military is brought in, and provided more detailed instructions for the image that will be rendered, to ensure it shows the details clearly.


**Refining Scene Visuals**

I'm focused on fine-tuning the visual impact of each scene. I've completely revised the "Battle Begins" scene and the "Military Intervention" scene, ensuring the images clearly portray the conflict's peculiar nature and the military's actions. The goal is to strike a balance between factual representation and engaging visuals. The image prompts have to encapsulate the action in a compelling way. Also, I've started the last two scenes to wrap up the narrative and bring it home.


**Finalizing the JSON Script**

I'm focused on wrapping up the script with a strong conclusion. I've successfully crafted all the scene pairs (contentText/imagePrompt) for the "Great Emu War" video. Now, I'm proofreading and revising the entire script, ensuring it flows seamlessly and meets all requirements. The aim is a compelling, historically accurate, and visually captivating 30-second video script in JSON format.


**Finalizing the Scene Pairs**

I've crafted and fine-tuned all the content and image prompts. The "Great Emu War" narrative is now ready to present in JSON format. I'm focusing on ensuring each image prompt is optimized to generate the desired visuals. I'll make sure the scenes flow well.


**Refining Scene Visuals**

I've revised the "Battle Begins" and "Emu Victory" scenes to intensify the visual impact. The emu victory scene needed refinement to highlight the operation's failure and the emu's resilience. I've rephrased "The Legacy" as well, and provided a new prompt that is more realistic to convey the humor. I will finalize and review the script for its 30 second run time.


**Optimizing Scene Flow**

I'm currently revising and refining the narrative's flow. While the script is nearly complete, I'm focusing on pacing to ensure a smooth transition between scenes and a captivating 30-second presentation. The goal is to ensure each scene seamlessly connects to the next, while also adjusting \`imagePrompts\` for added visual impact. I've re-written several sections to make sure everything lines up, in sequence.

`,
        },
        {
          text: `Okay, this is a fun one! The "Great Emu War" is perfect for a short, interesting, and slightly absurd historical story.

Here's the JSON script for a 30-second video:

\`\`\`json
[
  {
    "imagePrompt": "Vast, sun-drenched Australian outback, early 1930s, open plains, with a sense of quiet before an unusual event. Realistic.",
    "contentText": "In 1932, Western Australia faced an unusual adversary, sparking a conflict known as the 'Great Emu War'."
  },
  {
    "imagePrompt": "A large flock of emus feeding and moving through a golden wheat field, leaving a trail of destruction. The field looks parched. Realistic, 1930s Australian landscape.",
    "contentText": "Thousands of emus, facing drought, descended on wheat farms, devastating crops planted by WWI veteran settlers."
  },
  {
    "imagePrompt": "A major G.P.W. Meredith, a stern-looking Australian soldier in a 1930s uniform, standing next to a tripod-mounted Lewis machine gun, set up in a dusty, open field. Realistic, cinematic.",
    "contentText": "In desperation, the military was called. Major G.P.W. Meredith led a small contingent, armed with two Lewis automatic machine guns."
  },
  {
    "imagePrompt": "A scene of chaos in a dusty Australian field. Emus are scattering and running in various directions, some blurred from motion. In the background, a machine gun tripod is visible, with dust plumes rising from near it, implying firing. Realistic, dynamic, 1930s.",
    "contentText": "The 'war' began, but the emus proved surprisingly elusive. Their speed and unpredictable zigzagging made them incredibly difficult targets."
  },
  {
    "imagePrompt": "Two Australian soldiers, looking weary and defeated, leaning against their idle Lewis machine gun in a dusty, empty field. In the far distance, a small group of emus stands undisturbed, almost seeming to observe the scene. Realistic, 1930s.",
    "contentText": "After weeks and thousands of rounds of ammunition, only a few hundred emus were confirmed killed. The operation was deemed a humiliating failure."
  },
  {
    "imagePrompt": "A single, proud-looking emu standing confidently in a wide open Australian field, with the sun setting behind it, casting a long shadow. The background suggests an endless, untamed landscape. Realistic, slightly humorous tone without being cartoonish.",
    "contentText": "The Great Emu War remains one of history's most unusual and arguably funniest military blunders, a testament to nature's resilience."
  }
]
\`\`\``,
        },
      ],
    },
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  
  let resultText = '';
  for await (const chunk of response) {
      if(chunk.text) {
        resultText += chunk.text;
      }
  }
  return resultText;
}

export { main };
  