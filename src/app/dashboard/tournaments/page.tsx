"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";

export default function CreateTournamentPage() {
  const [step, setStep] = useState(1);
  const [games, setGames] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [mode, setMode] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    entry_fee: "",
    prize_pool: "",
    per_kill_points: "",
    map_name: "",
    match_time: "",
    max_participants: "",
    bonus_percentage: "",
    prize_breakup: "",
  });

  // 🔹 Fetch Games
  useEffect(() => {
    api.get("/games").then((res) => setGames(res.data));
  }, []);

  // 🔹 Prevent Step Skipping
  useEffect(() => {
    if (step === 2 && !selectedGame) setStep(1);
    if (step === 3 && (!selectedGame || !mode)) setStep(1);
  }, [step, selectedGame, mode]);

  const inputStyle =
    "w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500";

  // 🔹 Validation
  const validate = () => {
    if (!selectedGame) return "Please select a game first";
    if (!mode) return "Please select mode";

    if (!formData.title.trim()) return "Tournament title required";
    if (!formData.match_time) return "Match time required";

    if (Number(formData.entry_fee) < 0) return "Entry fee invalid";
    if (Number(formData.prize_pool) <= 0) return "Prize pool must be > 0";
    if (Number(formData.max_participants) <= 0)
      return "Participants must be > 0";

    if (Number(formData.per_kill_points) < 0)
      return "Per kill points invalid";

    if (Number(formData.bonus_percentage) < 0)
      return "Bonus cannot be negative";

    // Prize JSON validation
    try {
      if (formData.prize_breakup) {
        const parsed = JSON.parse(formData.prize_breakup);

        if (!Array.isArray(parsed)) {
          return "Prize breakup must be an array";
        }

        for (const item of parsed) {
          if (
            typeof item.rank !== "number" ||
            typeof item.amount !== "number"
          ) {
            return "Invalid prize format (rank/amount required)";
          }
        }
      }
    } catch {
      return "Invalid Prize JSON";
    }

    return null;
  };

  // 🔹 Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setMessage({ type: "error", text: error });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);

      await api.post("/tournaments/create", {
        ...formData,
        game_id: selectedGame.id, // ✅ correct mapping
        mode,
        entry_fee: Number(formData.entry_fee || 0),
        prize_pool: Number(formData.prize_pool || 0),
        per_kill_points: Number(formData.per_kill_points || 0),
        max_participants: Number(formData.max_participants || 0),
        bonus_percentage: Number(formData.bonus_percentage || 0),
        prize_breakup: formData.prize_breakup
          ? JSON.parse(formData.prize_breakup)
          : [],
      });

      setMessage({
        type: "success",
        text: "Tournament Created Successfully 🚀",
      });

      // Reset everything
      setStep(1);
      setSelectedGame(null);
      setMode("");
      setFormData({
        title: "",
        entry_fee: "",
        prize_pool: "",
        per_kill_points: "",
        map_name: "",
        match_time: "",
        max_participants: "",
        bonus_percentage: "",
        prize_breakup: "",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* MESSAGE */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg ${
            message.type === "error"
              ? "bg-red-500/20 text-red-300"
              : "bg-green-500/20 text-green-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* STEP BAR */}
      <div className="flex gap-3 mb-6">
        {["Game", "Mode", "Details"].map((s, i) => (
          <div
            key={i}
            className={`flex-1 text-center py-2 rounded-lg text-sm ${
              step === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {s}
          </div>
        ))}
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-white mb-4">Select Game</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {games.map((g) => (
              <div
                key={g.id}
                onClick={() => setSelectedGame(g)}
                className={`p-4 rounded-lg cursor-pointer border ${
                  selectedGame?.id === g.id
                    ? "border-indigo-500 bg-indigo-500/20"
                    : "border-slate-700"
                }`}
              >
                {g.name}
              </div>
            ))}
          </div>

          <button
            disabled={!selectedGame}
            onClick={() => setStep(2)}
            className={`mt-6 px-6 py-2 rounded-lg text-white ${
              selectedGame
                ? "bg-indigo-600"
                : "bg-slate-600 cursor-not-allowed"
            }`}
          >
            Next →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="bg-slate-900 p-6 rounded-xl">
          <h2 className="text-white mb-4">Select Mode</h2>

          <div className="flex gap-4">
            {["solo", "duo", "squad"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg ${
                  mode === m
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-800 text-slate-300"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <button onClick={() => setStep(1)}>← Back</button>

            <button
              disabled={!mode}
              onClick={() => setStep(3)}
              className={`px-6 py-2 rounded-lg text-white ${
                mode
                  ? "bg-indigo-600"
                  : "bg-slate-600 cursor-not-allowed"
              }`}
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 p-6 rounded-xl grid md:grid-cols-2 gap-5"
        >
          <input
            placeholder="Tournament Title"
            className={inputStyle}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Entry Fee"
            className={inputStyle}
            onChange={(e) =>
              setFormData({ ...formData, entry_fee: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Prize Pool"
            className={inputStyle}
            onChange={(e) =>
              setFormData({ ...formData, prize_pool: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Per Kill Reward"
            className={inputStyle}
            onChange={(e) =>
              setFormData({
                ...formData,
                per_kill_points: e.target.value,
              })
            }
          />

          <input
            placeholder="Map Name"
            className={inputStyle}
            onChange={(e) =>
              setFormData({ ...formData, map_name: e.target.value })
            }
          />

          <input
            type="datetime-local"
            className={inputStyle}
            onChange={(e) =>
              setFormData({ ...formData, match_time: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Max Participants"
            className={inputStyle}
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
            className={inputStyle}
            onChange={(e) =>
              setFormData({
                ...formData,
                bonus_percentage: e.target.value,
              })
            }
          />

          <textarea
            placeholder='Prize JSON [{"rank":1,"amount":1000}]'
            className={`md:col-span-2 ${inputStyle}`}
            onChange={(e) =>
              setFormData({
                ...formData,
                prize_breakup: e.target.value,
              })
            }
          />

          <div className="col-span-2 flex justify-between mt-4">
            <button type="button" onClick={() => setStep(2)}>
              ← Back
            </button>

            <button
              disabled={loading}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-lg text-white"
            >
              {loading ? "Creating..." : "🚀 Create Tournament"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}