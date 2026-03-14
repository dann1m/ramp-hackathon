import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckCircle, Calendar, MapPin, Users, ArrowLeft } from 'lucide-react';

interface AttendeeRecord {
  netId: string;
  name: string;
  email: string;
  timestamp: Date;
}

export default function AttendanceCheckin() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [formData, setFormData] = useState({
    netId: '',
    name: '',
    email: ''
  });

  // Mock event data - in a real app, this would come from state management or API
  const events = [
    {
      id: '1',
      name: 'Spring Fundraiser',
      date: '2026-03-20',
      venue: 'Student Center Ballroom',
      expectedAttendees: 100
    },
    {
      id: '2',
      name: 'Networking Mixer',
      date: '2026-03-28',
      venue: 'Student Center Room 301',
      expectedAttendees: 75
    },
    {
      id: '3',
      name: 'Winter Gala',
      date: '2025-12-10',
      venue: 'Grand Ballroom',
      expectedAttendees: 100
    }
  ];

  const event = events.find(e => e.id === eventId);

  // Load attendance from localStorage
  const [attendees, setAttendees] = useState<AttendeeRecord[]>(() => {
    const stored = localStorage.getItem(`attendance-${eventId}`);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    // Save to localStorage whenever attendees change
    localStorage.setItem(`attendance-${eventId}`, JSON.stringify(attendees));
  }, [attendees, eventId]);

  const handleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.netId || !formData.name || !formData.email) {
      alert('Please fill in all fields');
      return;
    }

    // Check if already checked in
    const alreadyCheckedIn = attendees.some(a => a.netId === formData.netId);
    if (alreadyCheckedIn) {
      alert('You have already checked in to this event!');
      return;
    }

    // Add attendee
    const newAttendee: AttendeeRecord = {
      netId: formData.netId,
      name: formData.name,
      email: formData.email,
      timestamp: new Date()
    };

    setAttendees([...attendees, newAttendee]);
    setIsCheckedIn(true);

    // Reset form
    setFormData({ netId: '', name: '', email: '' });
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <p className="text-slate-600 mb-4">Event not found</p>
            <Button onClick={() => navigate('/app')}>Return to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCheckedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">You're Checked In! 🎉</h2>
            <p className="text-slate-600 mb-6">
              Thank you for attending <strong>{event.name}</strong>
            </p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6 text-left">
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                <Users className="w-4 h-4" />
                <span>Total Attendees: <strong className="text-slate-900">{attendees.length}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4" />
                <span>Checked in at: <strong className="text-slate-900">{new Date().toLocaleTimeString()}</strong></span>
              </div>
            </div>
            <Button onClick={() => setIsCheckedIn(false)} variant="outline" className="w-full">
              Check In Another Person
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center border-b">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Event Check-In</CardTitle>
          <h3 className="text-xl font-semibold text-blue-600 mt-2">{event.name}</h3>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Event Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>{new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              {event.venue && (
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{event.venue}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-slate-700">
                <Users className="w-4 h-4 text-blue-600" />
                <span><strong>{attendees.length}</strong> checked in so far</span>
              </div>
            </div>
          </div>

          {/* Check-in Form */}
          <form onSubmit={handleCheckIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="netid">Net ID *</Label>
              <Input
                id="netid"
                placeholder="e.g., sc1234"
                value={formData.netId}
                onChange={(e) => setFormData({ ...formData, netId: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Sarah Chen"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g., sarah.chen@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              Check In to Event
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <button
              onClick={() => navigate('/app/events')}
              className="text-sm text-slate-600 hover:text-slate-900 flex items-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
