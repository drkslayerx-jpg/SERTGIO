export interface SubNiche {
  title: string;
  description: string;
  competitionLevel: 'Baixa' | 'Média' | 'Alta';
  demandLevel: 'Média' | 'Alta' | 'Muito Alta';
  monetizationScore: number; // 1-10
  videoIdeas: string[];
  targetAudience: string;
  growthPotential: string; // Explanation of why it's strong
  scriptOutline: string; // New field for the video script
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: SubNiche[] | null;
}