import { useEffect, useRef, useState } from "react"
import { neuronestIcons } from "./neuronestIcons"

type LessonSlidesProps = {
  onBack: () => void
  onStartActivities: () => void
}

const imageRoot = "/module1_lesson_slides/images"
const elementRoot = "/module1_lesson_slides/elements"

const emotionSlides = [
  {
    name: "Happy",
    text: "I feel happy when something makes me feel good.",
    image: "happy_01.png",
    color: "#ff496d",
  },
  {
    name: "Sad",
    text: "I feel sad when something makes me feel unhappy.",
    image: "sad_02.png",
    color: "#3989f5",
  },
  {
    name: "Angry",
    text: "I feel angry when something upsets me.",
    image: "angry_03.png",
    color: "#e44955",
  },
  {
    name: "Sicky",
    text: "I feel sicky when my body doesn't feel well.",
    image: "sicky_04.png",
    color: "#2d98aa",
  },
  {
    name: "Nervous",
    text: "I feel nervous when something feels new or different.",
    image: "nervous_05.png",
    color: "#f3a92e",
  },
  {
    name: "Grumpy",
    text: "I feel grumpy when something isn't going the way I want it to.",
    image: "grumpy_06.png",
    color: "#a66b4c",
  },
  {
    name: "Calm",
    text: "I feel calm when I feel peaceful and relaxed.",
    image: "calm_07.png",
    color: "#45a568",
  },
  {
    name: "Funny",
    text: "I feel funny when something makes me want to laugh or be silly.",
    image: "funny_08.png",
    color: "#d94d9d",
  },
  {
    name: "Excited",
    text: "I feel excited when something makes me feel very happy and full of energy.",
    image: "excited_09.png",
    color: "#ff6039",
  },
  {
    name: "Surprised",
    text: "I feel surprised when something happens that I did not expect.",
    image: "surprised_10.png",
    color: "#a565df",
  },
]

const recapTints = [
  "#fff2c9",
  "#c5d7f7",
  "#f4c4c5",
  "#bddae1",
  "#fce6c1",
  "#e3d1c8",
  "#c5ddcc",
  "#f3c3e0",
  "#f2caba",
  "#e3cef4",
]

export const lessonImageUrls = [
  `${imageRoot}/Title_screen_image.png`,
  `${imageRoot}/success_screen_image.png`,
  ...emotionSlides.map((slide) => `${imageRoot}/${slide.image}`),
  `${elementRoot}/blue_flower.png`,
  `${elementRoot}/left_bush.png`,
  `${elementRoot}/light_purple_heart.png`,
  `${elementRoot}/purple_flower.png`,
  `${elementRoot}/purple_heart.png`,
  `${elementRoot}/right_bush.png`,
  `${elementRoot}/star_success_page.png`,
  `${elementRoot}/wave1.png`,
  `${elementRoot}/wave2.png`,
  `${elementRoot}/wave3.png`,
  `${elementRoot}/yellow_flower.png`,
]

function LessonDecor() {
  return (
    <>
      <img
        className="lesson-wave lesson-wave-one"
        src={`${elementRoot}/wave1.png`}
        alt=""
      />
      <img
        className="lesson-wave lesson-wave-two"
        src={`${elementRoot}/wave2.png`}
        alt=""
      />
      <img
        className="lesson-wave lesson-wave-three"
        src={`${elementRoot}/wave3.png`}
        alt=""
      />
      <img
        className="lesson-bush lesson-bush-left"
        src={`${elementRoot}/left_bush.png`}
        alt=""
      />
      <img
        className="lesson-bush lesson-bush-right"
        src={`${elementRoot}/right_bush.png`}
        alt=""
      />
      <img
        className="lesson-float lesson-heart-one"
        src={`${elementRoot}/purple_heart.png`}
        alt=""
      />
      <img
        className="lesson-float lesson-heart-two"
        src={`${elementRoot}/light_purple_heart.png`}
        alt=""
      />
      <img
        className="lesson-float lesson-flower-one"
        src={`${elementRoot}/yellow_flower.png`}
        alt=""
      />
      <img
        className="lesson-float lesson-flower-two"
        src={`${elementRoot}/purple_flower.png`}
        alt=""
      />
      <img
        className="lesson-float lesson-flower-three"
        src={`${elementRoot}/blue_flower.png`}
        alt=""
        style={{ zIndex: 20 }}
      />
    </>
  )
}

function BackIcon() {
  return (
    <img
      className="lesson-icon-image"
      src={neuronestIcons.left}
      alt=""
      aria-hidden="true"
    />
  )
}

function SpeakerIcon() {
  return (
    <img
      className="lesson-icon-image"
      src={neuronestIcons.sound}
      alt=""
      aria-hidden="true"
    />
  )
}

