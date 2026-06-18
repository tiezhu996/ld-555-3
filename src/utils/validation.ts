import type { Player } from '../types/player';
import type { Team } from '../types/team';
import type { Tournament } from '../types/tournament';
import { isRankAtLeast } from './format';

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function clampNumber(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
}

export function checkTeamEligibility(
  team: Team,
  players: Player[],
  tournament: Tournament,
): EligibilityResult {
  const reasons: string[] = [];

  if (tournament.minTeamSize && team.members.length < tournament.minTeamSize) {
    reasons.push(`队伍人数不足（需 ${tournament.minTeamSize} 人，当前 ${team.members.length} 人）`);
  }

  if (tournament.minRank) {
    const teamPlayers = players.filter((player) => team.members.includes(player.id));
    const belowRankPlayers = teamPlayers.filter(
      (player) => !isRankAtLeast(player.rank, tournament.minRank!),
    );
    if (belowRankPlayers.length > 0) {
      reasons.push(`有 ${belowRankPlayers.length} 名队员段位未达到要求`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}
