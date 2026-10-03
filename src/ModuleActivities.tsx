import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { neuronestIcons } from "./neuronestIcons"

export type ModuleActivityKind = "drag" | "mcq" | "match"

type ModuleActivitiesProps = {
  activity: ModuleActivityKind
  onBack: () => void
  onComplete: (stars: number) => void
}

const imageRoot = "/module1_activities/activities_images"
const imagePath = (name: string) => `${imageRoot}/${name}`
const completionStarImages = [
  "/assets/activity-card-stars-0.png",
  "/assets/completion-stars-1.png",
  "/assets/completion-stars-2.png",
  "/assets/completion-stars-3.png",
]

const dragQuestions = [
  {
    emotion: "Happy",
    correct: 1,
    options: [
      "A1-Q1 - Option 1 (Distractor).png",
      "A1-Q1 - Option 2 (Correct).png",
      "A1-Q1 - Option 3 (Distractor).png",
      "A1-Q1 - Option 4 (Distractor).png",
    ],
  },
  {
    emotion: "Sad",
    correct: 2,
    options: [
      "A1-Q2 - Option 1 (Distractor); A3-Q2 - Bottom 1.png",
      "A1-Q2 - Option 2 (Distractor).png",
      "A1-Q2 - Option 3 (Correct).png",
      "A1-Q2 - Option 4 (Distractor).png",
    ],
  },
  {
    emotion: "Angry",
    correct: 3,
    options: [
      "A1-Q3 - Option 1 (Distractor).png",
      "A1-Q3 - Option 2 (Distractor).png",
      "A1-Q3 - Option 3 (Distractor); A3-Q2 - Top 1.png",
      "A1-Q3 - Option 4 (Correct); A3-Q4 - Bottom 3.png",
    ],
  },
  {
    emotion: "Sicky",
    correct: 0,
    options: [
      "A1-Q4 - Option 1 (Correct).png",
      "A1-Q4 - Option 2 (Distractor); A3-Q4 - Bottom 4.png",
      "A1-Q4 - Option 3 (Distractor); A3-Q2 - Bottom 4.png",
      "A1-Q4 - Option 4 (Distractor).png",
    ],
  },
  {
    emotion: "Nervous",
    correct: 1,
    options: [
      "A1-Q5 - Option 1 (Distractor); A3-Q2 - Top 4.png",
      "A1-Q5 - Option 2 (Correct).png",
      "A1-Q5 - Option 3 (Distractor).png",
      "A1-Q5 - Option 4 (Distractor).png",
    ],
  },
  {
    emotion: "Excited",
    correct: 2,
    options: [
      "A1-Q6 - Option 1 (Distractor).png",
      "A1-Q6 - Option 2 (Distractor).png",
      "A1-Q6 - Option 3 (Correct).png",
      "A1-Q6 - Option 4 (Distractor).png",
    ],
  },
]

const mcqQuestions = [
  {
    prompt: "I get a birthday gift I really wanted. How would I feel?",
    image: "A2-Q1.png",
    answers: ["Sad", "Happy", "Angry", "Nervous"],
    correct: 1,
  },
  {
    prompt: "I cannot find my favorite toy anywhere. How would I feel?",
    image: "A2-Q2.png",
    answers: ["Calm", "Sad", "Funny", "Excited"],
    correct: 1,
  },
  {
    prompt: "Someone takes my toy while I am playing. How would I feel?",
    image: "A2-Q3.png",
    answers: ["Calm", "Sad", "Angry", "Funny"],
    correct: 2,
  },
  {
    prompt: "My tummy hurts and I want to lie down. How would I feel?",
    image: "A2-Q4.png",
    answers: ["Sicky", "Excited", "Happy", "Angry"],
    correct: 0,
  },
  {
    prompt: "I am about to speak in front of my class. How would I feel?",
    image: "A2-Q5.png",
    answers: ["Funny", "Nervous", "Calm", "Happy"],
    correct: 1,
  },
  {
    prompt: "My friend makes a very silly face. How would I feel?",
    image: "A2-Q6.png",
    answers: ["Sad", "Angry", "Funny", "Sicky"],
    correct: 2,
  },
]

