"use client";
import { useState } from "react";

export function TaskDashboard() {
  const [userInput, setUserInput] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAIPrioritize = async () => {
    if (!userInput) return alert("Please enter some tasks first!");
    
    setLoading(true);
    try {
      // API URL updated to 127.0.0.1:8000 for local development
      const response = await fetch("http://127.0.0.1:8000/api/prioritize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_id: "demo_user", 
          raw_tasks: userInput 
        }),
      });
      
      const data = await response.json();
      // Setting tasks from AI backend response
      setTasks(data.tasks || []);
    } catch (error) {
      console.error("Backend connection failed:", error);
      alert("Backend server (Python) is not responding. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="dashboard-section" className="py-20 px-6 bg-slate-950 text-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Your AI Task Space</h2>
        
        {/* Input Area */}
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-xl">
          <textarea
            className="w-full h-32 p-4 bg-slate-800 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
            placeholder="Example: I have a meeting at 10am, need to buy milk, and finish the project report by 5pm..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button
            onClick={handleAIPrioritize}
            disabled={loading}
            className="mt-4 w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
          >
            {loading ? "AI is Thinking..." : "Prioritize My Day ✨"}
          </button>
        </div>

        {/* Results Area */}
        {tasks.length > 0 && (
          <div className="mt-10 space-y-4">
            <h3 className="text-xl font-semibold border-b border-slate-800 pb-2">Optimized Schedule</h3>
            {tasks.map((t, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg border-l-4 border-blue-500">
                <div>
                  {/* Matching with agent.py JSON keys: title, effort, impact */}
                  <p className="font-medium text-lg">{t.title}</p>
                  <span className="text-sm text-slate-400">Effort: {t.effort} | Deadline: {t.deadline || "None"}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  t.impact === 'high' ? 'bg-red-900 text-red-200' : 
                  t.impact === 'medium' ? 'bg-yellow-900 text-yellow-200' : 
                  'bg-green-900 text-green-200'
                }`}>
                  {t.impact}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}