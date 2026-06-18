import { PlayerRank, type TournamentFormat, type TournamentStatus } from '../constants/enums';

export function winRate(wins: number, losses: number): number {
  const total = wins + losses;
  return total === 0 ? 0 : Math.round((wins / total) * 100);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat('zh-CN', { month: '2-digit', day: '2-digit' }).format(new Date(value));
}

export const tournamentFormatLabels: Record<TournamentFormat, string> = {
  SINGLE_ELIM: '单败淘汰',
  DOUBLE_ELIM: '双败淘汰',
  ROUND_ROBIN: '循环赛',
  POINT_BASED: '积分赛',
};

export const tournamentStatusLabels: Record<TournamentStatus, string> = {
  REGISTRATION: '报名中',
  IN_PROGRESS: '进行中',
  FINISHED: '已结束',
};

const rankOrder: PlayerRank[] = [
  PlayerRank.BRONZE,
  PlayerRank.SILVER,
  PlayerRank.GOLD,
  PlayerRank.PLATINUM,
  PlayerRank.DIAMOND,
  PlayerRank.MASTER,
  PlayerRank.GRANDMASTER,
];

export const playerRankLabels: Record<PlayerRank, string> = {
  BRONZE: '青铜',
  SILVER: '白银',
  GOLD: '黄金',
  PLATINUM: '铂金',
  DIAMOND: '钻石',
  MASTER: '大师',
  GRANDMASTER: '宗师',
};

export function getRankIndex(rank: PlayerRank): number {
  return rankOrder.indexOf(rank);
}

export function isRankAtLeast(playerRank: PlayerRank, minRank: PlayerRank): boolean {
  return getRankIndex(playerRank) >= getRankIndex(minRank);
}
