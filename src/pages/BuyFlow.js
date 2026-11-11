import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BatteryDecision from '../utils/batterDesicion';
import { COUNTRIES, APPLICATIONS } from '@/data/constants';

export default function BuyFlow() {
  const [step, setStep] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [country, setCountry] = useState('');
  const selectedCountry = COUNTRIES.find((c) => c.code === country);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleApplicationSelect = (app) => {
    setSelectedApplication(app);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F5]">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="container mx-auto px-6 md:px-12 py-6">
          <Link to="/" className="inline-flex items-center text-[#525252] hover:text-[#00C853] transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span style={{ fontFamily: 'DM Sans, sans-serif' }}>Back to Home</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title & Progress */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0A0A0A] mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Buy Battery
            </h1>
            <p className="text-lg text-[#525252] mb-8" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              Compare new (virgin), recycled-content, and repurposed batteries
            </p>

            {/* Progress Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <div className={`flex items-center ${step >= 1 ? 'text-[#00C853]' : 'text-[#A3A3A3]'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-[#00C853] bg-[#00C853] text-white' : 'border-[#A3A3A3]'}`}>
                    {step > 1 ? <Check className="w-5 h-5" /> : '1'}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden md:inline" style={{ fontFamily: 'DM Sans, sans-serif' }}>Application</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-[#00C853]' : 'bg-[#E5E7EB]'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-[#00C853]' : 'text-[#A3A3A3]'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-[#00C853] bg-[#00C853] text-white' : 'border-[#A3A3A3]'}`}>
                    {step > 2 ? <Check className="w-5 h-5" /> : '2'}
                  </div>
                  <span className="ml-2 text-sm font-medium hidden md:inline" style={{ fontFamily: 'DM Sans, sans-serif' }}>Country</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Application Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-lg">
                <h2 className="text-2xl font-semibold text-[#0A0A0A] mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Select Second-Life Application
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {APPLICATIONS.map((app) => (
                    <div
                      key={app.id}
                      data-testid={`app-card-${app.id}`}
                      onClick={() => handleApplicationSelect(app)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${selectedApplication?.id === app.id
                        ? 'border-[#00C853] bg-[#00C853]/5 shadow-md'
                        : 'border-[#E5E7EB] hover:border-[#00C853]/50 hover:shadow-sm'
                        }`}
                    >
                      <h3 className="text-lg font-semibold text-[#0A0A0A] mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
                        {app.name}
                      </h3>
                      <p className="text-sm text-[#525252] mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Typical DOD (information only): {app.dod}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-[#525252] mt-6 italic" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  The typical DOD of each application is shown for information; the energy calculation uses a usable
                  fraction of 0.8, and the direct effect of DOD on degradation is not modelled.
                </p>
              </Card>

              <div className="flex justify-end">
                <Button
                  data-testid="step1-next-btn"
                  onClick={handleNext}
                  disabled={!selectedApplication}
                  className="bg-[#00C853] text-white hover:bg-[#009624] h-12 px-8 rounded-full disabled:opacity-50"
                >
                  Country
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Country, priorities and ranking */}
          {step === 2 && (
            <div className="space-y-6">
              <Card className="bg-white border border-[#E5E7EB] p-5 md:p-8 shadow-lg">
                {/* Country Selection */}
                <div>
                  <label className="text-lg font-medium text-[#0A0A0A] mb-3 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Select Country
                  </label>
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger data-testid="country-select-buy" className="w-full h-12 bg-[#F5F7F5] border-transparent">
                      <SelectValue placeholder="Select a country..." />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </Card>

              {selectedApplication && !selectedCountry && (
                <p className="text-center text-[#525252]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Select a country to see the ranking for {selectedApplication.name}.
                </p>
              )}

              {selectedApplication && selectedCountry && (
                <BatteryDecision
                  application={selectedApplication}
                  country={selectedCountry}
                />
              )}

              <div className="flex justify-between">
                <Button
                  data-testid="step2-back-btn"
                  onClick={handleBack}
                  variant="outline"
                  className="h-12 px-8 rounded-full"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" />
                  Back
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
