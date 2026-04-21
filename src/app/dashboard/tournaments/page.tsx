
"use client";

import { useState, useEffect } from "react";
import api from "../../../lib/api";
import { Tournament } from "../../../types/tournament";
import { Plus, Calendar, Trash2, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    map_name: "",
    entry_fee: "",
    prize_pool: "",
    match_time: "",
    max_participants: "",
    bonus_percentage: "",
    mode: "solo",
  });

  // 🔹 Fetch games
  const fetchGames = async () => {
    try {
      const res = await api.get("/games");
      setGames(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Fetch tournaments
  const fetchTournaments = async (gameId?: string) => {
    try {
      const res = await api.get(
        gameId ? `/tournaments?game_id=${gameId}` : "/tournaments"
      );
      setTournaments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (selectedGame) fetchTournaments(selectedGame);
  }, [selectedGame]);

  // 🔹 Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame) {
      alert("Select game first");
      return;
    }

    try {
      await api.post("/tournaments/create", {
        ...formData,
        game_id: selectedGame,
        entry_fee: Number(formData.entry_fee),
        prize_pool: Number(formData.prize_pool),
        max_participants: Number(formData.max_participants),
        bonus_percentage: Number(formData.bonus_percentage),
      });

      setOpen(false);
      fetchTournaments(selectedGame);
      alert("Tournament Created!");
    } catch (err) {
      alert("Failed to create tournament");
    }
  };

  return (
    <div className="p-8 ml-64">

      {/* 🔥 GAME SELECT */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {games.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelectedGame(g.id)}
            className={`px-4 py-2 rounded-xl font-semibold transition ${
              selectedGame === g.id
                ? "bg-blue-600 text-white shadow"
                : "bg-slate-100 hover:bg-slate-200"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Tournaments</h1>
          <p className="text-slate-500">Create and manage your matches</p>
        </div>

        {/* MODAL */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow">
              <Plus size={20} /> Create Tournament
            </button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                Create Tournament
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">

              {/* TITLE */}
              <input
                placeholder="Tournament Title"
                required
                className="w-full p-2.5 border rounded-lg"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />

              {/* MODE */}
              <select
                className="w-full p-2.5 border rounded-lg"
                onChange={(e) =>
                  setFormData({ ...formData, mode: e.target.value })
                }
              >
                <option value="solo">Solo</option>
                <option value="duo">Duo</option>
                <option value="squad">Squad</option>
              </select>

              {/* MAP */}
              <input
                placeholder="Map Name"
                className="w-full p-2.5 border rounded-lg"
                onChange={(e) =>
                  setFormData({ ...formData, map_name: e.target.value })
                }
              />

              {/* FEES */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Entry Fee"
                  className="p-2.5 border rounded-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, entry_fee: e.target.value })
                  }
                />
                <input
                  type="number"
                  placeholder="Prize Pool"
                  className="p-2.5 border rounded-lg"
                  onChange={(e) =>
                    setFormData({ ...formData, prize_pool: e.target.value })
                  }
                />
              </div>

              {/* PARTICIPANTS + BONUS */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Max Participants"
                  className="p-2.5 border rounded-lg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_participants: e.target.value,
                    })
                  }
                />
                <input
                  type="number"
                  placeholder="Bonus %"
                  className="p-2.5 border rounded-lg"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      bonus_percentage: e.target.value,
                    })
                  }
                />
              </div>

              {/* TIME */}
              <input
                type="datetime-local"
                className="w-full p-2.5 border rounded-lg"
                onChange={(e) =>
                  setFormData({ ...formData, match_time: e.target.value })
                }
              />

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700">
                Create Tournament
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4">
          {tournaments.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 border rounded-xl shadow-sm flex justify-between"
            >
              <div>
                <h3 className="font-bold text-lg">{t.title}</h3>
                <div className="flex gap-4 text-sm mt-2">
                  <span className="text-green-600">
                    ₹{t.prize_pool}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {t.map_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(t.match_time).toLocaleString()}
                  </span>
                </div>
              </div>

              <button className="text-red-500">
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

