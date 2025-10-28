export const MAGIC_8_BALL_ANSWERS = [
  "It is certain.",
  "Without a doubt.",
  "Yes – definitely.",
  "You may rely on it.",
  "Most likely.",
  "Outlook good.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "My reply is no.",
  "Outlook not so good.",
  "Very doubtful."
] as const

export function getRandomAnswer(): string {
  return MAGIC_8_BALL_ANSWERS[Math.floor(Math.random() * MAGIC_8_BALL_ANSWERS.length)]
}