export default function LessonSlides({
  onBack,
  onStartActivities,
}: LessonSlidesProps) {
  const retainedLessonImages = useRef<HTMLImageElement[]>([])
  const [lessonReady, setLessonReady] = useState(false)
  const [slide, setSlide] = useState(0)
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    let cancelled = false
    const loadImage = (src: string) =>
      new Promise<void>((resolve) => {
        const image = new Image()
        retainedLessonImages.current.push(image)
        let finished = false
        const finish = async () => {
          if (finished) return
          finished = true
          try {
            await image.decode()
          } catch {
            // A cached image may reject decode after it has already rendered.
          }
          resolve()
        }
        image.onload = finish
        image.onerror = finish
        image.src = src
        if (image.complete) void finish()
      })

    void Promise.all([
      Promise.all(lessonImageUrls.map(loadImage)),
      document.fonts.ready,
    ]).then(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (!cancelled) setLessonReady(true)
        })
      })
    })

    return () => {
      cancelled = true
    }
  }, [])

  const lessonAssetCache = (
    <div className="lesson-asset-cache" aria-hidden="true">
      {lessonImageUrls.map((image) => (
        <img src={image} alt="" loading="eager" key={image} />
      ))}
    </div>
  )

  const lessonLoadingOverlay = !lessonReady && (
    <div className="lesson-page-loading" role="status" aria-live="polite">
      <div className="lesson-loading-mark">
        <span />
        <span />
        <span />
      </div>
      <strong>Preparing lesson…</strong>
    </div>
  )

  const getSpokenText = () => {
    if (completed) return "Well done! You completed this lesson."
    if (slide === 0) {
      return "Welcome to Emotions! We all have different feelings. Let's learn about them together!"
    }
    if (slide === 11) {
      return `Let's remember! Can you remember these emotions? ${emotionSlides
        .map((emotion) => emotion.name)
        .join(", ")}.`
    }
    const emotion = emotionSlides[slide - 1]
    return `${emotion.name}. ${emotion.text}`
  }

  const speak = () => {
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(getSpokenText()))
  }

  const next = () => {
    if (slide === 11) {
      setCompleted(true)
    } else {
      setSlide((current) => current + 1)
    }
  }

  const previous = () => {
    if (slide === 0) {
      onBack()
    } else {
      setSlide((current) => current - 1)
    }
  }

  if (completed) {
    return (
      <main className="lesson-screen">
        {lessonAssetCache}
        <LessonDecor />
        <section className="lesson-frame lesson-success">
          <button className="lesson-round-button lesson-back" onClick={onBack}>
            <BackIcon />
            <span className="sr-only">Return home</span>
          </button>
          <button className="lesson-round-button lesson-sound" onClick={speak}>
            <SpeakerIcon />
            <span className="sr-only">Read this slide aloud</span>
          </button>
          <img
            className="lesson-success-child"
            src={`${imageRoot}/success_screen_image.png`}
            alt="Happy child celebrating with a puppy"
          />
          <div className="lesson-success-copy">
            <img src={`${elementRoot}/star_success_page.png`} alt="" />
            <h1>
              Well <span>Done!</span>
            </h1>
            <p>You completed this lesson!</p>
          </div>
          <button
            className="lesson-nav lesson-start-activities"
            type="button"
            onClick={onStartActivities}
          >
            Start Activities <span className="nav-arrow" />
          </button>
        </section>
        {lessonLoadingOverlay}
      </main>
    )
  }

  return (
    <main className="lesson-screen">
      {lessonAssetCache}
      <LessonDecor />
      <section
        className={`lesson-frame${slide === 11 ? " is-recap" : ""}`}
      >
        <button className="lesson-round-button lesson-back" onClick={onBack}>
          <BackIcon />
          <span className="sr-only">Return home</span>
        </button>
        <strong className="lesson-counter">{slide + 1} / 12</strong>
        <button className="lesson-round-button lesson-sound" onClick={speak}>
          <SpeakerIcon />
          <span className="sr-only">Read this slide aloud</span>
        </button>

        {slide === 0 && (
          <div className="lesson-main lesson-welcome">
            <div className="lesson-image-panel">
              <img
                src={`${imageRoot}/Title_screen_image.png`}
                alt="Four children welcoming learners"
              />
            </div>
            <div className="lesson-copy lesson-welcome-copy">
              <h1>
                Welcome to <span>Emotions!</span>
              </h1>
              <p>
                We all have different feelings. Let&apos;s learn about them
                together!
              </p>
            </div>
          </div>
        )}

        {slide > 0 && slide < 11 && (
          <div className="lesson-main lesson-emotion">
            <div className="lesson-image-panel">
              <img
                src={`${imageRoot}/${emotionSlides[slide - 1].image}`}
                alt={`${emotionSlides[slide - 1].name} emotion`}
              />
            </div>
            <div className="lesson-copy lesson-emotion-copy">
              <h1 style={{ background: emotionSlides[slide - 1].color }}>
                {emotionSlides[slide - 1].name}
              </h1>
              <span className="lesson-divider" />
              <p>{emotionSlides[slide - 1].text}</p>
            </div>
          </div>
        )}

        {slide === 11 && (
          <div className="lesson-recap" style={{ top: "10%" }}>
            <h1>
              Let&apos;s <span>Remember!</span>
            </h1>
            <div className="recap-grid">
              {emotionSlides.map((emotion, index) => (
                <div className="recap-item" key={emotion.name}>
                  <div style={{ background: recapTints[index] }}>
                    <img
                      src={`${imageRoot}/${emotion.image}`}
                      alt={emotion.name}
                    />
                  </div>
                  <strong style={{ background: recapTints[index] }}>
                    {emotion.name}
                  </strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          className="lesson-nav lesson-previous"
          type="button"
          onClick={previous}
        >
          <span className="lesson-back-arrow" aria-hidden="true" /> Previous
        </button>
        <button className="lesson-nav lesson-next" type="button" onClick={next}>
          {slide === 11 ? "Continue" : "Next"} <span className="nav-arrow" />
        </button>
      </section>
      {lessonLoadingOverlay}
    </main>
  )
}
