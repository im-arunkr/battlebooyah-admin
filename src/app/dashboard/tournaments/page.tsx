"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { Tournament } from "../../../types/tournament";
import { Plus, Trophy, Calendar, Trash2, MapPin, Sword } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: "",
    game_type: "Solo",
    map_name: "Bermuda",
    entry_fee: "",
    prize_pool: "",
    date_time: "",
  });

  const fetchTournaments = async () => {
    try {
      const res = await api.get("/tournaments");
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTournaments(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/tournaments", formData);
      setOpen(false); // Close Modal
      fetchTournaments(); // Refresh List
      alert("Tournament Created!");
    } catch (err) {
      alert("Failed to create tournament");
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tournaments</h1>
          <p className="text-slate-500">Create and manage your eSports matches.</p>
        </div>

        {/* MODAL START */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
              <Plus size={20} /> Create Match
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">New Tournament</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700">Match Title</label>
                <input 
                  required 
                  className="p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Sunday Mega Match"
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700">Game Type</label>
                  <select 
                    className="p-2.5 border rounded-lg outline-none"
                    onChange={(e) => setFormData({...formData, game_type: e.target.value})}
                  >
                    <option>Solo</option>
                    <option>Duo</option>
                    <option>Squad</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700">Map</label>
                  <input 
                    className="p-2.5 border rounded-lg outline-none"
                    placeholder="Bermuda"
                    onChange={(e) => setFormData({...formData, map_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700">Entry Fee (₹)</label>
                  <input 
                    type="number"
                    className="p-2.5 border rounded-lg outline-none"
                    placeholder="20"
                    onChange={(e) => setFormData({...formData, entry_fee: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-bold text-slate-700">Prize Pool (₹)</label>
                  <input 
                    type="number"
                    className="p-2.5 border rounded-lg outline-none"
                    placeholder="1000"
                    onChange={(e) => setFormData({...formData, prize_pool: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-bold text-slate-700">Match Date & Time</label>
                <input 
                  type="datetime-local"
                  className="p-2.5 border rounded-lg outline-none"
                  onChange={(e) => setFormData({...formData, date_time: e.target.value})}
                />
              </div>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold mt-4 hover:bg-blue-700">
                Publish Tournament
              </button>
            </form>
          </DialogContent>
        </Dialog>
        {/* MODAL END */}
      </div>

      {/* LIST SECTION */}
      {loading ? (
        <p>Loading matches...</p>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((t) => (
            <div key={t.id} className="bg-white p-5 border rounded-2xl shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">
                  {t.game_type[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-800">{t.title}</h3>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-semibold text-green-600">₹{t.prize_pool} Prize</span>
                    <span className="flex items-center gap-1"><MapPin size={14}/> {t.map_name}</span>
                    <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(t.date_time).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}