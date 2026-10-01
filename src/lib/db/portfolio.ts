import { content } from "@/lib/content";
import { loadAllContentDocuments } from "@/lib/db/queries";

export async function portfolioPayload() {
  const docs = await loadAllContentDocuments();
  if (!docs || !docs.about) {
    return { source: "json" as const, content };
  }
  return {
    source: "postgres" as const,
    content: {
      about: docs.about,
      projects: docs.projects,
      skills: docs.skills,
      experience: docs.experience,
      stats: docs.stats,
      photos: docs.photos,
      kushgpt: {
        careerGoals: docs["kushgpt.careerGoals"],
        workPhilosophy: docs["kushgpt.workPhilosophy"],
        strengths: docs["kushgpt.strengths"],
        achievements: docs["kushgpt.achievements"],
        learningJourney: docs["kushgpt.learningJourney"],
        interviewAnswers: docs["kushgpt.interviewAnswers"],
        funFacts: docs["kushgpt.funFacts"],
        personalStory: docs["kushgpt.personalStory"],
        systemPrompt: docs["kushgpt.systemPrompt"],
      },
    },
  };
}
