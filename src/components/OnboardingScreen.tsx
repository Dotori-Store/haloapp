import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import boardingHero01 from '../assets/images/boarding-01-hero.png'
import boardingHero02 from '../assets/images/boarding-02-hero.png'
import boardingHero03 from '../assets/images/boarding-03-hero.png'
import boardingHero04 from '../assets/images/boarding-04-hero.png'
import './Onboarding.css'

type OnboardingSlide = {
  id: string
  hero: string
  titleKey: string
  descriptionKey: string
}

type OnboardingScreenProps = {
  visible: boolean
  onFinish: () => void
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 'pork-free-map',
    hero: boardingHero01,
    titleKey: 'onboarding.slide1Title',
    descriptionKey: 'onboarding.slide1Description',
  },
  {
    id: 'curated-friends',
    hero: boardingHero02,
    titleKey: 'onboarding.slide2Title',
    descriptionKey: 'onboarding.slide2Description',
  },
  {
    id: 'discover-spots',
    hero: boardingHero03,
    titleKey: 'onboarding.slide3Title',
    descriptionKey: 'onboarding.slide3Description',
  },
  {
    id: 'add-more-spots',
    hero: boardingHero04,
    titleKey: 'onboarding.slide4Title',
    descriptionKey: 'onboarding.slide4Description',
  },
]

export function OnboardingScreen({ visible, onFinish }: OnboardingScreenProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)

  if (!visible) {
    return null
  }

  const currentSlide = onboardingSlides[step] ?? onboardingSlides[0]

  const handleContinue = () => {
    setStep((currentStep) => {
      if (currentStep < onboardingSlides.length - 1) {
        return currentStep + 1
      }

      onFinish()
      return currentStep
    })
  }

  const isLastSlide = step >= onboardingSlides.length - 1

  return (
    <section className="onboarding-screen" aria-labelledby="onboarding-title">
      <div className="onboarding-slide" key={currentSlide.id}>
        <img className="onboarding-slide__hero" src={currentSlide.hero} alt="" aria-hidden="true" />
        <div className="onboarding-slide__content">
          <h1 id="onboarding-title">{t(currentSlide.titleKey)}</h1>
          <p>{t(currentSlide.descriptionKey)}</p>
        </div>
      </div>

      <button type="button" className="onboarding-screen__continue" onClick={handleContinue}>
        {isLastSlide ? t('onboarding.getStarted') : t('onboarding.continue')}
      </button>
    </section>
  )
}