type MatchItem = { image?: string; label?: string }
type MatchQuestion = {
  prompt: string
  sources: MatchItem[]
  targets: MatchItem[]
  pairs: number[]
}

const matchQuestions: MatchQuestion[] = [
  {
    prompt: "Match each picture with the correct emotion.",
    sources: [
      { image: "A3-Q1 - Top 1.png" },
      { image: "A3-Q1 - Top 2.png" },
      { image: "A3-Q1 - Top 3.png" },
      { image: "A3-Q1 - Top 4.png" },
    ],
    targets: [
      { label: "Angry" },
      { label: "Calm" },
      { label: "Happy" },
      { label: "Sad" },
    ],
    pairs: [2, 3, 0, 1],
  },
  {
    prompt: "Match the pictures showing the same emotion.",
    sources: [
      { image: "A1-Q3 - Option 3 (Distractor); A3-Q2 - Top 1.png" },
      { image: "A3-Q2 - Top 2.png" },
      { image: "A3-Q2 - Top 3.png" },
      { image: "A1-Q5 - Option 1 (Distractor); A3-Q2 - Top 4.png" },
    ],
    targets: [
      { image: "A1-Q2 - Option 1 (Distractor); A3-Q2 - Bottom 1.png" },
      { image: "A3-Q2 - Bottom 2.png" },
      { image: "A3-Q2 - Bottom 3.png" },
      { image: "A1-Q4 - Option 3 (Distractor); A3-Q2 - Bottom 4.png" },
    ],
    pairs: [2, 3, 1, 0],
  },
  {
    prompt: "Match each picture with the correct emotion.",
    sources: [
      { image: "A3-Q3 - Top 1.png" },
      { image: "A3-Q3 - Top 2.png" },
      { image: "A3-Q3 - Top 3.png" },
      { image: "A3-Q3 - Top 4.png" },
    ],
    targets: [
      { label: "Excited" },
      { label: "Grumpy" },
      { label: "Funny" },
      { label: "Nervous" },
    ],
    pairs: [1, 2, 3, 0],
  },
  {
    prompt: "Match the pictures showing the same emotion.",
    sources: [
      { image: "A3-Q4 - Top 1.png" },
      { image: "A3-Q4 - Top 2.png" },
      { image: "A3-Q4 - Top 3.png" },
      { image: "A3-Q4 - Top 4.png" },
    ],
    targets: [
      { image: "A3-Q4 - Bottom 1.png" },
      { image: "A3-Q4 - Bottom 2.png" },
      { image: "A1-Q3 - Option 4 (Correct); A3-Q4 - Bottom 3.png" },
      { image: "A1-Q4 - Option 2 (Distractor); A3-Q4 - Bottom 4.png" },
    ],
    pairs: [3, 2, 0, 1],
  },
]

export const moduleActivityImageUrls = Array.from(
  new Set([
    ...completionStarImages,
    ...dragQuestions.flatMap((question) => question.options.map(imagePath)),
    ...mcqQuestions.map((question) => imagePath(question.image)),
    ...matchQuestions.flatMap((question) => [
      ...question.sources
        .map((item) => item.image)
        .filter((image): image is string => Boolean(image))
        .map(imagePath),
      ...question.targets
        .map((item) => item.image)
        .filter((image): image is string => Boolean(image))
        .map(imagePath),
    ]),
  ]),
)

function scoreToStars(score: number, total: number) {
  const percentage = score / total
  if (percentage === 1) return 3
  if (percentage >= 0.75) return 2
  if (percentage >= 0.5) return 1
  return 0
}

