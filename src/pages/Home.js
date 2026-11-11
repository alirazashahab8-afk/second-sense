import React from 'react';
import { Link } from 'react-router-dom';
import { Battery, ShoppingCart, Recycle, Zap, Leaf, TrendingUp, ArrowRight, ChevronDown, AlertCircle, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - UNESCO-inspired with full-bleed image */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-end pb-20">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(10, 40, 30, 0.88) 0%, rgba(0, 90, 60, 0.75) 50%, rgba(0, 0, 0, 0.65) 100%), url("/images/banner.png")`,
          }}
        >
          {/* Subtle animated texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Logo - Top Left - Fixed position to avoid overlap */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent pt-6 pb-12 z-20">
          <div className="container mx-auto px-6 md:px-12">
            <img
              src="/images/logo.png"
              alt="Second Sense Logo"
              className="w-42 md:w-48 h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] mb-20"
            />

          </div>
        </div>

        {/* Hero Content - Positioned at bottom to avoid logo */}
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-5xl">
            {/* Tag Badge */}
              
              <div className="inline-flex items-center gap-2.5 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full mb-6 mt-[100px]">
                <Leaf className="w-4 h-4 text-[#7FFF9F]" />
                <span className="text-xs font-semibold text-white uppercase tracking-[0.15em] font-['Inter']">
                  Sustainable Energy Solutions
                </span>
              </div>
            
            {/* Main Headline - UNESCO style large typography */}
            <h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-5 leading-[1.05] tracking-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Second Sense
            </h1>

            {/* Subheadline */}
            <p
              className="text-2xl md:text-4xl lg:text-5xl font-medium text-white/95 mb-6 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Second life + decision sense
            </p>

            {/* Description - Editorial style */}
            <p
              className="text-lg md:text-xl text-white/90 max-w-3xl mb-10 leading-relaxed font-light"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Compare new (virgin), recycled-content and repurposed EV batteries on cost, carbon emissions and usable energy lifetime.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link to="/sell">
                <Button
                  data-testid="sell-battery-btn"
                  className="group bg-[#00C853] text-white hover:bg-[#00A844] h-14 px-10 rounded-none font-medium text-base transition-all duration-300 hover:shadow-2xl hover:shadow-[#00C853]/30 flex items-center gap-3"
                >
                  <Battery className="w-5 h-5" />
                  Sell / Reuse Battery
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/buy">
                <Button
                  data-testid="buy-battery-btn"
                  className="group border-2 border-white text-white hover:bg-white hover:text-[#0A2820] bg-transparent h-14 px-10 rounded-none font-medium text-base transition-all duration-300 flex items-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Buy Battery
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/60" />
        </div>
      </section>

      {/* Top Story - Full Width Feature */}
      <section className="relative bg-gradient-to-br from-[#00C853] to-[#009624] text-white py-20 md:py-24 overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative">
          <div className="max-w-5xl mx-auto">
            {/* Top Story Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 rounded-full mb-6">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.15em]">
                🔴 TOP STORY
              </span>
            </div>

            <h2
              className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Europe is deploying massive battery capacity, and retiring it too early
            </h2>

            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-xl text-white/95 leading-relaxed mb-6 font-light" style={{ fontFamily: 'Inter, sans-serif' }}>
                Europe is expected to deploy <strong>≈8.5 TWh</strong> of EV battery capacity onto its roads this decade (Global EV Outlook).
              </p>

              <p className="text-lg text-white/90 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                Yet EV batteries are typically retired at <strong>~80% State of Health</strong>, not because they fail, but because driving range becomes insufficient.
              </p>

              <div className="bg-white/10 backdrop-blur-sm border-l-4 border-white p-6 my-8">
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>This means:</h3>
                <ul className="space-y-3 text-white/95" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-3">
                    <TrendingDown className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span><strong>20–30%</strong> of technically usable battery life is removed from service</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>Up to <strong>6–7 TWh</strong> of functional capacity risks being prematurely recycled</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Recycle className="w-5 h-5 mt-1 flex-shrink-0" />
                    <span>This triggers early carbon emissions instead of delaying them through second-life use</span>
                  </li>
                </ul>
              </div>

              <p className="text-lg text-white/90 leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
                System-level analysis shows that avoiding premature recycling at this scale could prevent up to <strong>~350 Mt CO₂ emissions</strong> over time, equivalent to <strong>≈95,000 tonnes of CO₂ per day</strong> when amortized across Europe's battery production and recycling chain.
              </p>

              <div className="bg-white/20 border-2 border-white p-6 text-center mt-8">
                <p className="text-2xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  This is not a battery failure problem.<br />
                  It is a system design failure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats Bar - Clean editorial style */}
      <section className="border-b border-gray-200">
        <div className="container mx-auto px-6 md:px-12 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold text-[#00C853] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                8.5 TWh
              </div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                EU Battery Capacity
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold text-[#00C853] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                350 Mt
              </div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                CO₂ Prevention Potential
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold text-[#00C853] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                80%
              </div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                SOH at Retirement
              </div>
            </div>
            <div className="text-center">
              <div
                className="text-4xl md:text-5xl font-bold text-[#00C853] mb-2"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                20-30%
              </div>
              <div className="text-sm text-gray-600 font-medium uppercase tracking-wider">
                Wasted Capacity
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Grid - Editorial Style */}
      <section className="py-12 md:py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mb-16">
            <div className="inline-block text-xs font-bold text-[#00C853] uppercase tracking-[0.2em] mb-6">
              Critical Analysis
            </div>
            <h2
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              The Hidden Crisis in Battery Circularity
            </h2>
            <p
              className="text-xl text-gray-600 leading-relaxed font-light"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Insights from the Second Sense team on Europe's battery sustainability challenge
            </p>
          </div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* News 2 */}
            <article className="group bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="inline-block bg-orange-100 text-[#00C853] px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                  ⚠️ NEWS 2
                </div>

                <h3
                  className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#00C853] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Europe cannot meet its climate and resource goals with recycling alone
                </h3>

                <p className="text-sm text-gray-500 mb-4 italic">Critical analysis by the Second Sense team</p>

                <p className="text-base text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Recycling is essential, but insufficient on its own. Even with aggressive recycling targets:
                </p>

                <ul className="space-y-2 mb-6 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Carbon emissions still occur too early</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Critical raw materials re-enter the system after demand peaks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Europe remains dependent on imported lithium, nickel, and cobalt</span>
                  </li>
                </ul>

                <p className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Repurposing delays both carbon emissions and material losses.
                </p>

                
              </div>
            </article>

            {/* News 3 */}
            <article className="group bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="inline-block bg-orange-100 text-[#00C853] px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                  ⚠️ NEWS 3
                </div>

                <h3
                  className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#00C853] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Early recycling is a false sustainability signal
                </h3>
                     <p className="text-sm text-gray-500 mb-4 italic">Critical analysis by the Second Sense team</p>

                <p className="text-base text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Recycling is often framed as a climate solution, but timing matters.
                </p>

                <p className="text-base text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  When batteries are recycled at 80% SOH:
                </p>

                <ul className="space-y-2 mb-6 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Embedded manufacturing carbon is not fully amortized</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Functional energy potential is destroyed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Additional batteries must be produced sooner, compounding emissions</span>
                  </li>
                </ul>

                <div className="bg-gray-100 border-l-4 border-[#00C853] p-4 mb-6">
                  <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    Recycling done too early shifts emissions forward in time.
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    That is accounting success, not climate success.
                  </p>
                </div>

               
              </div>
            </article>

            {/* News 4 */}
            <article className="group bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="inline-block bg-orange-100 text-[#00C853] px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                  ⚠️ NEWS 4
                </div>

                <h3
                  className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#00C853] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Second-life batteries already work, policy and markets lag behind
                </h3>
                     <p className="text-sm text-gray-500 mb-4 italic">Critical analysis by the Second Sense team</p>
                <p className="text-base text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Second-life EV batteries are already technically viable for:
                </p>

                <ul className="space-y-2 mb-4 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Grid balancing and peak shaving</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Telecom backup systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Commercial and industrial storage</span>
                  </li>
                </ul>

                <p className="text-base text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  What is missing is not technology, but:
                </p>

                <ul className="space-y-2 mb-6 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Application matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Carbon-aware decision tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Transparent lifetime trade-off analysis</span>
                  </li>
                </ul>

                <p className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                  This gap accelerates premature recycling.
                </p>

              
              </div>
            </article>

            {/* News 5 */}
            <article className="group bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 overflow-hidden">
              <div className="p-8">
                <div className="inline-block bg-orange-100 text-[#00C853] px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
                  ⚠️ NEWS 5
                </div>

                <h3
                  className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-[#00C853] transition-colors"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  Circularity fails when functional value is ignored
                </h3>
                     <p className="text-sm text-gray-500 mb-4 italic">Critical analysis by the Second Sense team</p>
                <p className="text-base text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Europe's circular economy strategy largely measures:
                </p>

                <ul className="space-y-2 mb-4 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Material recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#00C853] mt-1">•</span>
                    <span>Recycling rates</span>
                  </li>
                </ul>

                <p className="text-base text-gray-700 leading-relaxed mb-4 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  But ignores:
                </p>

                <ul className="space-y-2 mb-6 text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Functional lifetime</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>Carbon timing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">✗</span>
                    <span>System-level emissions</span>
                  </li>
                </ul>

                <div className="bg-red-50 border-l-4 border-[#00C853] p-4">
                  <p className="text-base font-bold text-gray-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    A battery recycled at 80% SOH is "circular" on paper and wasteful in physics.
                  </p>
                </div>

            
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Features Section - Why Repurpose */}
      <section className="py-12 md:py-12 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          {/* Section Header */}
          <div className="max-w-3xl mb-20">
            <div className="inline-block text-xs font-bold text-[#00C853] uppercase tracking-[0.2em] mb-6">
              Our Solution
            </div>
            <h2
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              Why Consider Second-Life EV Batteries?
            </h2>
            <p
              className="text-xl text-gray-600 leading-relaxed font-light"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Second-life use extends battery service life; the model compares cost, carbon emissions and usable energy lifetime with new (virgin) and recycled-content batteries.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group relative bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 p-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00C853] to-[#00E676] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="bg-[#00C853]/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00C853] transition-colors duration-300">
                <Leaf className="w-8 h-8 text-[#00C853] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Carbon Emissions
              </h3>

              <p
                className="text-base text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                In the model, a repurposed battery carries 5.0 kg CO₂-eq kWh⁻¹ (second-life preparation only), compared with about 49–86 kg CO₂-eq kWh⁻¹ for a new (virgin) battery, depending on the country.
              </p>

              
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 p-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00C853] to-[#00E676] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="bg-[#00C853]/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00C853] transition-colors duration-300">
                <TrendingUp className="w-8 h-8 text-[#00C853] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Cost
              </h3>

              <p
                className="text-base text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Repurposed-battery cost is modelled as 30–75% of the new-battery cost (price factor F), depending on battery condition and market.
              </p>

            
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white border-2 border-gray-100 hover:border-[#00C853] transition-all duration-300 p-8 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00C853] to-[#00E676] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              <div className="bg-[#00C853]/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#00C853] transition-colors duration-300">
                <Recycle className="w-8 h-8 text-[#00C853] group-hover:text-white transition-colors duration-300" />
              </div>

              <h3
                className="text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Materials
              </h3>

              <p
                className="text-base text-gray-600 leading-relaxed mb-6"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Metals stay in use; second-life use may avoid or delay the manufacture of a new battery.
              </p>

              
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications - Editorial grid layout */}
      <section className="py-12 md:py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="mb-16 text-center">
              <div className="inline-block text-xs font-bold text-[#00C853] uppercase tracking-[0.2em] mb-6">
                Technical Data
              </div>
              <h2
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Technical Specifications
              </h2>
            </div>

            {/* Specs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-l-4 border-[#00C853] p-8 hover:shadow-lg transition-shadow duration-300">
                <div
                  className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Base Capacity
                </div>
                <div
                  className="text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  60 kWh
                </div>
                <div className="text-sm text-gray-600">
                  NMC811 chemistry
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#00C853] p-8 hover:shadow-lg transition-shadow duration-300">
                <div
                  className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Second-Life Threshold
                </div>
                <div
                  className="text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  80% SOH
                </div>
                <div className="text-sm text-gray-600">
                  State of Health
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#00C853] p-8 hover:shadow-lg transition-shadow duration-300">
                <div
                  className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Cycles to 80% SOH
                </div>
                <div
                  className="text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  2000 cycles
                </div>
                <div className="text-sm text-gray-600">
                  First-life reference; linear cycle ageing (d = 0.0001 per cycle)
                </div>
              </div>

              <div className="bg-white border-l-4 border-[#00C853] p-8 hover:shadow-lg transition-shadow duration-300">
                <div
                  className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Efficiency
                </div>
                <div
                  className="text-4xl font-bold text-gray-900 mb-2"
                  style={{ fontFamily: 'Outfit, sans-serif' }}
                >
                  90% × 80%
                </div>
                <div className="text-sm text-gray-600">
                  Battery efficiency × Usable fraction
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Dark, impactful like UNESCO */}
      <section className="relative py-24 md:py-32 bg-[#0A2820] text-white overflow-hidden">
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Side - CTA */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Zap className="w-12 h-12 text-[#7FFF9F]" />
              </div>

              <h2
                className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Ready to Start?
              </h2>

              <p
                className="text-lg text-white/80 max-w-xl mb-10 leading-relaxed font-light"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Calculate your battery's value or compare new (virgin), recycled-content and repurposed batteries for your application
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/sell">
                  <Button
                    data-testid="cta-sell-btn"
                    className="group bg-[#00C853] text-white hover:bg-[#00A844] h-14 px-10 rounded-none font-medium text-base transition-all duration-300 flex items-center gap-3"
                  >
                    Start Selling
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <Link to="/buy">
                  <Button
                    data-testid="cta-buy-btn"
                    className="group bg-white text-[#0A2820] hover:bg-gray-100 h-14 px-10 rounded-none font-medium text-base transition-all duration-300 flex items-center gap-3"
                  >
                    Start Buying
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Team Members */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10">
              <h3
                className="text-2xl font-bold mb-8 text-white"
                style={{ fontFamily: 'Outfit, sans-serif' }}
              >
                Authors
              </h3>

              <ul className="space-y-4">
                {[
                  'Ali Raza',
                  'Mohammad Faheem',
                  'Umaiza Sattar',
                  'Md. Abdul Alim',
                  'Md. Raeen Hassan Chowdhury',
                  'Alexandre Chagnes',
                  'Nicolas Stankovic',
                  'Alexandre Nominé'
                ].map((name, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-white/90 hover:text-[#7FFF9F] transition-colors duration-200 text-lg font-light"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
