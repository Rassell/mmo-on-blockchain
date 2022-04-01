export function transformCharacterData(characterData: any) {
  console.log("Formatting Character Data:", characterData);
  return {
    name: characterData.name,
    health: characterData.health?.toNumber(),
    maxHealth: characterData.maxHealth?.toNumber(),
    attackPower: characterData.attackPower?.toNumber(),
    healPower: characterData.healPower?.toNumber(),
    gifUris: characterData.gifUris,
  };
}

export type MMOCharacterData = ReturnType<typeof transformCharacterData>;
