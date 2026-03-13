import { motion, AnimatePresence } from "framer-motion"

const getCurrency = (ticker) => {
    if (!ticker) return "₹"
    const t = ticker.toUpperCase()
    return t.endsWith(".NS") || t.endsWith(".BO") ? "₹" : "$"
}

const Section = ({ title, children }) => (
    <div className="mb-6">
        <p className="text-xs font-orbitron text-cyan-500/70 tracking-widest mb-3 uppercase">{title}</p>
        {children}
    </div>
)

const Stat = ({ label, value, color = "text-white" }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className="text-zinc-500 text-xs font-orbitron tracking-wider">{label}</span>
        <span className={`text-sm font-bold font-orbitron ${color}`}>{value}</span>
    </div>
)

const Row = ({ label, value, color }) => (
    <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3">
        <p className={`font-orbitron text-xs tracking-wider mb-1 ${color}`}>{label}</p>
        <p className="text-zinc-400 text-xs leading-relaxed">{value}</p>
    </div>
)

const Callout = ({ color, children }) => {
    const styles = {
        green:  "bg-green-950/30 border-green-500/30 text-green-300",
        yellow: "bg-yellow-950/30 border-yellow-500/30 text-yellow-300",
        red:    "bg-red-950/30 border-red-500/30 text-red-300",
    }
    return (
        <div className={`border rounded-xl p-4 text-sm leading-relaxed ${styles[color]}`}>
            {children}
        </div>
    )
}

const PriceContent = ({ data }) => {
    const currency = getCurrency(data?.ticker)
    return (
        <>
            <h2 className="font-orbitron text-white text-lg tracking-wider mb-1">{data?.ticker}</h2>
            <p className="text-zinc-500 text-xs font-orbitron tracking-widest mb-6">PRICE OVERVIEW</p>
            <Section title="Current Price">
                <Stat label="Price" value={`${currency}${data?.price}`} />
                <Stat
                    label="Change"
                    value={`${data?.change >= 0 ? "+" : ""}${data?.change} (${data?.change_percent}%)`}
                    color={data?.change >= 0 ? "text-green-400" : "text-red-400"}
                />
            </Section>
            <Section title="Moving Averages">
                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    Moving averages smooth out daily price noise to reveal the underlying trend direction.
                </p>
                <Stat label="MA20" value={data?.ma20 ? `${currency}${data.ma20}` : "N/A"} />
                <Stat label="MA50" value={data?.ma50 ? `${currency}${data.ma50}` : "N/A"} />
            </Section>
            <Section title="What This Means">
                {data?.ma20 && data?.ma50 ? (
                    data.ma20 > data.ma50 ? (
                        <Callout color="green">
                            MA20 is above MA50, a Golden Cross setup. Short-term momentum is outpacing
                            the longer-term trend, typically a bullish signal.
                        </Callout>
                    ) : (
                        <Callout color="red">
                            MA20 is below MA50, a Death Cross setup. Short-term momentum is lagging
                            the longer-term trend, typically bearish.
                        </Callout>
                    )
                ) : (
                    <Callout color="yellow">
                        Not enough historical data to compute both moving averages reliably.
                    </Callout>
                )}
            </Section>
            <Section title="How to Use This">
                <ul className="text-zinc-400 text-sm space-y-2 leading-relaxed list-disc list-inside">
                    <li>Use MA20 for short-term swing trade entries and exits</li>
                    <li>Use MA50 as a medium-term trend filter</li>
                    <li>A price bouncing off MA50 is often a strong support signal</li>
                    <li>Never rely on moving averages alone, combine with volume and sentiment</li>
                </ul>
            </Section>
        </>
    )
}

