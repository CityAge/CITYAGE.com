import { Check, Activity, Globe, TrendingUp, Shield, Zap, Database } from "lucide-react"

const tools = [
  {
    name: "Urban Flow Analytics",
    description: "Real-time population movement and density modeling across 247 metropolitan areas.",
    status: "Active",
    icon: Activity,
  },
  {
    name: "Trade Corridor Intelligence",
    description: "Predictive logistics for global shipping lanes, ports, and freight networks.",
    status: "Active",
    icon: Globe,
  },
  {
    name: "Capital Flow Monitor",
    description: "Institutional investment tracking across infrastructure and real estate sectors.",
    status: "Active",
    icon: TrendingUp,
  },
  {
    name: "Risk Assessment Engine",
    description: "Multi-factor geopolitical and environmental risk scoring for urban assets.",
    status: "Active",
    icon: Shield,
  },
  {
    name: "Energy Grid Optimizer",
    description: "Smart grid demand forecasting and renewable integration modeling.",
    status: "Beta",
    icon: Zap,
  },
  {
    name: "Data Synthesis Layer",
    description: "Unified API access to all intelligence streams with custom query capabilities.",
    status: "Active",
    icon: Database,
  },
]

const metrics = [
  { label: "API Uptime", value: "99.97%", trend: "+0.02%" },
  { label: "Latency", value: "12ms", trend: "-3ms" },
  { label: "Daily Queries", value: "4.2M", trend: "+18%" },
  { label: "Data Sources", value: "1,247", trend: "+23" },
]

export function IntelligenceStack() {
  return (
    <section id="intelligence" className="py-24 bg-dark">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="mb-12 pb-6 border-b border-gold/20">
          <span className="font-mono text-xs text-gold tracking-[0.3em] uppercase mb-2 block">
            Platform Capabilities
          </span>
          <h3 className="text-cream text-3xl md:text-4xl font-bold">
            The Intelligence Stack
          </h3>
        </div>
        
        {/* Bento Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Tools Grid - 2 cols */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            {tools.map((tool, index) => {
              const Icon = tool.icon
              return (
                <div 
                  key={index}
                  className="bg-dark-elevated border border-border p-6 hover:border-gold/40 transition-colors group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 bg-gold/10 border border-gold/20">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-gold" />
                      <span className="font-mono text-[10px] text-gold tracking-wider">
                        {tool.status === "Beta" ? "BETA" : "VERIFIED"}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-cream font-semibold mb-2 group-hover:text-gold transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-cream/50 text-sm leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              )
            })}
          </div>
          
          {/* System Status Panel */}
          <div className="bg-dark-elevated border border-gold/30 p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-gold font-semibold">System Status</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-mono text-xs text-green-500 tracking-wider">
                  OPERATIONAL
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              {metrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <span className="font-mono text-xs text-cream/50 uppercase tracking-wider">
                    {metric.label}
                  </span>
                  <div className="text-right">
                    <div className="font-mono text-lg text-cream font-semibold">
                      {metric.value}
                    </div>
                    <div className="font-mono text-[10px] text-gold">
                      {metric.trend}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border">
              <button className="w-full py-3 bg-gold/10 border border-gold/30 text-gold font-mono text-xs tracking-widest uppercase hover:bg-gold/20 transition-colors">
                View Full Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
