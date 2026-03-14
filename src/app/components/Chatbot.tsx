import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MessageCircle, X, Send, Sparkles, TrendingUp, CheckSquare, DollarSign } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your club management assistant. I can help you understand your metrics, generate task ideas, or provide insights on your analytics. What would you like to know?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simulated AI responses
  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Event creation and management
    if (lowerMessage.includes('event') && (lowerMessage.includes('create') || lowerMessage.includes('add') || lowerMessage.includes('new'))) {
      return "To create a new event, go to the Events page and click 'Add Event'. I'll automatically generate tasks for:\n\n✓ Venue booking (6 weeks before)\n✓ Marketing materials (4 weeks before)\n✓ Invitations (4 weeks before)\n✓ Sponsor outreach (for fundraisers)\n✓ Logistics finalization (2 weeks before)\n✓ Check-in system (1 week before)\n✓ Final walkthrough (3 days before)\n\nJust provide the event details and I'll handle the rest!";
    }

    if (lowerMessage.includes('event') && (lowerMessage.includes('update') || lowerMessage.includes('edit') || lowerMessage.includes('change'))) {
      return "To update an event, go to the Events page and click the edit icon on any event. You can update:\n\n• Event status (Draft → Planning → Ready → Completed)\n• Actual attendance (to calculate success rate)\n• Actual costs and revenue (to auto-calculate ROI)\n• Venue and other details\n\nWhen you mark an event as 'Completed' and add the final numbers, I'll automatically calculate ROI, profit, and attendance success rate!";
    }

    if (lowerMessage.includes('automat') || lowerMessage.includes('auto-generat')) {
      return "Our automation features:\n\n📋 **Task Generation**: Creating an event automatically generates 7+ tasks with smart due dates\n📊 **Metric Calculation**: ROI, profit, and success rates are auto-calculated when you add event results\n📅 **Timeline Management**: Tasks are scheduled based on your event date (6 weeks to 3 days before)\n👥 **Team Assignment**: Tasks are assigned to appropriate team members based on category\n\nThis saves hours of manual work and ensures nothing is forgotten!";
    }

    // Analytics and metrics help
    if (lowerMessage.includes('roi') || lowerMessage.includes('return')) {
      return "ROI (Return on Investment) shows how much revenue you generate per dollar spent. Your average ROI is 3.2x, meaning for every $1 spent, you earn $3.20. The Winter Gala had the best ROI at 3.47x. To improve ROI, focus on: 1) Reducing event costs through better vendor negotiations, 2) Increasing revenue via sponsorships, 3) Learning from your highest-performing events.";
    }
    
    if (lowerMessage.includes('attendance') || lowerMessage.includes('attendees')) {
      return "Your average event success rate is 112%, meaning you're exceeding expected attendance! The Career Fair was your most successful with 133% attendance (200 actual vs 150 expected). To maintain this: 1) Promote events 2-3 weeks in advance, 2) Use social media and email campaigns, 3) Offer early-bird incentives, 4) Partner with other clubs for cross-promotion.";
    }

    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return "You've spent $4,250 (65.4%) of your $6,500 budget, leaving $2,250 remaining. Your largest category is Events ($2,150/$3,000). To optimize: 1) Track all expenses in real-time, 2) Get quotes from multiple vendors, 3) Use free campus resources when possible, 4) Plan a reserve fund for emergencies (10-15% of budget).";
    }

    if (lowerMessage.includes('profit') || lowerMessage.includes('revenue')) {
      return "Your total net profit across all events is $12,200 with $17,100 in revenue and $4,900 in costs. The Winter Gala generated the most profit at $3,700. To increase profit: 1) Secure sponsorships early, 2) Offer tiered ticket pricing, 3) Reduce venue costs by using campus spaces, 4) Sell merchandise at events.";
    }

    // Task suggestions
    if (lowerMessage.includes('task') && (lowerMessage.includes('idea') || lowerMessage.includes('suggest') || lowerMessage.includes('create'))) {
      const taskIdeas = [
        "Marketing: Create an Instagram Reel showcasing your last event highlights",
        "Finance: Reach out to 5 local businesses for event sponsorship opportunities",
        "Events: Survey members about preferred event themes for next semester",
        "Outreach: Partner with another student organization for a joint event",
        "Operations: Update your club's member database and contact information",
        "Marketing: Design a newsletter template for monthly club updates",
        "Finance: Create a financial report for your advisor or student activities",
        "Events: Book venues for next semester's major events (get early discounts!)",
        "Communications: Write blog posts about recent club achievements",
        "Outreach: Organize a volunteering opportunity for club members"
      ];
      const randomTask = taskIdeas[Math.floor(Math.random() * taskIdeas.length)];
      return `Here's a task idea: "${randomTask}"\n\nWould you like more suggestions or help breaking this down into steps?`;
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('assign')) {
      return "When assigning tasks, consider: 1) Each team member's strengths and interests, 2) Current workload distribution, 3) Deadlines and priorities, 4) Skills development opportunities. Your teams are: Marketing (Sarah Chen, Emma Davis), Events (Mike Johnson, Jessica Lee), Finance (Alex Brown, David Kim), and Outreach (Rachel Martinez, Tom Anderson).";
    }

    // Event planning
    if (lowerMessage.includes('event') && (lowerMessage.includes('plan') || lowerMessage.includes('organize'))) {
      return "For successful event planning: 1) Start 6-8 weeks in advance, 2) Create a detailed budget and timeline, 3) Book venue and vendors early, 4) Promote heavily 2-3 weeks before, 5) Have a backup plan for outdoor events, 6) Assign clear roles to team members, 7) Send thank-you notes to sponsors and attendees. Your past events show that proper planning leads to higher attendance and ROI!";
    }

    // Fundraising
    if (lowerMessage.includes('fundrais') || lowerMessage.includes('sponsor')) {
      return "Fundraising tips: 1) Create a professional sponsorship packet with your club's impact metrics, 2) Target local businesses that align with your mission, 3) Offer sponsorship tiers (Bronze, Silver, Gold), 4) Provide sponsor benefits (logo placement, social media shoutouts), 5) Follow up with sponsors within 48 hours of events, 6) Share impact reports showing how funds were used.";
    }

    // Default responses
    const defaultResponses = [
      "I can help you with:\n• Creating and managing events (with auto-task generation!)\n• Understanding your analytics (ROI, attendance, profit)\n• Budget management tips\n• Task and event planning ideas\n• Team coordination strategies\n\nWhat would you like to explore?",
      "Try asking me about:\n• \"How do I create a new event?\"\n• \"How can I improve our event ROI?\"\n• \"Suggest some task ideas\"\n• \"How's our budget looking?\"\n• \"What gets automated?\"\n• \"Tips for increasing event attendance\"",
      "I'm here to help! You can ask me about event management automation, club performance metrics, task suggestions, or strategies for better event planning and budgeting."
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot typing and response
    setTimeout(() => {
      const botMessage: Message = {
        id: messages.length + 2,
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInputValue('');
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            <Sparkles className="w-3 h-3" />
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl rounded-lg overflow-hidden z-50 flex flex-col bg-white border border-slate-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Club Assistant</h3>
                <p className="text-xs text-purple-100">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-50 p-3 border-b border-slate-200">
            <p className="text-xs text-slate-600 mb-2">Quick actions:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("How can I improve our ROI?")}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                Improve ROI
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("Suggest task ideas")}
              >
                <CheckSquare className="w-3 h-3 mr-1" />
                Task Ideas
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-7"
                onClick={() => handleQuickAction("Budget tips")}
              >
                <DollarSign className="w-3 h-3 mr-1" />
                Budget Tips
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      : 'bg-white text-slate-900 border border-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-slate-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="icon"
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}