const SentimentContent = ({ data }) => (
    <>
        <h2 className="font-orbitron text-white text-lg tracking-wider mb-1">AI Sentiment</h2>
        <p className="text-zinc-500 text-xs font-orbitron tracking-widest mb-6">FINBERT ANALYSIS</p>
        <Section title="Overall Score">
            <Stat
                label="Score"
                value={data?.overall_score != null
                    ? `${data.overall_score >= 0 ? "+" : ""}${data.overall_score.toFixed(3)}`
                    : "N/A"
                }
                color={data?.overall_score > 0.2 ? "text-green-400" : data?.overall_score < -0.2 ? "text-red-400" : "text-yellow-400"}
            />
            <Stat label="Label" value={data?.overall_label?.toUpperCase() ?? "N/A"} />
        </Section>
        <Section title="What is FinBERT?">
            <p className="text-zinc-400 text-sm leading-relaxed">
                FinBERT is a BERT model fine-tuned on financial news. It understands phrases
                like "missed estimates" and "beat expectations" far better than generic sentiment tools.
            </p>
        </Section>
        <Section title="Score Interpretation">
            <div className="space-y-2">
                <Row label="Above +0.3"   value="Strongly Bullish — consensus positive across headlines" color="text-green-400" />
                <Row label="+0.1 to +0.3" value="Mildly Bullish — cautiously positive news"              color="text-green-300" />
                <Row label="-0.1 to +0.1" value="Neutral — mixed or inconclusive headlines"              color="text-yellow-400" />
                <Row label="-0.3 to -0.1" value="Mildly Bearish — some negative signals"                 color="text-red-300" />
                <Row label="Below -0.3"   value="Strongly Bearish — dominant negative sentiment"         color="text-red-400" />
            </div>
        </Section>
        <Section title="Label Counts">
            <Stat label="Positive" value={data?.label_counts?.positive ?? 0} color="text-green-400" />
            <Stat label="Neutral"  value={data?.label_counts?.neutral  ?? 0} color="text-yellow-400" />
            <Stat label="Negative" value={data?.label_counts?.negative ?? 0} color="text-red-400" />
        </Section>
        <Section title="Limitations">
            <Callout color="yellow">
                Sentiment is based only on recent headlines. A positive score does not guarantee
                price movement. Always cross-reference with price action and divergence insight.
            </Callout>
        </Section>
    </>
)

