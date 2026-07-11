# Adding your own Listening test

The Listening module in [src/components/ListeningModule.tsx](../../../src/components/ListeningModule.tsx)
plays one mp3 file per part (4 parts per test) and grades questions you define
yourself. Nothing here should be copyrighted exam content — it's your own
recordings/questions.

## 1. Add your audio files

Drop your mp3 files here, one per part, e.g. for Test 1:

```
public/audio/listening/test-1/part1.mp3
public/audio/listening/test-1/part2.mp3
public/audio/listening/test-1/part3.mp3
public/audio/listening/test-1/part4.mp3
```

For a second test, make a `test-2/` folder the same way, and so on.

## 2. Edit the question data

Open `LISTENING_TESTS` near the top of `ListeningModule.tsx`. Each section
looks like this:

```ts
{
  id: 1,
  title: "Part 1",
  instruction: "Complete the notes below. Write ONE WORD for each answer.",
  audioUrl: "/audio/listening/test-1/part1.mp3",
  questions: [
    {
      id: 1,
      type: "completion",       // "completion" | "short_answer" | "mcq" | "matching"
      question: "Visitor's name: _______",   // "_______" marks the blank for completion questions
      correctAnswer: "Rahman",
      explanation: "Shown after submitting, to explain the answer.",
    },
    {
      id: 2,
      type: "mcq",
      question: "What time does the office open?",
      options: ["8am", "9am", "10am"],       // rendered as A / B / C
      correctAnswer: "B",
      explanation: "...",
    },
  ],
},
```

- `id` must be unique across the whole test (1–40 like a real test).
- `type: "completion"` renders inline blanks wherever `_______` appears in
  `question`.
- `type: "short_answer"` renders a single open text box.
- `type: "mcq"` / `"matching"` render lettered radio options from `options`.
- To add a second test, copy the `Practice Test 2` placeholder entry, give it
  real `sections`, and drop `isComingSoon` from it.

## 3. That's it

No other code changes needed — the player, timer, question navigator,
"practice this part only" mode, and auto-grading all read from this data.
