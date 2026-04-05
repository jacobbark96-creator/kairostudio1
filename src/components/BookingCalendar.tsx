"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, Mail, Loader2, CheckCircle, Phone, Building, Globe } from 'lucide-react';

export default function BookingCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyUrl, setCompanyUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate Calendar Days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const prevMonth = () => {
    const today = new Date();
    // Don't allow going to past months
    if (currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth()) {
      return;
    }
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
    setSelectedTime(null);
  };

  // Generate Time Slots (8am to 6pm, 30 min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!selectedDate) return;

    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      try {
        // Fetch from Supabase Database
        const { data, error } = await supabase
          .from('bookings')
          .select('time_slot')
          .eq('booking_date', formattedDate)
          .in('status', ['confirmed']);

        let dbSlots: string[] = [];
        if (!error && data) {
          dbSlots = (data as any[]).map(b => b.time_slot);
        }

        // Fetch from Google Calendar API
        let googleSlots: string[] = [];
        try {
          const res = await fetch(`/api/calendar/availability?date=${formattedDate}`);
          if (res.ok) {
            const result = await res.json();
            if (result.busySlots) {
              googleSlots = result.busySlots;
            }
          }
        } catch (apiError) {
          console.error('Failed to fetch Google Calendar slots:', apiError);
        }

        // Combine and deduplicate
        const combinedSlots = Array.from(new Set([...dbSlots, ...googleSlots]));
        setBookedSlots(combinedSlots);
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchBookedSlots();
  }, [selectedDate]);

  const handleDateSelect = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Ensure it's a weekday (0 is Sunday, 6 is Saturday)
    if (date.getDay() === 0 || date.getDay() === 6) return;
    // Ensure it's not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return;

    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email) return;

    setIsSubmitting(true);
    const formattedDate = selectedDate.toISOString().split('T')[0];

    try {
      const { error } = await supabase.from('bookings').insert([{
        client_name: name.trim(),
        client_email: email.trim(),
        company_name: companyName.trim() || null,
        company_url: companyUrl.trim() || null,
        booking_date: formattedDate,
        time_slot: selectedTime,
        status: 'confirmed'
      }]);

      if (error) {
        if (error.code === '23505') { // Unique violation
          alert('Sorry, this time slot was just booked by someone else. Please select another time.');
          // Refresh slots
          setSelectedTime(null);
          const { data } = await supabase.from('bookings').select('time_slot').eq('booking_date', formattedDate).in('status', ['confirmed']);
          if (data) setBookedSlots(data.map(b => b.time_slot));
        } else {
          throw error;
        }
      } else {
        // 2. Insert into Google Calendar via API
        try {
          await fetch('/api/calendar/book', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim(),
              email: email.trim(),
              companyName: companyName.trim(),
              phone: phone.trim(),
              date: formattedDate,
              timeSlot: selectedTime
            })
          });
        } catch (calError) {
          console.error('Failed to sync to Google Calendar:', calError);
          // Even if Google Calendar sync fails, we still consider the booking successful locally
        }

        // We no longer manually send the email from the frontend!
        // The Postgres Database Trigger will automatically catch the insertion
        // and fire the email logic securely in the background.
        console.log('Booking successfully inserted. Postgres trigger will handle the email.');
        setIsSuccess(true);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-16 text-center max-w-2xl mx-auto border border-gray-100 dark:border-gray-700 transform transition-all duration-500 scale-100 opacity-100 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-cyan-600 to-blue-600"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-100 dark:bg-cyan-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">Booking Confirmed!</h2>
          
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-8 inline-block text-left w-full max-w-md border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <Clock className="w-6 h-6 text-cyan-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Date & Time</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-cyan-600 font-medium">{selectedTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-cyan-600" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Booked By</p>
                <p className="font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{email}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
            We've sent a calendar invitation with the Google Meet link to your email. We look forward to speaking with you!
          </p>
          
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-cyan-600 text-cyan-600 rounded-xl font-medium hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-colors inline-flex items-center gap-2"
          >
            <CalendarIcon className="w-4 h-4" />
            Book another appointment
          </button>
        </div>
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isCurrentMonth = currentDate.getFullYear() === today.getFullYear() && currentDate.getMonth() === today.getMonth();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col md:flex-row">
      
      {/* Calendar Section */}
      <div className="flex-1 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-600" />
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth} 
              disabled={isCurrentMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}
          
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const isPast = date < today;
            const isSelected = selectedDate?.getDate() === day && selectedDate?.getMonth() === currentDate.getMonth();
            const isDisabled = isWeekend || isPast;

            return (
              <button
                key={day}
                onClick={() => handleDateSelect(day)}
                disabled={isDisabled}
                className={`
                  aspect-square p-2 rounded-full flex items-center justify-center text-sm font-medium transition-all
                  ${isSelected ? 'bg-cyan-600 text-white shadow-md' : ''}
                  ${!isSelected && !isDisabled ? 'hover:bg-cyan-50 dark:hover:bg-cyan-900/20 text-gray-900 dark:text-white' : ''}
                  ${isDisabled ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Slots & Form Section */}
      <div className="w-full md:w-96 bg-gray-50 dark:bg-gray-900/50 p-8 flex flex-col">
        {!selectedDate ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p>Please select a date<br/>to view available times.</p>
          </div>
        ) : !selectedTime ? (
          <div className="flex-1 flex flex-col h-full max-h-[500px]">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>
            
            {loadingSlots ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-cyan-600" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {timeSlots.map(time => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      disabled={isBooked}
                      className={`
                        w-full py-3 px-4 rounded-xl text-sm font-medium transition-all border
                        ${isBooked 
                          ? 'bg-gray-100 dark:bg-gray-800 border-transparent text-gray-400 dark:text-gray-500 cursor-not-allowed line-through' 
                          : 'bg-white dark:bg-gray-800 border-cyan-100 dark:border-gray-700 text-cyan-700 dark:text-cyan-300 hover:border-cyan-600 hover:text-cyan-600 hover:shadow-md'
                        }
                      `}
                    >
                      {time} {isBooked ? '(Booked)' : ''}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col animate-fade-in max-h-[500px]">
            <div className="mb-6 flex items-start gap-3 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl shrink-0">
              <Clock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-cyan-900 dark:text-cyan-100">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-lg font-bold text-cyan-700 dark:text-cyan-300">{selectedTime}</p>
                <button 
                  onClick={() => setSelectedTime(null)}
                  className="text-xs text-cyan-600 hover:underline mt-1"
                >
                  Change Time
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="+44 7700 900077"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">For SMS reminders</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name (Optional)</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Acme Corp"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company URL (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={companyUrl}
                    onChange={(e) => setCompanyUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="https://acme.com"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-cyan-600 text-white rounded-xl font-medium hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
