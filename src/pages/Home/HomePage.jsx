import ActivitySection from "./sections/ActivitySection"
import FactionSection from "./sections/FactionSection"
import HeroSection from "./sections/HeroSection"
import IndustrySection from "./sections/IndustrySection"
import NewsSection from "./sections/NewsSection"
import StatsSection from "./sections/StatsSection"

function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <NewsSection />
      <IndustrySection />
      <FactionSection />
      <ActivitySection />
    </>
  )
}

export default HomePage