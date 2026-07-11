// One-off / re-runnable tool: renders a listening test's spoken scripts into
// real audio files via Gemini TTS, using the project's existing GEMINI_API_KEY.
// Run with: npx tsx scripts/generate-listening-audio.mts
import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync } from "fs";
import "dotenv/config";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const OUT_DIR = "public/audio/listening/test-1";

function pcmToWav(pcmData: Buffer, sampleRate: number, channels: number, bitsPerSample: number) {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmData.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmData.length, 40);
  return Buffer.concat([header, pcmData]);
}

async function synthesize(text: string, speechConfig: any): Promise<Buffer> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: { responseModalities: ["AUDIO"], speechConfig },
  } as any);

  const part = response.candidates?.[0]?.content?.parts?.[0];
  const b64 = part?.inlineData?.data;
  if (!b64) throw new Error("No audio returned: " + JSON.stringify(response).slice(0, 500));
  return Buffer.from(b64, "base64");
}

const PARTS: { file: string; text: string; speechConfig: any }[] = [
  {
    file: "part1.wav",
    text: `TTS the following conversation naturally, like a real phone call:
Priya: Good afternoon, City Learning Centre, this is Priya speaking. How can I help you?
Daniel: Hi, I'd like to book a place on your "AI for Beginners" evening course, please.
Priya: Of course. Can I take your full name first?
Daniel: Yes, it's Daniel Whitfield. That's W-H-I-T-F-I-E-L-D.
Priya: Thanks, Daniel. And could I get your home address?
Daniel: Sure, it's 14 Marlow Street.
Priya: Great. Now, the course runs every Wednesday evening, starting at seven o'clock.
Daniel: Seven o'clock, got it. And how long does each session last?
Priya: Each session lasts ninety minutes, so you'd finish around eight thirty.
Daniel: Perfect. What's the total fee for the course?
Priya: The full course is one hundred and eighty pounds, but we do offer a discount for students.
Daniel: Oh good, I'm actually a part-time student.
Priya: In that case you'd only pay one hundred and forty pounds.
Daniel: That's great. Is there anything I need to bring?
Priya: Yes, please bring your own laptop, since we'll be doing some hands-on exercises.
Daniel: No problem, I've got one. Which room will the class be in?
Priya: You'll be in Room 12, on the second floor.
Daniel: Room 12, thanks. And how will I get confirmation of my booking?
Priya: We'll send a confirmation by text message once your payment goes through.
Daniel: Perfect, thank you so much for your help.
Priya: You're welcome, Daniel. We look forward to seeing you on Wednesday.`,
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          { speaker: "Priya", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore" } } },
          { speaker: "Daniel", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } } },
        ],
      },
    },
  },
  {
    file: "part2.wav",
    text: `Say in a warm, clear tour-guide voice:
Good morning everyone, and welcome to the City AI and Robotics Exhibition. My name's Sarah, and I'll be guiding you through today's visit.
We're open every day from nine in the morning until six in the evening, except Mondays, when we're closed for maintenance.
Before we begin, please note that flash photography isn't allowed near the robotic arm display, as it can interfere with the sensors.
Our most popular exhibit this year is definitely the self-driving car simulator, so I'd recommend visiting that early before the queues build up.
If you're interested in going further, we run a hands-on coding workshop for visitors, and that takes place every afternoon at two o'clock in the Learning Lab.
Tickets for the main exhibition are fifteen pounds for adults, but concessions are available for pensioners and children under twelve.
If you get hungry, the café is located on the ground floor, right next to the main entrance.
And before you leave, do stop by the gift shop — today only, all robotics kits are reduced by twenty percent.
Right, let's start with Hall One, where you'll see the history of artificial intelligence, right up to today's most advanced systems.`,
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } } },
  },
  {
    file: "part3.wav",
    text: `TTS the following conversation naturally, like a university tutorial:
Dr. Bennett: So, Maya, how's your group project on AI in healthcare coming along?
Maya: It's going well. We've decided to focus specifically on how AI is used to diagnose diseases from medical images.
Dr. Bennett: Good choice. Have you divided up the tasks yet?
Maya: Yes, I'm going to research the technical side, like how the algorithms are trained, while my partner focuses on the ethical questions, like patient privacy and bias in the data.
Dr. Bennett: That's a sensible split. What sources are you planning to use?
Maya: Mostly recent journal articles, but we also want to interview a radiologist if we can.
Dr. Bennett: That would add a nice practical element. When is your presentation due?
Maya: It's scheduled for the second week of next month.
Dr. Bennett: And how confident are you feeling about the deadline?
Maya: Honestly, I think the biggest challenge will be simplifying the technical details for a general audience. That's what we're most worried about.
Dr. Bennett: That's a very common issue, don't worry. My advice is to use lots of diagrams rather than dense text.
Maya: That's helpful, thank you.
Dr. Bennett: One more thing — have you thought about which journal you'll cite as your main case study?
Maya: Yes, we're using a study published by a research team in Toronto.
Dr. Bennett: Excellent. I look forward to seeing your progress next week.`,
    speechConfig: {
      multiSpeakerVoiceConfig: {
        speakerVoiceConfigs: [
          { speaker: "Dr. Bennett", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Charon" } } },
          { speaker: "Maya", voiceConfig: { prebuiltVoiceConfig: { voiceName: "Leda" } } },
        ],
      },
    },
  },
  {
    file: "part4.wav",
    text: `Say in a clear, measured university-lecture voice:
Today I want to talk about how machine learning systems actually learn from data.
At the core of most systems is something called a neural network, which is loosely inspired by the structure of the human brain.
A neural network is made up of layers, and information passes through an input layer, one or more hidden layers, and finally an output layer.
The system learns by adjusting internal values called weights, which control how much influence each connection has on the final result.
To train a system, we need a large amount of labelled data, since the network learns by comparing its predictions to the correct answers.
One common problem during training is called overfitting, which happens when a system memorises the training data too closely and performs poorly on new, unseen examples.
To reduce overfitting, researchers often use a technique called regularisation, which discourages the network from relying too heavily on any single feature.
These systems are now used in a huge range of applications, from recommending films to detecting fraud in banking transactions.
However, there are also important ethical concerns, particularly around bias, since a system trained on biased data will often produce biased results.
Looking ahead, researchers are increasingly focused on making these systems more transparent, so that people can understand exactly how a decision was reached.
That transparency is often referred to as explainability, and it's likely to become one of the most important research areas in the next decade.`,
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: "Orus" } } },
  },
];

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const part of PARTS) {
    console.log(`Generating ${part.file}...`);
    const pcm = await synthesize(part.text, part.speechConfig);
    const wav = pcmToWav(pcm, 24000, 1, 16);
    writeFileSync(`${OUT_DIR}/${part.file}`, wav);
    console.log(`  wrote ${OUT_DIR}/${part.file} (${wav.length} bytes)`);
  }
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});