function ActivityHeader({
  activity,
  current,
  total,
  onBack,
}: {
  activity: string
  current: number
  total: number
  onBack: () => void
}) {
  return (
    <header className="module-header">
      <button className="module-home" type="button" onClick={onBack}>
        <img src={neuronestIcons.home} alt="" />
        <span className="sr-only">Return home</span>
      </button>
      <div className="module-brand">NeuroNest</div>
      <div className="module-name">Emotions</div>
      <div className="module-activity-name">{activity}</div>
      <div className="module-progress" aria-label={`Question ${current} of ${total}`}>
        <div className="progress-dots">
          {Array.from({ length: total }, (_, index) => (
            <span className={index < current ? "is-complete" : ""} key={index} />
          ))}
        </div>
        <strong>
          {current} / {total}
        </strong>
      </div>
    </header>
  )
}

function Prompt({ children }: { children: ReactNode }) {
  return (
    <div className="module-prompt">
      <img className="prompt-speaker" src={neuronestIcons.sound} alt="" />
      <div>{children}</div>
    </div>
  )
}

function ResultScreen({
  stars,
  onBack,
  onRetry,
}: {
  stars: number
  onBack: () => void
  onRetry: () => void
}) {
  const message =
    stars === 3
      ? "Great job! You earned 3 stars."
      : stars === 2
        ? "Great job! You earned 2 stars."
        : stars === 1
          ? "Nice work! You earned 1 star."
          : "Let's try again and earn some stars!"

  return (
    <main className="completion-page">
      <header className="completion-header">
        <button
          className="module-home"
          type="button"
          aria-label="Return home"
          onClick={onBack}
        >
          <img src={neuronestIcons.home} alt="" />
        </button>
        <div className="completion-brand">
          NeuroNest <span className="completion-heart" />
        </div>
        <div className="completion-module">Emotions</div>
        <div className="completion-status">
          <img
            className="completion-check"
            src={neuronestIcons.complete}
            alt=""
          />
          Completed
        </div>
      </header>
      <section
        className="completion-panel"
        style={{
          left: "15%",
          filter: "none",
          backdropFilter: "none",
          transform: "none",
        }}
      >
        <h1>Activity Complete!</h1>
        <h2>{message}</h2>
        <img
          className="completion-stars"
          src={completionStarImages[stars]}
          alt={`Activity complete with ${stars} of 3 stars earned`}
        />
        <p>Ready for the next activity?</p>
        <div className="completion-actions">
          <button className="completion-retry" type="button" onClick={onRetry}>
            Try Again
          </button>
          <button className="completion-continue" type="button" onClick={onBack}>
            Continue
          </button>
        </div>
      </section>
    </main>
  )
}

function DragActivity({
  onBack,
  onFinish,
}: {
  onBack: () => void
  onFinish: (stars: number) => void
}) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [missed, setMissed] = useState<Set<number>>(new Set())
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const question = dragQuestions[questionIndex]

  const submit = (option: number) => {
    if (feedback === "correct") return
    if (option !== question.correct) {
      setMissed((current) => new Set(current).add(questionIndex))
      setFeedback("wrong")
      window.setTimeout(() => setFeedback(null), 450)
      return
    }
    setFeedback("correct")
    window.setTimeout(() => {
      if (questionIndex === dragQuestions.length - 1) {
        onFinish(
          scoreToStars(dragQuestions.length - missed.size, dragQuestions.length),
        )
      } else {
        setQuestionIndex((index) => index + 1)
        setSelected(null)
        setFeedback(null)
      }
    }, 550)
  }

  return (
    <main className="module-game">
      <ActivityHeader
        activity="Activity 1 · Drag & Drop"
        current={questionIndex + 1}
        total={dragQuestions.length}
        onBack={onBack}
      />
      <section className="module-content">
        <Prompt>
          Drag the kid showing this emotion: <strong>{question.emotion}</strong>
        </Prompt>
        <div className="drag-layout">
          <div className="drag-options">
            {question.options.map((option, index) => (
              <button
                className={`character-option${selected === index ? " is-selected" : ""}`}
                type="button"
                draggable
                onDragStart={(event) =>
                  event.dataTransfer.setData("text/plain", String(index))
                }
                onClick={() => setSelected(index)}
                key={option}
              >
                <img src={imagePath(option)} alt={`Option ${index + 1}`} />
              </button>
            ))}
          </div>
          <button
            className={`drop-zone${feedback ? ` is-${feedback}` : ""}`}
            type="button"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              submit(Number(event.dataTransfer.getData("text/plain")))
            }}
            onClick={() => {
              if (selected !== null) submit(selected)
            }}
          >
            <span className="drop-cloud" aria-hidden="true" />
            <strong>{feedback === "correct" ? "Great job!" : "Drop here"}</strong>
          </button>
        </div>
      </section>
    </main>
  )
}

