"""
IELTS Speaking Practice — LiveKit Voice Agent
-----------------------------------------------
Runs a realistic 3-part IELTS Speaking test (Part 1 Introduction & Interview,
Part 2 Long Turn with cue card, Part 3 Two-way Discussion) and gives a
band-descriptor style assessment at the end.

Run:
    uv run agent.py console   # talk to it in your terminal
    uv run agent.py dev       # connect it to LiveKit for the web frontend
    uv run agent.py start     # production mode
"""

import random

from dotenv import load_dotenv

from livekit import agents
from livekit.agents import (
    AgentServer,
    AgentSession,
    Agent,
    inference,
    room_io,
    TurnHandlingOptions,
)
from livekit.plugins import ai_coustics

load_dotenv(".env.local")


# ---------------------------------------------------------------------------
# A small bank of Part 2 cue cards. Add more of your own any time — each one
# just needs a topic sentence plus 3-4 bullet prompts, exactly like the real
# test's cue cards.
# ---------------------------------------------------------------------------
CUE_CARDS = [
    """Describe a book that had a strong influence on you.
    You should say: what the book was, when you read it, what it was about,
    and explain why it influenced you so much.""",
    """Describe a journey that you found particularly memorable.
    You should say: where you went, who you went with, what you did there,
    and explain why this journey was memorable for you.""",
    """Describe a skill you learned that you are proud of.
    You should say: what the skill is, how you learned it, how long it took,
    and explain why you are proud of learning it.""",
    """Describe a piece of technology you find useful in daily life.
    You should say: what it is, how often you use it, what you use it for,
    and explain why you find it so useful.""",
    """Describe a person who has had a positive influence on your life.
    You should say: who this person is, how you know them, what they did,
    and explain why they influenced you positively.""",
    """Describe a time you had to make an important decision.
    You should say: what the decision was, when you made it, what the
    alternatives were, and explain how you felt about the decision.""",
]


class IELTSExaminer(Agent):
    """The persona and behaviour of the IELTS examiner for this session."""

    def __init__(self, cue_card: str) -> None:
        super().__init__(
            instructions=f"""
You are a certified IELTS Speaking examiner conducting a real IELTS Speaking
test with a candidate. Stay strictly in the examiner role: professional,
neutral, encouraging but not chatty, and never break character to explain
what you are doing.

Conduct the test in three parts, in order, without skipping any part:

PART 1 — Introduction and Interview (about 4-5 minutes)
Greet the candidate, confirm their name, then ask 3-4 short questions on
each of two or three familiar everyday topics (e.g. home town, work or
studies, daily routine, hobbies, food, weather). Keep questions short and
natural, one at a time, and let the candidate answer fully before moving on.

PART 2 — Individual Long Turn (about 3-4 minutes)
Present exactly this cue card to the candidate, reading it out clearly:
"{cue_card}"
Tell them they have one minute to prepare and may make notes, and that they
should not start speaking yet. Wait silently for about one minute (do not
fill the silence with chatter), then tell them to begin, and that they
should speak for one to two minutes. After they finish, ask exactly one
short follow-up question related to the cue card topic.

PART 3 — Two-Way Discussion (about 4-5 minutes)
Ask 4-5 broader, more abstract discussion questions connected to the Part 2
topic, going deeper than Part 2 (opinions, comparisons, causes, effects,
future implications, society-level questions). Probe and follow up
naturally on interesting answers, the way a real examiner would.

CLOSING — Assessment
Once Part 3 is finished, tell the candidate the test has ended, thank them,
then give a band-descriptor style assessment covering:
- Fluency and Coherence
- Lexical Resource
- Grammatical Range and Accuracy
- Pronunciation
For each criterion, give an estimated band from 1 to 9 with one or two
sentences of reasoning based on what they actually said, then give a
rounded overall band score. Be honest and specific rather than generically
positive — cite an actual phrase or pattern from their answers where you
can. Keep the whole assessment concise, well organised, and encouraging in
tone even when pointing out weaknesses.

Throughout the test, do not interrupt the candidate while they are
speaking, and do not use complex formatting, emojis, or asterisks — you are
speaking out loud, not writing.
"""
        )


server = AgentServer()


@server.rtc_session(agent_name="ielts-examiner")
async def ielts_agent(ctx: agents.JobContext):
    cue_card = random.choice(CUE_CARDS)

    session = AgentSession(
        stt=inference.STT(model="assemblyai/universal-streaming", language="en"),
        llm=inference.LLM(model="google/gemma-4-31b-it"),
        tts=inference.TTS(
            model="cartesia/sonic-3",
            voice="9626c31c-bec5-4cca-baa8-f8ba9e84c8bc",
        ),
        turn_handling=TurnHandlingOptions(
            turn_detection=inference.TurnDetector(),
        ),
    )

    await session.start(
        room=ctx.room,
        agent=IELTSExaminer(cue_card),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=ai_coustics.audio_enhancement(
                    model=ai_coustics.EnhancerModel.QUAIL_VF_S
                ),
            ),
        ),
    )

    await session.generate_reply(
        instructions=(
            "Greet the candidate as an IELTS examiner would, ask their full "
            "name, and then begin Part 1 with your first introductory "
            "question."
        )
    )


if __name__ == "__main__":
    agents.cli.run_app(server)
