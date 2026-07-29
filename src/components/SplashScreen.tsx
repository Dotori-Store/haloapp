import appSymbol from '../assets/app-symbol.png'
import './SplashScreen.css'

type SplashScreenProps = {
  visible: boolean
}

export function SplashScreen({ visible }: SplashScreenProps) {
  if (!visible) {
    return null
  }

  return (
    <div className="splash-screen" role="img" aria-label="halo">
      <img src={appSymbol} alt="" aria-hidden="true" />
    </div>
  )
}