function McqActivity({
  onBack,
  onFinish,
}: {
  onBack: () => void
  onFinish: (stars: number) => void
}) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [missed, setMissed] = useState<Set<number>>(new Set())
  const [choice, setChoice] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const question = mcqQuestions[questionIndex]

  const answer = (index: number) => {
    if (feedback === "correct") return
    setChoice(index)
    if (index !== question.correct) {
      setMissed((current) => new Set(current).add(questionIndex))
      setFeedback("wrong")
      window.setTimeout(() => {
        setFeedback(null)
        setChoice(null)
      }, 500)
      return
    }
    setFeedback("correct")
    window.setTimeout(() => {
      if (questionIndex === mcqQuestions.length - 1) {
        onFinish(
          scoreToStars(mcqQuestions.length - missed.size, mcqQuestions.length),
        )
      } else {
        setQuestionIndex((index) => index + 1)
        setChoice(null)
        setFeedback(null)
      }
    }, 550)
  }

  return (
    <main className="module-game">
      <ActivityHeader
        activity="Activity 2 · MCQ"
        current={questionIndex + 1}
        total={mcqQuestions.length}
        onBack={onBack}
      />
      <section className="module-content">
        <Prompt>{question.prompt}</Prompt>
        <div className="mcq-layout">
          <div className="situation-image">
            <img src={imagePath(question.image)} alt="" />
          </div>
          <div className="answer-list">
            {question.answers.map((answerText, index) => (
              <button
                className={
                  choice === index && feedback
                    ? `is-${feedback}`
                    : ""
                }
                type="button"
                onClick={() => answer(index)}
                key={answerText}
              >
                {answerText}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

function MatchingActivity({
  onBack,
  onFinish,
}: {
  onBack: () => void
  onFinish: (stars: number) => void
}) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedSource, setSelectedSource] = useState<number | null>(null)
  const [matches, setMatches] = useState<Record<number, number>>({})
  const [missed, setMissed] = useState<Set<number>>(new Set())
  const [wrongTarget, setWrongTarget] = useState<number | null>(null)
  const [dragLine, setDragLine] = useState<{
    source: number
    x: number
    y: number
  } | null>(null)
  const question = matchQuestions[questionIndex]

  const layoutRef = useRef<HTMLDivElement>(null)
  const sourceRefs = useRef<(HTMLSpanElement | null)[]>([])
  const targetRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [layoutSize, setLayoutSize] = useState<{ width: number; height: number }>({
    width: 1000,
    height: 600,
  })
  const [sourcePositions, setSourcePositions] = useState<Record<number, { x: number; y: number }>>({})
  const [targetPositions, setTargetPositions] = useState<Record<number, { x: number; y: number }>>({})

  const updateDotPositions = useCallback(() => {
    if (!layoutRef.current) return
    const layoutRect = layoutRef.current.getBoundingClientRect()
    if (layoutRect.width === 0 || layoutRect.height === 0) return

    setLayoutSize({ width: layoutRect.width, height: layoutRect.height })

    const newSources: Record<number, { x: number; y: number }> = {}
    sourceRefs.current.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      newSources[index] = {
        x: rect.left + rect.width / 2 - layoutRect.left,
        y: rect.top + rect.height / 2 - layoutRect.top,
      }
    })
    setSourcePositions(newSources)

    const newTargets: Record<number, { x: number; y: number }> = {}
    targetRefs.current.forEach((el, index) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      newTargets[index] = {
        x: rect.left + rect.width / 2 - layoutRect.left,
        y: rect.top + rect.height / 2 - layoutRect.top,
      }
    })
    setTargetPositions(newTargets)
  }, [])

  useLayoutEffect(() => {
    updateDotPositions()
  }, [questionIndex, updateDotPositions])

  useEffect(() => {
    const handleResize = () => updateDotPositions()
    window.addEventListener("resize", handleResize)
    const observer = new ResizeObserver(() => {
      updateDotPositions()
    })
    if (layoutRef.current) {
      observer.observe(layoutRef.current)
    }
    return () => {
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [updateDotPositions])

  const targetUsed = useMemo(() => new Set(Object.values(matches)), [matches])

  const selectTarget = (
    targetIndex: number,
    sourceIndex = selectedSource,
  ) => {
    if (sourceIndex === null || targetUsed.has(targetIndex)) return
    if (question.pairs[sourceIndex] !== targetIndex) {
      setMissed((current) => new Set(current).add(questionIndex))
      setWrongTarget(targetIndex)
      window.setTimeout(() => setWrongTarget(null), 450)
      return
    }
    const updated = { ...matches, [sourceIndex]: targetIndex }
    setMatches(updated)
    setSelectedSource(null)
    if (Object.keys(updated).length === 4) {
      window.setTimeout(() => {
        if (questionIndex === matchQuestions.length - 1) {
          onFinish(
            scoreToStars(
              matchQuestions.length - missed.size,
              matchQuestions.length,
            ),
          )
        } else {
          setQuestionIndex((index) => index + 1)
          setMatches({})
          setSelectedSource(null)
        }
      }, 650)
    }
  }

  // Calculate outer edge intersection point so the line ends right at the circle's border
  const getPerimeterPoint = (
    center: { x: number; y: number },
    target: { x: number; y: number },
    radius = 21,
  ) => {
    const dx = target.x - center.x
    const dy = target.y - center.y
    const dist = Math.hypot(dx, dy)
    if (dist <= radius) return center
    return {
      x: center.x + (dx / dist) * radius,
      y: center.y + (dy / dist) * radius,
    }
  }

  const renderMatchItem = (item: MatchItem) =>
    item.image ? (
      <img src={imagePath(item.image)} alt="" draggable={false} />
    ) : (
      <strong>{item.label}</strong>
    )

  return (
    <main className="module-game">
      <ActivityHeader
        activity="Activity 3 · Match"
        current={questionIndex + 1}
        total={matchQuestions.length}
        onBack={onBack}
      />
      <section className="module-content match-content">
        <Prompt>{question.prompt}</Prompt>
        <div className="matching-layout" ref={layoutRef}>
          <div className="match-column">
            {question.sources.map((item, index) => (
              <button
                className={`match-card source${selectedSource === index ? " is-selected" : ""}${index in matches ? " is-matched" : ""}`}
                type="button"
                onPointerDown={(event) => {
                  if (index in matches) return
                  event.currentTarget.setPointerCapture(event.pointerId)
                  setSelectedSource(index)
                  const startPt = sourcePositions[index]
                  if (layoutRef.current) {
                    const bounds = layoutRef.current.getBoundingClientRect()
                    setDragLine({
                      source: index,
                      x: startPt?.x ?? (event.clientX - bounds.left),
                      y: startPt?.y ?? (event.clientY - bounds.top),
                    })
                  }
                }}
                onPointerMove={(event) => {
                  if (!dragLine || dragLine.source !== index) return
                  if (!layoutRef.current) return
                  const bounds = layoutRef.current.getBoundingClientRect()
                  
                  // Check if cursor is hovering over a target dot or target card
                  const targetEl = document
                    .elementFromPoint(event.clientX, event.clientY)
                    ?.closest<HTMLElement>("[data-target-index]")
                  if (targetEl) {
                    const targetIdx = Number(targetEl.dataset.targetIndex)
                    const targetDot = targetPositions[targetIdx]
                    if (targetDot) {
                      setDragLine({
                        source: index,
                        x: targetDot.x,
                        y: targetDot.y,
                      })
                      return
                    }
                  }

                  setDragLine({
                    source: index,
                    x: event.clientX - bounds.left,
                    y: event.clientY - bounds.top,
                  })
                }}
                onPointerUp={(event) => {
                  if (!dragLine || dragLine.source !== index) return
                  event.currentTarget.releasePointerCapture(event.pointerId)
                  const target = document
                    .elementFromPoint(event.clientX, event.clientY)
                    ?.closest<HTMLElement>("[data-target-index]")
                  if (target) {
                    selectTarget(Number(target.dataset.targetIndex), index)
                  }
                  setDragLine(null)
                }}
                onPointerCancel={() => setDragLine(null)}
                onClick={() => {
                  if (!dragLine && !(index in matches)) {
                    setSelectedSource(index)
                  }
                }}
                key={index}
              >
                {renderMatchItem(item)}
                <span
                  className={`connector${index in matches ? " is-matched" : ""}`}
                  ref={(el) => {
                    sourceRefs.current[index] = el
                  }}
                />
              </button>
            ))}
          </div>
          <svg
            className="match-lines"
            viewBox={`0 0 ${layoutSize.width} ${layoutSize.height}`}
            aria-hidden="true"
          >
            {Object.entries(matches).map(([sourceStr, target]) => {
              const source = Number(sourceStr)
              const startCenter = sourcePositions[source]
              const endCenter = targetPositions[target]
              if (!startCenter || !endCenter) return null
              // Compute outer perimeter contact points (radius 21.5px matches the 43px connector)
              const startEdge = getPerimeterPoint(startCenter, endCenter, 21.5)
              const endEdge = getPerimeterPoint(endCenter, startCenter, 21.5)
              return (
                <line
                  x1={startEdge.x}
                  y1={startEdge.y}
                  x2={endEdge.x}
                  y2={endEdge.y}
                  key={source}
                />
              )
            })}
            {dragLine && sourcePositions[dragLine.source] && (() => {
              const startCenter = sourcePositions[dragLine.source]
              const endPoint = { x: dragLine.x, y: dragLine.y }
              const startEdge = getPerimeterPoint(startCenter, endPoint, 21.5)
              return (
                <line
                  className="is-dragging"
                  x1={startEdge.x}
                  y1={startEdge.y}
                  x2={endPoint.x}
                  y2={endPoint.y}
                />
              )
            })()}
          </svg>
          <div className="match-column">
            {question.targets.map((item, index) => (
              <button
                className={`match-card target${targetUsed.has(index) ? " is-matched" : ""}${wrongTarget === index ? " is-wrong" : ""}`}
                type="button"
                data-target-index={index}
                onClick={() => selectTarget(index)}
                key={index}
              >
                <span
                  className={`connector${targetUsed.has(index) ? " is-matched" : ""}`}
                  ref={(el) => {
                    targetRefs.current[index] = el
                  }}
                />
                {renderMatchItem(item)}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default function ModuleActivities({
  activity,
  onBack,
  onComplete,
}: ModuleActivitiesProps) {
  const [result, setResult] = useState<number | null>(null)
  const [attempt, setAttempt] = useState(0)

  if (result !== null) {
    return (
      <ResultScreen
        stars={result}
        onBack={onBack}
        onRetry={() => {
          setResult(null)
          setAttempt((value) => value + 1)
        }}
      />
    )
  }

  const props = {
    onBack,
    onFinish: (stars: number) => {
      setResult(stars)
      onComplete(stars)
    },
  }

  if (activity === "drag") return <DragActivity key={attempt} {...props} />
  if (activity === "mcq") return <McqActivity key={attempt} {...props} />
  return <MatchingActivity key={attempt} {...props} />
}
