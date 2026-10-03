import { useEffect, useRef, useState } from "react"
import doorHover from "../emotions-door-assets/door-hover.png"
import doorNormal from "../emotions-door-assets/door-normal.png"
import doorSelected from "../emotions-door-assets/door-selected.png"
import availableWindowNormal from "../emotions-window-assets/window-available-normal.png"
import availableWindowSelected from "../emotions-window-assets/window-available-selected.png"
import completedWindowNormal from "../emotions-window-assets/window-completed-normal.png"
import completedWindowSelected from "../emotions-window-assets/window-completed-selected.png"
import lockedWindow from "../emotions-window-assets/window-locked-normal.png"
import lessonImage from "../card images/image 38.png"
import puzzleActivityImage from "@/imports/image_39.png"
import tickCorrectActivityImage from "@/imports/image_51-2.png"
import LessonSlides, { lessonImageUrls } from "./LessonSlides"
import ModuleActivities, {
  moduleActivityImageUrls,
  type ModuleActivityKind,
} from "./ModuleActivities"
import { neuronestIconUrls } from "./neuronestIcons"

const assets = {
  activityCheck: "/assets/activity-check.png",
  activityHand: "/assets/activity-hand.png",
  activityPuzzle: "/assets/activity-puzzle.png",
  building: "/assets/building_layer.png",
  car: "/assets/car.png",
  close: "/assets/close.png",
  clouds: "/assets/clouds.png",
  dragDropActivity: "/assets/drag-drop-activity.png",
  foreground: "/assets/foreground-plants.png",
  hills: "/assets/distant-landscape.png",
  puzzleActivity: "/assets/puzzles-activity.png",
  reference: "/assets/reference.png",
  speaker: "/assets/speaker.png",
  tickCorrectActivity: "/assets/tick-correct-activity.png",
}

const progressStarImages = [
  "/assets/stars-0.png",
  "/assets/stars-1.png",
  "/assets/stars-2.png",
  "/assets/stars-3.png",
]

type ActivityId = "puzzles" | "drag-drop" | "tick-correct" | "lesson"

function ProgressStars({
  className,
  value,
  label,
}: {
  className: string
  value: number
  label: string
}) {
  return (
    <img
      className={`window-stars ${className}`}
      src={progressStarImages[value]}
      alt={`${label}: ${value} of 3 stars`}
    />
  )
}