const TopicsContent = ({ data }) => (
    <>
        <h2 className="font-orbitron text-white text-lg tracking-wider mb-1">Sentiment Drivers</h2>
        <p className="text-zinc-500 text-xs font-orbitron tracking-widest mb-6">TOPIC BREAKDOWN</p>
        <Section title="What Are Topic Scores?">
            <p className="text-zinc-400 text-sm leading-relaxed">
                Headlines are grouped by topic keywords. Each topic gets an average FinBERT
                score showing which area is driving positive or negative sentiment.
            </p>
        </Section>
        <Section title="Topic Scores">
            {data?.topic_sentiment && Object.keys(data.topic_sentiment).length > 0 ? (
                <div className="space-y-4">
                    {Object.entries(data.topic_sentiment).map(([topic, score]) => (
                        <div key={topic}>
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-orbitron text-zinc-400 uppercase tracking-widest">{topic}</span>
                                <span className={`text-xs font-bold font-orbitron ${score > 0.2 ? "text-green-400" : score < -0.2 ? "text-red-400" : "text-yellow-400"}`}>
                                    {score > 0 ? "+" : ""}{score.toFixed(3)}
                                </span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-1.5">
                                <div
                                    className={`h-1.5 rounded-full ${score > 0.2 ? "bg-green-500" : score < -0.2 ? "bg-red-500" : "bg-yellow-500"}`}
                                    style={{ width: `${Math.min(Math.abs(score) * 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-zinc-600 text-xs mt-1">
                                {score > 0.2 ? "Positive coverage supporting overall sentiment."
                                : score < -0.2 ? "Negative coverage weighing on sentiment."
                                : "Mixed or inconclusive coverage."}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <Callout color="yellow">No topic data available for this stock.</Callout>
            )}
        </Section>
        <Section title="How to Use This">
            <ul className="text-zinc-400 text-sm space-y-2 leading-relaxed list-disc list-inside">
                <li>A single topic dragging sentiment low may be temporary</li>
                <li>If earnings and management are both negative, the risk is more structural</li>
                <li>A positive score in revenue or growth is a strong bullish signal</li>
            </ul>
        </Section>
    </>
)

const HypeContent = ({ data }) => (
    <>
        <h2 className="font-orbitron text-white text-lg tracking-wider mb-1">Hype-O-Meter</h2>
        <p className="text-zinc-500 text-xs font-orbitron tracking-widest mb-6">EMOTIONAL LANGUAGE DETECTOR</p>
        <Section title="Current Reading">
            <Stat label="Level"      value={data?.hype_level?.toUpperCase() ?? "N/A"} />
            <Stat label="Hype Score" value={data?.hype_ratio != null ? `${data.hype_ratio.toFixed(3)} per headline` : "N/A"} />
        </Section>
        <Section title="What is the Hype Score?">
            <p className="text-zinc-400 text-sm leading-relaxed">
                Measures density of emotionally charged words like soar, crash, skyrocket,
                plunge across all headlines. High hype correlates with increased volatility
                and less reliable sentiment scores.
            </p>
        </Section>
        <Section title="Level Interpretation">
            <div className="space-y-3">
                <Row label="Calm"      value="Factual reporting. Sentiment scores are reliable."         color="text-green-400" />
                <Row label="Mild Hype" value="Some emotional language. Treat sentiment with caution."    color="text-yellow-400" />
                <Row label="High Hype" value="Heavy sensationalism. Sentiment may be inflated/deflated." color="text-red-400" />
            </div>
        </Section>
        <Section title="Why It Matters">
            <Callout color="yellow">
                During high hype periods, FinBERT scores can be misleading. Treat
                hype-inflated sentiment with extra scepticism.
            </Callout>
        </Section>
    </>
)

const RiskContent = ({ data }) => (
    <>
        <h2 className="font-orbitron text-white text-lg tracking-wider mb-1">Risk Scanner</h2>
        <p className="text-zinc-500 text-xs font-orbitron tracking-widest mb-6">KEYWORD RISK DETECTION</p>
        <Section title="Detected Risk Terms">
            {data?.risk_terms && Object.keys(data.risk_terms).length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(data.risk_terms).map(([word, count]) => (
                        <span key={word} className="bg-red-950/50 border border-red-500/30 text-red-300 text-xs px-3 py-1.5 rounded-lg font-orbitron">
                            {word.toUpperCase()} x{count}
                        </span>
                    ))}
                </div>
            ) : (
                <Callout color="green">No risk keywords found in recent headlines.</Callout>
            )}
        </Section>
        <Section title="How Risk Detection Works">
            <p className="text-zinc-400 text-sm leading-relaxed">
                Scans for high-risk terms like fraud, lawsuit, default, probe, bankruptcy,
                SEC across all headlines. Higher frequency means the risk theme is recurring.
            </p>
        </Section>
        <Section title="How to Interpret">
            <ul className="text-zinc-400 text-sm space-y-2 list-disc list-inside leading-relaxed">
                <li>One risk term mention may be routine reporting</li>
                <li>Multiple unique risk terms together signals elevated concern</li>
                <li>Regulatory terms like SEC or probe carry higher weight</li>
                <li>Risk terms paired with positive sentiment may mean resolution</li>
            </ul>
        </Section>
    </>
)

const DivergenceContent = ({ data }) => (
    <>
        <h2 className="font-orbitron text-white text-lg tracking-wider mb-1">AI Divergence Insight</h2>
        <p className="text-zinc-500 text-xs font-orbitron tracking-widest mb-6">PRICE VS SENTIMENT</p>
        <Section title="Current Insight">
            <p className="text-zinc-300 text-sm leading-relaxed p-4 bg-white/[0.03] border border-white/5 rounded-xl">
                {data?.divergence_comment ?? "No divergence data available."}
            </p>
        </Section>
        <Section title="What is Divergence Analysis?">
            <p className="text-zinc-400 text-sm leading-relaxed">
                Compares the direction of news sentiment with recent price movement.
                When aligned the signal is more reliable. When they contradict, it can
                indicate a potential reversal or irrational market behaviour.
            </p>
        </Section>
        <Section title="The Four Key Scenarios">
            <div className="space-y-3">
                <Row label="Price up + Positive"   value="Aligned bull signal. Most reliable setup."             color="text-green-400" />
                <Row label="Price up + Negative"   value="Bearish divergence. Rally may not be sustainable."     color="text-red-400" />
                <Row label="Price down + Positive" value="Bullish divergence. Potential dip-buying opportunity." color="text-yellow-400" />
                <Row label="Price down + Negative" value="Aligned bear signal. Avoid until stabilisation."       color="text-red-400" />
            </div>
        </Section>
        <Section title="Important Caveat">
            <Callout color="yellow">
                Generated from a 5-day price window and most recent headlines only.
                Short-term divergences can be noise. Not a trading signal.
            </Callout>
        </Section>
    </>
)

const PANELS = {
    price:      PriceContent,
    sentiment:  SentimentContent,
    topics:     TopicsContent,
    hype:       HypeContent,
    risk:       RiskContent,
    divergence: DivergenceContent,
}

export default function DetailPanel({ type, data, onClose }) {
    const Content = PANELS[type]

    return (
        <AnimatePresence>
            {type && data && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-zinc-800 z-50 overflow-y-auto"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 280 }}
                    >
                        <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex justify-between items-center z-10">
                            <span className="text-xs font-orbitron text-zinc-600 tracking-widest">DEEP ANALYSIS</span>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-600 transition-all font-orbitron text-sm"
                            >
                                X
                            </button>
                        </div>
                        <div className="px-6 py-6">
                            {Content ? <Content data={data} /> : null}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
