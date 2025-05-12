export type ChatUser = {
  userId: string;
  nickname: string;
};

export function generateNewUser(): ChatUser {
  const adjectives = [
    "Brave",
    "Clever",
    "Witty",
    "Fierce",
    "Jolly",
    "Curious",
    "Swift",
    "Chill",
    "Bold",
    "Cheerful",
    "Radiant",
    "Fearless",
  ];

  const firstNames = [
    "Alex",
    "Jamie",
    "Taylor",
    "Jordan",
    "Sam",
    "Morgan",
    "Casey",
    "Riley",
    "Quinn",
    "Cameron",
    "Avery",
    "Dakota",
    "Skyler",
    "Elliot",
    "Reese",
    "Rowan",
    "Phoenix",
    "Emerson",
    "Harley",
    "Lennon",
  ];

  const randomFrom = (arr: string[]) =>
    arr[Math.floor(Math.random() * arr.length)];

  const nickname = `${randomFrom(adjectives)} ${randomFrom(firstNames)}`;
  const userId = crypto.randomUUID();

  return { userId, nickname };
}
