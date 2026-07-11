# Speaking module — voice examiner agent

This is the Python process that plays the IELTS examiner: it joins the
LiveKit room the browser connects to (via `/api/livekit-token` in the main
app) and runs the STT → LLM → TTS pipeline for a real 3-part Speaking test.

It's a separate process from the main site because it's Python and needs to
stay running continuously — Vercel (which hosts the main site) can't host
that, so this runs on LiveKit Cloud instead.

## Local development

```bash
cd speaking-agent
cp .env.local.example .env.local   # paste in the same LIVEKIT_* values as the main app's .env
pip install -r requirements.txt --break-system-packages   # or use a venv
python agent.py dev
```

Leave this running in its own terminal while you use the Speaking module on
`localhost` — LiveKit will dispatch it into every room the frontend creates.

## Deploying so the live website works

The main site's Speaking module always needs an agent instance connected to
your LiveKit Cloud project, or candidates will connect and nothing will join
the room.

1. Install the [LiveKit CLI](https://docs.livekit.io/home/cli/).
2. From this folder, run `lk agent create` — LiveKit Cloud builds and keeps
   this agent running for you (no server to manage).
3. Confirm `LIVEKIT_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` in the
   main app's `.env` (and in your Vercel project's environment variables)
   match the same LiveKit Cloud project.

## Customizing the test

- Add or edit cue cards in the `CUE_CARDS` list in [agent.py](agent.py).
- The examiner's behaviour (question style, timing, closing assessment) is
  defined in the `IELTSExaminer` instructions in the same file.
- Swap the `inference.STT` / `inference.LLM` / `inference.TTS` models for a
  different provider any time — see LiveKit's
  [AI models docs](https://docs.livekit.io/agents/models/).
