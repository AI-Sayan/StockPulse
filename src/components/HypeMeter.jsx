export default function HypeMeter({ hypeLevel, hypeRatio, onClick }) {

  const config = {
    calm: {
      color: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      msg: "News coverage appears factual and measured."
    },
    "mild hype": {
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      msg: "Some emotionally charged language detected. Interpret cautiously."
    },
    "high hype": {
      color: "text-red-400",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      msg: "High emotional intensity detected. Coverage may be driven by narrative rather than fundamentals."
    }
  }

  const c = config[hypeLevel] || config["calm"]

  return (
    <div
      className="
        w-full
        bg-white/5
        backdrop-blur-md
        border border-white/10
        rounded-xl
        p-6
        text-white
        transition
        hover:border-purple-500/30
      "
    >

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm tracking-widest uppercase text-purple-400 font-semibold">
          Hype Analysis
        </h2>
        <div className="h-[1px] flex-1 ml-4 bg-gradient-to-r from-purple-500/40 to-transparent"></div>
      </div>

      <div
        className={`
          ${c.bg}
          border ${c.border}
          rounded-xl
          p-6
          text-center
          mb-4
        `}
      >

        <p className={`text-2xl font-semibold tracking-wide uppercase ${c.color}`}>
          {hypeLevel}
        </p>

        <p className="text-[11px] text-zinc-400 mt-2 tracking-wide">
          Emotional language score
        </p>

        <p className="text-lg font-semibold mt-1">
          {hypeRatio.toFixed(2)}
        </p>

      </div>

      <p className="text-sm text-zinc-300 leading-relaxed">
        {c.msg}
      </p>
      <button
        onClick={onClick}
        className="mt-4 w-full py-2 text-xs font-orbitron tracking-widest text-cyan-500/60 border border-cyan-500/10 rounded-lg hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-cyan-500/5 transition-all"
      >
        VIEW DEEP ANALYSIS →
      </button>
    </div>
  )
}