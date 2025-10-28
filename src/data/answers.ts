export const MAGIC_8_BALL_ANSWERS = [
  "É certo.",
  "Sem dúvida.",
  "Sim! definitivamente.",
  "Você pode contar com isso.",
  "Muito provável.",
  "Perspectiva boa.",
  "Resposta nebulosa, tente novamente.",
  "Pergunte novamente mais tarde.",
  "Melhor não te dizer agora.",
  "Minha resposta é não.",
  "Perspectiva não tão boa.",
  "Muito duvidoso."
] as const

export function getRandomAnswer(): string {
  return MAGIC_8_BALL_ANSWERS[Math.floor(Math.random() * MAGIC_8_BALL_ANSWERS.length)]
}

