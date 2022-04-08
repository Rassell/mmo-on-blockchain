export function transformCharacterData(characterData: any) {
  const result = {
    name: characterData.name,
    health: characterData.health?.toNumber(),
    maxHealth: characterData.maxHealth?.toNumber(),
    attackPower: characterData.attackPower?.toNumber(),
    healPower: characterData.healPower?.toNumber(),
    gifUris: characterData.gifUris,
  };
  console.log("Formatting Character Data", characterData, result);
  return result;
}

export type MMOCharacterData = ReturnType<typeof transformCharacterData>;
