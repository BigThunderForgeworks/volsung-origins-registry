import ActivitySection from "./sections/ActivitySection"
import FactionSection from "./sections/FactionSection"
import HeroSection from "./sections/HeroSection"
import IndustrySection from "./sections/IndustrySection"
import StatsSection from "./sections/StatsSection"

function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <IndustrySection />
      <FactionSection />
      <ActivitySection />
    </>
  )
}

export default HomePage