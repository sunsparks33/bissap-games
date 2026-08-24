'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Users, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Check, 
  Plus, 
  Trash2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Terminal,
  ChevronRight
} from 'lucide-react';
import { showLoadingAlert, showSuccessAlert } from '@/lib/alerts';
import { useLanguage } from '@/context/LanguageContext';

// Zod Schema Definition
const memberSchema = z.object({
  name: z.string().min(2, 'Member name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(8, 'Phone number must be at least 8 digits'),
});

export const teamRegistrationSchema = z.object({
  // Step 1: Team Name & Category
  teamName: z.string().min(3, 'Team name must be at least 3 characters'),
  category: z.string().min(1, 'Please select a competition category'),

  // Step 2: Captain Info
  captainName: z.string().min(2, 'Captain name must be at least 2 characters'),
  captainEmail: z.string().email('Please enter a valid email address'),
  captainPhone: z.string().min(8, 'Phone number must be at least 8 digits'),

  // Step 3: Additional Members (Up to 3)
  members: z
    .array(memberSchema)
    .max(3, 'You can add up to 3 additional team members'),
});

export type TeamRegistrationFormData = z.infer<typeof teamRegistrationSchema>;

interface MultiStepTeamRegistrationProps {
  onSuccess?: (data: TeamRegistrationFormData) => void;
  onClose?: () => void;
}

export default function MultiStepTeamRegistration({ onSuccess, onClose }: MultiStepTeamRegistrationProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [submittedData, setSubmittedData] = useState<TeamRegistrationFormData | null>(null);
  const [showToast, setShowToast] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<TeamRegistrationFormData>({
    resolver: zodResolver(teamRegistrationSchema),
    defaultValues: {
      teamName: '',
      category: 'RX Team Relay',
      captainName: '',
      captainEmail: '',
      captainPhone: '',
      members: [
        { name: '', email: '', phone: '' },
      ],
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'members',
  });

  // Step Navigation Handlers with Step-Specific Validation
  const goToNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(['teamName', 'category']);
      if (isValid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const isValid = await trigger(['captainName', 'captainEmail', 'captainPhone']);
      if (isValid) setCurrentStep(3);
    }
  };

  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  // Submit Handler
  const onSubmit = async (data: TeamRegistrationFormData) => {
    // 1. Show Loading Alert
    showLoadingAlert('Registering Team...', 'Transmitting squad parameters to Bissap Games National Tour database.');

    // Simulate database write delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSubmittedData(data);
    setShowToast(true);

    // 2. Show 3-second Auto-Dismiss Success Popup
    await showSuccessAlert('Squad Registered!', `Team "${data.teamName}" has been successfully entered into the National Tour.`);

    if (onSuccess) {
      onSuccess(data);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 max-w-md w-full p-4 rounded-2xl bg-[#0D0D12] border border-emerald-500/50 shadow-2xl shadow-emerald-500/20 text-white animate-in slide-in-from-top-5 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-extrabold text-sm text-emerald-400 flex items-center gap-1.5">
                Registration Successful!
              </h4>
              <p className="text-xs text-gray-300">
                Team <span className="font-bold text-white">"{submittedData?.teamName}"</span> registered! Check browser console for full payload.
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-gray-400 hover:text-white text-xs font-bold px-2 py-1 rounded bg-white/5"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Step Indicator Header */}
      <div className="glass-panel p-4 sm:p-6 border-[#E6093C]/30 bg-[#0D0D12]/90">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-[#E6093C] to-[#FF3366] -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%' }}
          />

          {/* Step 1 Pill */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                currentStep >= 1
                  ? 'bg-gradient-to-br from-[#E6093C] to-[#9E002B] text-white shadow-lg shadow-[#E6093C]/40 border border-[#E6093C]'
                  : 'bg-[#14141C] text-gray-400 border border-white/10'
              }`}
            >
              {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
            </div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${currentStep === 1 ? 'text-[#FF3366]' : 'text-gray-400'}`}>
              Team Name
            </span>
          </div>

          {/* Step 2 Pill */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                currentStep >= 2
                  ? 'bg-gradient-to-br from-[#E6093C] to-[#9E002B] text-white shadow-lg shadow-[#E6093C]/40 border border-[#E6093C]'
                  : 'bg-[#14141C] text-gray-400 border border-white/10'
              }`}
            >
              {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
            </div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${currentStep === 2 ? 'text-[#FF3366]' : 'text-gray-400'}`}>
              Captain
            </span>
          </div>

          {/* Step 3 Pill */}
          <div className="relative z-10 flex flex-col items-center gap-1.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm transition-all duration-300 ${
                currentStep >= 3
                  ? 'bg-gradient-to-br from-[#E6093C] to-[#9E002B] text-white shadow-lg shadow-[#E6093C]/40 border border-[#E6093C]'
                  : 'bg-[#14141C] text-gray-400 border border-white/10'
              }`}
            >
              3
            </div>
            <span className={`text-[11px] font-extrabold uppercase tracking-wider ${currentStep === 3 ? 'text-[#FF3366]' : 'text-gray-400'}`}>
              Athletes
            </span>
          </div>
        </div>
      </div>

      {/* Main Form Box */}
      <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-6 sm:p-8 space-y-6 border-[#E6093C]/40 bg-[#0D0D12]">
        {/* STEP 1: TEAM NAME CREATION */}
        {currentStep === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-250">
            <div className="border-b border-white/10 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6093C]/20 text-[#FF3366] text-xs font-extrabold uppercase mb-2">
                <Users className="w-3.5 h-3.5" /> Step 1 of 3
              </div>
              <h3 className="text-2xl font-black text-white">Create Your Team Name</h3>
              <p className="text-xs text-gray-400 mt-1">
                Choose an inspiring squad name to represent your crew on the Casablanca standings.
              </p>
            </div>

            {/* Team Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-gray-200 uppercase tracking-wider">
                Team Name <span className="text-[#FF3366]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Atlas Titans, Ain Diab Warriors"
                  {...register('teamName')}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.teamName ? 'border-rose-500 bg-rose-950/20' : 'border-white/15 focus:border-[#E6093C]'
                  }`}
                />
                <Shield className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.teamName && (
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.teamName.message}</span>
                </p>
              )}
            </div>

            {/* Competition Category Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-gray-200 uppercase tracking-wider">
                Competition Division <span className="text-[#FF3366]">*</span>
              </label>
              <select
                {...register('category')}
                className={`w-full bg-[#14141C] border rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none transition-all ${
                  errors.category ? 'border-rose-500' : 'border-white/15 focus:border-[#E6093C]'
                }`}
              >
                <option value="RX Team Relay">RX Team Relay (4 Athletes)</option>
                <option value="Intermediate Co-ed">Intermediate Co-ed Relay</option>
                <option value="Masters Strength Challenge">Masters Strength Challenge (35+)</option>
              </select>
              {errors.category && (
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.category.message}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: CAPTAIN DETAILS */}
        {currentStep === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-250">
            <div className="border-b border-white/10 pb-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6093C]/20 text-[#FF3366] text-xs font-extrabold uppercase mb-2">
                <User className="w-3.5 h-3.5" /> Step 2 of 3
              </div>
              <h3 className="text-2xl font-black text-white">Captain Details</h3>
              <p className="text-xs text-gray-400 mt-1">
                The team captain serves as the primary contact for race briefings and scoring updates.
              </p>
            </div>

            {/* Captain Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-gray-200 uppercase tracking-wider">
                Captain Full Name <span className="text-[#FF3366]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Youssef Bennani"
                  {...register('captainName')}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.captainName ? 'border-rose-500 bg-rose-950/20' : 'border-white/15 focus:border-[#E6093C]'
                  }`}
                />
                <User className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.captainName && (
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.captainName.message}</span>
                </p>
              )}
            </div>

            {/* Captain Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-gray-200 uppercase tracking-wider">
                Captain Email Address <span className="text-[#FF3366]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="captain@domain.ma"
                  {...register('captainEmail')}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.captainEmail ? 'border-rose-500 bg-rose-950/20' : 'border-white/15 focus:border-[#E6093C]'
                  }`}
                />
                <Mail className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.captainEmail && (
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.captainEmail.message}</span>
                </p>
              )}
            </div>

            {/* Captain Phone */}
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-gray-200 uppercase tracking-wider">
                Captain Phone / WhatsApp <span className="text-[#FF3366]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+212 600 000 000"
                  {...register('captainPhone')}
                  className={`w-full bg-white/5 border rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${
                    errors.captainPhone ? 'border-rose-500 bg-rose-950/20' : 'border-white/15 focus:border-[#E6093C]'
                  }`}
                />
                <Phone className="w-5 h-5 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {errors.captainPhone && (
                <p className="text-xs text-rose-400 font-semibold flex items-center gap-1.5 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errors.captainPhone.message}</span>
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: ADDITIONAL TEAM MEMBERS (UP TO 3) */}
        {currentStep === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-250">
            <div className="border-b border-white/10 pb-4 flex items-center justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6093C]/20 text-[#FF3366] text-xs font-extrabold uppercase mb-2">
                  <Users className="w-3.5 h-3.5" /> Step 3 of 3
                </div>
                <h3 className="text-2xl font-black text-white">Add Team Members</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Add up to 3 additional athletes to complete your 4-person relay roster.
                </p>
              </div>

              {fields.length < 3 && (
                <button
                  type="button"
                  onClick={() => append({ name: '', email: '', phone: '' })}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#FF3366]" />
                  <span>Add Member ({fields.length}/3)</span>
                </button>
              )}
            </div>

            {/* Dynamic Roster Field List */}
            {fields.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/15 rounded-2xl space-y-2">
                <Users className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-sm font-bold text-gray-300">No additional members added yet</p>
                <p className="text-xs text-gray-500">You can submit now or add up to 3 roster members.</p>
                <button
                  type="button"
                  onClick={() => append({ name: '', email: '', phone: '' })}
                  className="btn-bissap text-xs py-2 px-4 mt-2"
                >
                  <Plus className="w-4 h-4" /> Add First Member
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                {fields.map((field, idx) => (
                  <div key={field.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#FF3366] uppercase tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> Athlete #{idx + 2}
                      </span>
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="text-gray-400 hover:text-rose-400 text-xs flex items-center gap-1 p-1 rounded hover:bg-white/5"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Name</label>
                        <input
                          type="text"
                          placeholder="Member Name"
                          {...register(`members.${idx}.name` as const)}
                          className={`w-full bg-[#14141C] border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                            errors.members?.[idx]?.name ? 'border-rose-500' : 'border-white/10 focus:border-[#E6093C]'
                          }`}
                        />
                        {errors.members?.[idx]?.name && (
                          <p className="text-[10px] text-rose-400 mt-1">{errors.members[idx]?.name?.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Email</label>
                        <input
                          type="email"
                          placeholder="Email Address"
                          {...register(`members.${idx}.email` as const)}
                          className={`w-full bg-[#14141C] border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                            errors.members?.[idx]?.email ? 'border-rose-500' : 'border-white/10 focus:border-[#E6093C]'
                          }`}
                        />
                        {errors.members?.[idx]?.email && (
                          <p className="text-[10px] text-rose-400 mt-1">{errors.members[idx]?.email?.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Phone</label>
                        <input
                          type="tel"
                          placeholder="Phone Number"
                          {...register(`members.${idx}.phone` as const)}
                          className={`w-full bg-[#14141C] border rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none ${
                            errors.members?.[idx]?.phone ? 'border-rose-500' : 'border-white/10 focus:border-[#E6093C]'
                          }`}
                        />
                        {errors.members?.[idx]?.phone && (
                          <p className="text-[10px] text-rose-400 mt-1">{errors.members[idx]?.phone?.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP CONTROLS / BUTTON BAR */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={goToPrevStep}
              className="btn-secondary text-xs sm:text-sm py-2.5 px-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={goToNextStep}
              className="btn-bissap text-xs sm:text-sm py-2.5 px-6"
            >
              <span>Continue to Step {currentStep + 1}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-bissap text-xs sm:text-sm py-3 px-8 shadow-xl shadow-[#E6093C]/40"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Submit Team Roster'}</span>
            </button>
          )}
        </div>
      </form>

      {/* CONSOLE PAYLOAD DISPLAY PREVIEW */}
      {submittedData && (
        <div className="glass-panel p-5 border-emerald-500/40 bg-[#090B10] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-4 h-4" /> Logged Payload Output (console.log)
            </span>
            <span className="text-[10px] text-gray-500">JSON Format</span>
          </div>
          <pre className="p-4 rounded-xl bg-black/60 text-xs font-mono text-emerald-300 overflow-x-auto border border-emerald-500/20">
            {JSON.stringify(submittedData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
