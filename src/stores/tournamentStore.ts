import { create } from 'zustand';
import { tournamentDb } from '../db/tournament-db';
import type { Tournament } from '../types/tournament';
import { withFriendlyError } from '../utils/storage';
import { checkTeamEligibility, type EligibilityResult } from '../utils/validation';
import { usePlayerStore } from './playerStore';
import { useTeamStore } from './teamStore';

interface TournamentState {
  tournaments: Tournament[];
  loading: boolean;
  loadTournaments: () => Promise<void>;
  createTournament: (tournament: Tournament) => Promise<void>;
  registerTeam: (tournamentId: string, teamId: string) => Promise<EligibilityResult>;
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  tournaments: [],
  loading: false,
  loadTournaments: async () => {
    set({ loading: true });
    try {
      const tournaments = await withFriendlyError(() => tournamentDb.getAll());
      set({ tournaments, loading: false });
    } catch {
      set({ loading: false });
    }
  },
  createTournament: async (tournament) => {
    const saved = await withFriendlyError(() => tournamentDb.save(tournament));
    set((state) => ({ tournaments: [saved, ...state.tournaments] }));
  },
  registerTeam: async (tournamentId, teamId) => {
    const tournament = get().tournaments.find((item) => item.id === tournamentId);
    if (!tournament) return { eligible: false, reasons: ['赛事不存在'] };
    if (tournament.teams.includes(teamId)) return { eligible: true, reasons: [] };

    const teams = useTeamStore.getState().teams;
    const players = usePlayerStore.getState().players;
    const team = teams.find((item) => item.id === teamId);
    if (!team) return { eligible: false, reasons: ['队伍不存在'] };

    const eligibility = checkTeamEligibility(team, players, tournament);
    if (!eligibility.eligible) return eligibility;

    const saved = await withFriendlyError(() => tournamentDb.save({ ...tournament, teams: [...tournament.teams, teamId] }));
    set((state) => ({ tournaments: state.tournaments.map((item) => (item.id === saved.id ? saved : item)) }));
    return { eligible: true, reasons: [] };
  },
}));
