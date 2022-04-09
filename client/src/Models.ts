export type Champion = {
  name: string;
  health: number;
  maxHealth: number;
  attackPower: number;
  healPower: number;
  gifUris: GifStatus;
};

export type GifStatus = {
  idle: string;
  attack: string;
  hurt: string;
  dying: string;
  dead: string;
};

export enum ArenaState {
  NotStarted = 0,
  InProgress = 1,
  Finished = 2,
}