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
