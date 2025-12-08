export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', color: 'yellow' },
  { value: 'typescript', label: 'TypeScript', color: 'blue' },
  { value: 'python', label: 'Python', color: 'blue' },
  { value: 'html', label: 'HTML', color: 'orange' },
  { value: 'css', label: 'CSS', color: 'pink' },
  { value: 'json', label: 'JSON', color: 'green' },
  { value: 'sql', label: 'SQL', color: 'cyan' },
  { value: 'bash', label: 'Bash', color: 'gray' },
  { value: 'rust', label: 'Rust', color: 'orange' },
  { value: 'go', label: 'Go', color: 'cyan' },
  { value: 'java', label: 'Java', color: 'red' },
  { value: 'csharp', label: 'C#', color: 'purple' },
  { value: 'cpp', label: 'C++', color: 'blue' },
  { value: 'php', label: 'PHP', color: 'purple' },
  { value: 'ruby', label: 'Ruby', color: 'red' },
  { value: 'swift', label: 'Swift', color: 'orange' },
  { value: 'kotlin', label: 'Kotlin', color: 'purple' },
  { value: 'other', label: 'Other', color: 'gray' },
] as const;

export type Language = typeof LANGUAGES[number]['value'];

export function getLanguageClass(language: string): string {
  const lang = LANGUAGES.find(l => l.value === language);
  if (!lang) return 'language-default';
  return `language-${language}`;
}

export function getLanguageLabel(language: string): string {
  const lang = LANGUAGES.find(l => l.value === language);
  return lang?.label || language;
}
