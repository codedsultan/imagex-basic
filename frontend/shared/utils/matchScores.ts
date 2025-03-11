export enum ScoreColor {
  '90+' = '#1b6',
  '80+' = '#bd4',
  '61+' = '#fd2',
  '41+' = '#f74',
  '0+' = '#f34',
}

export const getScoreColor = (percentScore: number) => {
  if (percentScore >= 90) {
    return ScoreColor['90+'];
  }
  if (percentScore >= 80) {
    return ScoreColor['80+'];
  }
  if (percentScore >= 61) {
    return ScoreColor['61+'];
  }
  if (percentScore >= 41) {
    return ScoreColor['41+'];
  }
  return ScoreColor['0+'];
};