export default function App() {
  const preloadedImages = useRef<HTMLImageElement[]>([])
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [lessonOpen, setLessonOpen] = useState(true)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [firstActivityCompleted, setFirstActivityCompleted] = useState(false)
  const [secondActivityCompleted, setSecondActivityCompleted] = useState(false)
  const [thirdActivityCompleted, setThirdActivityCompleted] = useState(false)
  const [rightActivityStars, setRightActivityStars] = useState(0)
  const [leftActivityStars, setLeftActivityStars] = useState(0)
  const [topActivityStars, setTopActivityStars] = useState(0)
  const [activeActivity, setActiveActivity] =
    useState<ActivityId>("lesson")
  const [openedActivity, setOpenedActivity] = useState<ActivityId | null>(null)
  const [selectedButton, setSelectedButton] = useState<
    "door" | "top" | "left" | "right" | null
  >("door")
  const [doorIsHovered, setDoorIsHovered] = useState(false)

  const isLessonCard = activeActivity === "lesson"
  const isRightActivity = activeActivity === "drag-drop"
  const isPuzzleActivity = activeActivity === "puzzles"
  const isThirdActivity = activeActivity === "tick-correct"

  const rightActivityIsLocked = !lessonCompleted
  const leftActivityIsLocked = !firstActivityCompleted
  const topActivityIsLocked = !secondActivityCompleted

  const isCurrentCardLocked =
    (isRightActivity && rightActivityIsLocked) ||
    (isPuzzleActivity && leftActivityIsLocked) ||
    (isThirdActivity && topActivityIsLocked)

  const rightWindowImage = rightActivityIsLocked
    ? lockedWindow
    : rightActivityStars === 3
      ? selectedButton === "right"
        ? completedWindowSelected
        : completedWindowNormal
      : selectedButton === "right"
        ? availableWindowSelected
        : availableWindowNormal

  const leftWindowImage = leftActivityIsLocked
    ? lockedWindow
    : leftActivityStars === 3
      ? selectedButton === "left"
        ? completedWindowSelected
        : completedWindowNormal
      : selectedButton === "left"
        ? availableWindowSelected
        : availableWindowNormal

  const topWindowImage = topActivityIsLocked
    ? lockedWindow
    : topActivityStars === 3
      ? selectedButton === "top"
        ? completedWindowSelected
        : completedWindowNormal
      : selectedButton === "top"
        ? availableWindowSelected
        : availableWindowNormal

  useEffect(() => {
    const imageUrls = Array.from(
      new Set([
        ...Object.values(assets),
        ...progressStarImages,
        ...moduleActivityImageUrls,
        ...lessonImageUrls,
        ...neuronestIconUrls,
        "/assets/ground-trees-fence.png",
        "/assets/activity-card-stars-0.png",
        "/assets/activity-card-stars-1.png",
        "/assets/activity-card-stars-2.png",
        "/assets/activity-card-stars-3.png",
        availableWindowNormal,
        availableWindowSelected,
        completedWindowNormal,
        completedWindowSelected,
        lockedWindow,
        doorNormal,
        doorHover,
        doorSelected,
        puzzleActivityImage,
        tickCorrectActivityImage,
        lessonImage,
      ]),
    )
    let loaded = 0
    let cancelled = false

    const markLoaded = () => {
      loaded += 1
      if (!cancelled) {
        setLoadingProgress(Math.round((loaded / imageUrls.length) * 100))
      }
    }

    const preload = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new Image()
        preloadedImages.current.push(image)
        let finished = false
        const finish = async () => {
          if (finished) return
          finished = true
          try {
            await image.decode()
          } catch {
            // A loaded image can still reject decode in some browsers.
          }
          markLoaded()
          resolve()
        }
        image.onload = finish
        image.onerror = finish
        image.src = src
        if (image.complete) void finish()
      })

    void Promise.all([Promise.all(imageUrls.map(preload)), document.fonts.ready]).then(() => {
      if (!cancelled) {
        setLoadingProgress(100)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!cancelled) setIsLoading(false)
          })
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (openedActivity && openedActivity !== "lesson") {
    const activityMap: Record<
      Exclude<ActivityId, "lesson">,
      ModuleActivityKind
    > = {
      puzzles: "mcq",
      "drag-drop": "drag",
      "tick-correct": "match",
    }

    return (
      <ModuleActivities
        activity={activityMap[openedActivity]}
        onBack={() => setOpenedActivity(null)}
        onComplete={(stars) => {
          if (openedActivity === "drag-drop") {
            setRightActivityStars(stars)
            setFirstActivityCompleted(true)
            setActiveActivity("puzzles")
            setSelectedButton("left")
            setLessonOpen(true)
          }
          if (openedActivity === "puzzles") {
            setLeftActivityStars(stars)
            setSecondActivityCompleted(true)
            setActiveActivity("tick-correct")
            setSelectedButton("top")
            setLessonOpen(true)
          }
          if (openedActivity === "tick-correct") {
            setTopActivityStars(stars)
            setThirdActivityCompleted(true)
            setActiveActivity("tick-correct")
            setSelectedButton("top")
            setLessonOpen(true)
          }
        }}
      />
    )
  }

  if (openedActivity === "lesson") {
    return (
      <LessonSlides
        onBack={() => {
          setOpenedActivity(null)
        }}
        onStartActivities={() => {
          setLessonCompleted(true)
          setOpenedActivity(null)
          setActiveActivity("drag-drop")
          setSelectedButton("right")
          setLessonOpen(true)
        }}
      />
    )
  }

  return (
    <main className="app-shell">
      <section
        className="game-stage"
        aria-label="Learning adventure"
        style={{ position: "fixed" }}
        onPointerDownCapture={(event) => {
          if (
            !(event.target as Element).closest(
              ".door-button, .window-button",
            )
          ) {
            setSelectedButton(null)
          }
        }}
      >
        <div className="sky" />
        <img className="scenery scenery-clouds" src={assets.clouds} alt="" />
        <img className="scenery scenery-hills" src={assets.hills} alt="" />
        <div className="ground" />

        <div className="school" aria-label="Learning house">
          <div className="building">
            <img className="building-art" src={assets.building} alt="" />

            <button
              className={`window-button window-top${selectedButton === "top" ? " is-selected" : ""}`}
              type="button"
              aria-label={
                topActivityIsLocked
                  ? "Preview locked Match the Following activity"
                  : "Open Match the Following activity"
              }
              aria-pressed={selectedButton === "top"}
              onPointerDown={() => setSelectedButton("top")}
              onClick={() => {
                setSelectedButton("top")
                setActiveActivity("tick-correct")
                setLessonOpen(true)
              }}
            >
              <img
                src={topWindowImage}
                alt=""
              />
              <img
                className="activity-badge badge-top"
                src={assets.activityCheck}
                alt=""
              />
              <ProgressStars
                className="stars-top"
                value={topActivityStars}
                label="Next activity progress"
              />
            </button>

            <button
              className={`window-button window-left${selectedButton === "left" ? " is-selected" : ""}`}
              type="button"
              aria-label={
                leftActivityIsLocked
                  ? "Preview locked Multiple Choice activity"
                  : "Open Multiple Choice activity"
              }
              aria-pressed={selectedButton === "left"}
              onPointerDown={() => setSelectedButton("left")}
              onClick={() => {
                setSelectedButton("left")
                setActiveActivity("puzzles")
                setLessonOpen(true)
              }}
            >
              <img
                src={leftWindowImage}
                alt=""
              />
              <img
                className="activity-badge badge-lower"
                src={assets.activityPuzzle}
                alt=""
              />
              <ProgressStars
                className="stars-left"
                value={leftActivityStars}
                label="Multiple choice activity progress"
              />
            </button>
            <button
              className={`window-button window-right${selectedButton === "right" ? " is-selected" : ""}`}
              type="button"
              aria-label={
                rightActivityIsLocked
                  ? "Preview locked Drag and Drop activity"
                  : "Open Drag and Drop activity"
              }
              aria-pressed={selectedButton === "right"}
              onPointerDown={() => setSelectedButton("right")}
              onClick={() => {
                setSelectedButton("right")
                setActiveActivity("drag-drop")
                setLessonOpen(true)
              }}
            >
              <img
                src={rightWindowImage}
                alt=""
              />
              <img
                className="activity-badge badge-lower"
                src={assets.activityHand}
                alt=""
              />
              <ProgressStars
                className="stars-right"
                value={rightActivityStars}
                label="Drag and Drop activity progress"
              />
            </button>

            <button
              className="door-button"
              type="button"
              aria-label="Open school door"
              aria-pressed={selectedButton === "door"}
              onPointerDown={() => setSelectedButton("door")}
              onClick={() => {
                setSelectedButton("door")
                setActiveActivity("lesson")
                setLessonOpen(true)
              }}
              onMouseEnter={() => setDoorIsHovered(true)}
              onMouseLeave={() => setDoorIsHovered(false)}
              onFocus={() => setDoorIsHovered(true)}
              onBlur={() => setDoorIsHovered(false)}
            >
              <img
                className="door"
                src={
                  selectedButton === "door"
                    ? doorSelected
                    : doorIsHovered
                      ? doorHover
                      : doorNormal
                }
                alt="School door"
              />
            </button>
          </div>
        </div>

        <img
          className="car-static"
          src={assets.car}
          alt="Child driving a blue car"
        />

        {lessonOpen && (
          <aside
            key={activeActivity}
            className="lesson-card"
            aria-label={
              isLessonCard
                ? "Lesson"
                : isThirdActivity
                ? "Match the Following activity"
                : isPuzzleActivity
                  ? "Multiple Choice activity"
                  : "Drag and Drop activity"
            }
          >
            <div
              className="lesson-art"
              role="img"
              aria-label={
                isLessonCard
                  ? "Learning lesson"
                  : isThirdActivity
                  ? "Match the Following lesson with three stars"
                  : isPuzzleActivity
                    ? "Multiple Choice lesson with three stars"
                    : "Drag and Drop lesson with three stars"
              }
              style={{
                display: "flex",
                width: "100%",
                height: "100%",
                padding: "1.25%",
                flexDirection: "column",
                borderRadius: "5.1%",
                background:
                  "linear-gradient(180deg, #ffb020 0%, #f57c00 100%)",
                boxShadow: "0 12px 24px rgba(99, 55, 0, 0.14)",
                boxSizing: "border-box",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  minHeight: 0,
                  padding: "1.9% 3.8% 4.1%",
                  flex: 1,
                  flexDirection: "column",
                  borderRadius: "4%",
                  background: "#fff6e0",
                  boxShadow: "inset 0 2px 6px rgba(197, 121, 32, 0.13)",
                  overflow: "hidden",
                }}
              >
                {!isLessonCard && (
                  <div
                    style={{
                      display: "flex",
                      height: "9.5%",
                      flexShrink: 0,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src={`/assets/activity-card-stars-${
                        isThirdActivity
                          ? topActivityStars
                          : isPuzzleActivity
                            ? leftActivityStars
                            : rightActivityStars
                      }.png`}
                      alt=""
                      style={{
                        width: "30.5%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    height: "10.2%",
                    marginTop: "1.3%",
                    paddingLeft: "4.7%",
                    flexShrink: 0,
                    alignItems: "stretch",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      padding: "0 3.5% 0 8%",
                      flex: isLessonCard ? "0 0 60%" : 1,
                      margin: isLessonCard ? "0 auto" : undefined,
                      alignItems: "center",
                      justifyContent: "center",
                      border: "2px solid #ffe993",
                      borderRadius: "999px",
                      background:
                        "linear-gradient(180deg, #ffd84d 0%, #ffb300 100%)",
                      boxShadow: "0 3px 4px rgba(106, 57, 0, 0.17)",
                    }}
                  >
                    <span
                      style={{
                        color: "#12275e",
                        fontFamily:
                          "Nunito, -apple-system, Roboto, Helvetica, sans-serif",
                        fontSize: isThirdActivity
                          ? "clamp(14px, 1.75vw, 26px)"
                          : "clamp(18px, 2.8vw, 40px)",
                        fontWeight: 900,
                        lineHeight: 1.1,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        width: isLessonCard ? "180px" : undefined,
                        padding: isLessonCard ? "0px" : undefined,
                      }}
                    >
                      {isLessonCard
                        ? "Lesson\u00a0\u00a0"
                        : isThirdActivity
                        ? "Match the Following"
                        : isPuzzleActivity
                          ? "Multiple Choice"
                          : "Drag and Drop"}
                    </span>
                  </div>
                  {!isLessonCard && (
                    <img
                      src={
                        isThirdActivity
                          ? assets.activityCheck
                          : isPuzzleActivity
                            ? assets.activityPuzzle
                            : assets.activityHand
                      }
                      alt=""
                      style={{
                        width: "13.5%",
                        height: "125%",
                        marginTop: "-1.3%",
                        marginLeft: "-1.3%",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </div>

                <img
                  src={
                    isLessonCard
                      ? lessonImage
                      : isThirdActivity
                      ? tickCorrectActivityImage
                      : isPuzzleActivity
                      ? puzzleActivityImage
                      : assets.dragDropActivity
                  }
                  alt={
                    isLessonCard
                      ? "Learning lesson illustration"
                      : isThirdActivity
                      ? "Child choosing the correct emotion"
                      : isPuzzleActivity
                      ? "Child matching picture puzzle cards"
                      : "Child completing a drag and drop activity"
                  }
                  style={{
                    minHeight: 0,
                    width: "100%",
                    marginTop: "1.9%",
                    flex: 1,
                    border: "2px solid #e7bc74",
                    borderRadius: "3.8%",
                    objectFit:
                      isLessonCard || isPuzzleActivity || isThirdActivity
                        ? "fill"
                        : "cover",
                    imageRendering: "auto",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    height: "12.7%",
                    marginTop: "1.9%",
                    padding: "1.9% 2% 1.9% 2.7%",
                    flexShrink: 0,
                    alignItems: "center",
                    gap: "2%",
                    border: "2px solid #a9d4f5",
                    borderRadius: "2.7%",
                    background: "#d9eefc",
                    overflow: "hidden",
                    boxSizing: "border-box",
                  }}
                >
                  <span
                    style={{
                      flex: 1,
                      color: "#12275e",
                      fontFamily:
                        "Nunito, -apple-system, Roboto, Helvetica, sans-serif",
                      fontSize: "clamp(9px, 1vw, 14px)",
                      fontWeight: 700,
                      lineHeight: 1.5,
                    }}
                  >
                    {isLessonCard
                      ? "Explore the lesson and learn something new."
                      : isThirdActivity
                      ? topActivityIsLocked
                        ? "Complete Activity 2 (Multiple Choice) to unlock this activity."
                        : "Match each picture with the correct answer."
                      : isPuzzleActivity
                        ? leftActivityIsLocked
                          ? "Complete Activity 1 (Drag & Drop) to unlock this activity."
                          : "Choose the correct answer for each question."
                        : rightActivityIsLocked
                          ? "Complete the Lesson first to unlock Activity 1."
                          : "Drag the correct item to the right place."}
                    <br />
                    {isLessonCard
                      ? "Press Start when you are ready to begin."
                      : isCurrentCardLocked
                        ? "Finish the preceding task to continue your journey."
                        : isThirdActivity
                          ? "This helps you connect words with their meanings."
                          : isPuzzleActivity
                            ? "This helps you recognize details and solve problems."
                            : "This helps you practice and remember what you have learned."}
                  </span>
                  <img
                    src={assets.speaker}
                    alt=""
                    style={{
                      width: "9%",
                      height: "80%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    height: "10.2%",
                    marginTop: "2.5%",
                    paddingBottom: "0.7%",
                    flexShrink: 0,
                    borderRadius: "999px",
                    background:
                      isCurrentCardLocked
                        ? "#8b1d24"
                        : "#084eac",
                    boxShadow: "0 3px 4px rgba(106, 57, 0, 0.17)",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "2.7%",
                      borderTop:
                        isCurrentCardLocked
                          ? "2px solid #ffb0a8"
                          : "2px solid #87c6ff",
                      borderRight:
                        isCurrentCardLocked
                          ? "1px solid #ffb0a8"
                          : "1px solid #87c6ff",
                      borderLeft:
                        isCurrentCardLocked
                          ? "1px solid #ffb0a8"
                          : "1px solid #87c6ff",
                      borderRadius: "999px",
                      background:
                        isCurrentCardLocked
                          ? "linear-gradient(180deg, #ff5a50 0%, #c51f2b 100%)"
                          : "linear-gradient(180deg, #3b9bff 0%, #0a62d6 100%)",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontFamily:
                          "Nunito, -apple-system, Roboto, Helvetica, sans-serif",
                        fontSize: "clamp(16px, 2.1vw, 30px)",
                        fontWeight: 900,
                      }}
                    >
                      {isCurrentCardLocked
                        ? "Locked"
                        : "Start"}
                    </span>
                    {isCurrentCardLocked ? (
                      <svg
                        width="24"
                        height="28"
                        viewBox="0 0 24 28"
                        fill="none"
                        aria-hidden="true"
                        style={{ width: "4.2%", height: "46%" }}
                      >
                        <rect
                          x="2"
                          y="11"
                          width="20"
                          height="15"
                          rx="3"
                          fill="white"
                        />
                        <path
                          d="M6.5 11V7.5C6.5 4.46 8.96 2 12 2C15.04 2 17.5 4.46 17.5 7.5V11"
                          stroke="white"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <circle cx="12" cy="18" r="2" fill="#c51f2b" />
                      </svg>
                    ) : (
                      <svg
                        width="28"
                        height="24"
                        viewBox="0 0 28 24"
                        fill="none"
                        aria-hidden="true"
                        style={{ width: "4.7%", height: "38%" }}
                      >
                        <path
                          d="M0 12H28M17.0435 24L28 12L17.0435 0"
                          stroke="white"
                          strokeWidth="4"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              <img
                src={assets.close}
                alt=""
                style={{
                  position: "absolute",
                  top: "-1.8%",
                  right: "-1%",
                  width: "10%",
                  height: "10%",
                  objectFit: "contain",
                }}
              />
            </div>
            <button
              className="close-button"
              type="button"
              aria-label="Close lesson"
              onClick={() => setLessonOpen(false)}
              style={{
                zIndex: 20,
                top: "-1.8%",
                right: "-1%",
                width: "10%",
                height: "10%",
                cursor: "pointer",
                pointerEvents: "auto",
                backgroundImage: `url(${assets.close})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />
            <button
              className="start-button"
              type="button"
              disabled={isCurrentCardLocked}
              aria-label={
                isLessonCard
                  ? "Start lesson"
                  : isThirdActivity
                  ? topActivityIsLocked
                    ? "Match the Following activity is locked"
                    : "Start Match the Following activity"
                  : isPuzzleActivity
                    ? leftActivityIsLocked
                      ? "Multiple Choice activity is locked"
                      : "Start Multiple Choice activity"
                    : rightActivityIsLocked
                      ? "Drag and Drop activity is locked"
                      : "Start Drag and Drop activity"
              }
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                color: "white",
                cursor:
                  isCurrentCardLocked
                    ? "not-allowed"
                    : "pointer",
                border: "none",
                borderTop:
                  isCurrentCardLocked
                    ? "2px solid #ffb0a8"
                    : "2px solid #87c6ff",
                background:
                  isCurrentCardLocked
                    ? "linear-gradient(180deg, #ff5a50 0%, #c51f2b 100%)"
                    : "linear-gradient(180deg, #3b9bff 0%, #0a62d6 100%)",
                boxShadow:
                  isCurrentCardLocked
                    ? "0 4px 0 #8b1d24"
                    : "0 4px 0 #084eac, 0 7px 4px rgba(106, 57, 0, 0.17)",
                fontFamily: '"Nunito:Black", Nunito, sans-serif',
                fontSize: "clamp(16px, 2.1vw, 30px)",
                fontWeight: 900,
                transition:
                  "transform 90ms ease, background 120ms ease, box-shadow 90ms ease",
                overflow: "hidden",
              }}
              onPointerEnter={(event) => {
                if (!event.currentTarget.disabled) {
                  event.currentTarget.style.background =
                    "linear-gradient(90deg, #65b2ff 0%, #1375e8 100%)"
                }
              }}
              onPointerDown={(event) => {
                if (!event.currentTarget.disabled) {
                  event.currentTarget.style.transform = "translateY(4px)"
                  event.currentTarget.style.background =
                    "linear-gradient(90deg, #0a62d6 0%, #1375e8 100%)"
                  event.currentTarget.style.boxShadow = "none"
                }
              }}
              onPointerUp={(event) => {
                if (!event.currentTarget.disabled) {
                  event.currentTarget.style.transform = "translateY(0)"
                  event.currentTarget.style.background =
                    "linear-gradient(90deg, #65b2ff 0%, #1375e8 100%)"
                  event.currentTarget.style.boxShadow =
                    "0 4px 0 #084eac, 0 7px 4px rgba(106, 57, 0, 0.17)"
                }
              }}
              onPointerLeave={(event) => {
                if (!event.currentTarget.disabled) {
                  event.currentTarget.style.transform = "translateY(0)"
                  event.currentTarget.style.background =
                    "linear-gradient(180deg, #3b9bff 0%, #0a62d6 100%)"
                  event.currentTarget.style.boxShadow =
                    "0 4px 0 #084eac, 0 7px 4px rgba(106, 57, 0, 0.17)"
                }
              }}
              onPointerCancel={(event) => {
                if (!event.currentTarget.disabled) {
                  event.currentTarget.style.transform = "translateY(0)"
                  event.currentTarget.style.background =
                    "linear-gradient(180deg, #3b9bff 0%, #0a62d6 100%)"
                  event.currentTarget.style.boxShadow =
                    "0 4px 0 #084eac, 0 7px 4px rgba(106, 57, 0, 0.17)"
                }
              }}
              onClick={() => {
                if (!isCurrentCardLocked) {
                  setOpenedActivity(activeActivity)
                }
              }}
            >
              <span>
                {isCurrentCardLocked ? "Locked" : "Start"}
              </span>
              {isCurrentCardLocked ? (
                <svg
                  width="24"
                  height="28"
                  viewBox="0 0 24 28"
                  fill="none"
                  aria-hidden="true"
                  style={{ width: "24px", height: "28px" }}
                >
                  <rect
                    x="2"
                    y="11"
                    width="20"
                    height="15"
                    rx="3"
                    fill="white"
                  />
                  <path
                    d="M6.5 11V7.5C6.5 4.46 8.96 2 12 2C15.04 2 17.5 4.46 17.5 7.5V11"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="18" r="2" fill="#c51f2b" />
                </svg>
              ) : (
                <img
                  src="/assets/938dd.svg"
                  alt=""
                  width="28"
                  height="24"
                  style={{ width: "28px", height: "24px" }}
                />
              )}
            </button>
          </aside>
        )}

        <img
          className="scenery scenery-foreground"
          src={assets.foreground}
          alt=""
        />

        <div className="asset-preloader" aria-hidden="true">
          <img src={assets.dragDropActivity} alt="" loading="eager" />
          <img src={puzzleActivityImage} alt="" loading="eager" />
          <img src={tickCorrectActivityImage} alt="" loading="eager" />
          <img src={lessonImage} alt="" loading="eager" />
          <img src={assets.speaker} alt="" loading="eager" />
          <img src={assets.close} alt="" loading="eager" />
          {progressStarImages.map((image) => (
            <img src={image} alt="" loading="eager" key={image} />
          ))}
          <img src={availableWindowSelected} alt="" />
          <img src={completedWindowSelected} alt="" />
          <img src={doorHover} alt="" />
          <img src={doorSelected} alt="" />
        </div>
      </section>
      {isLoading && (
        <section className="loading-screen" aria-live="polite">
          <div className="loading-orbit loading-orbit-one" />
          <div className="loading-orbit loading-orbit-two" />
          <div className="loading-card">
            <div className="loading-mark">
              <span />
              <span />
              <span />
            </div>
            <h1>NeuroNest</h1>
            <p>Preparing your learning adventure…</p>
            <div
              className="loading-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={loadingProgress}
            >
              <span style={{ width: `${loadingProgress}%` }} />
            </div>
            <strong>{loadingProgress}%</strong>
          </div>
        </section>
      )}
    </main>
  )
}
