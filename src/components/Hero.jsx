import { motion, useScroll, useTransform } from "framer-motion"

const Hero = () => {

  const { scrollY } = useScroll()

  const opacity = useTransform(scrollY, [0, 500], [1, 0])
  const y = useTransform(scrollY, [0, 500], [0, -60])

  return (
    <motion.section
      style={{ opacity, y }}
      className="
        min-h-[calc(100vh-80px)]
        flex
        items-center
        justify-center
        text-center
        px-6
      "
    >

      <div className="max-w-4xl">

        <div
          className="
            inline-flex
            text-xs
            tracking-widest
            uppercase
            border border-purple-500/30
            text-purple-400
            px-4 py-1
            rounded-full
            mb-6
          "
        >
          AI Financial Intelligence
        </div>

        <h1
          className="
            text-5xl md:text-7xl
            font-semibold
            tracking-tight
            leading-tight
            max-w-4xl
            mx-auto
          "
        >
          Understand Market Sentiment
          <span className="block text-purple-400">
            Before the Market Moves
          </span>
        </h1>

        <p
          className="
            mt-8
            text-lg
            text-zinc-400
            max-w-2xl
            mx-auto
            leading-relaxed
          "
        >
          StockPulse analyzes financial news using FinBERT to detect sentiment,
          hype signals, risk language and narrative drivers across the market.
        </p>

      </div>

    </motion.section>
  )
}

export default Hero