import about from "../../content/about.json";
import projects from "../../content/projects.json";
import skills from "../../content/skills.json";
import experience from "../../content/experience.json";
import stats from "../../content/stats.json";
import photos from "../../content/photos.json";
import careerGoals from "../../content/kushgpt/career_goals.json";
import workPhilosophy from "../../content/kushgpt/work_philosophy.json";
import strengths from "../../content/kushgpt/strengths.json";
import kushgptAchievements from "../../content/kushgpt/achievements.json";
import learningJourney from "../../content/kushgpt/learning_journey.json";
import interviewAnswers from "../../content/kushgpt/interview_answers.json";
import funFacts from "../../content/kushgpt/fun_facts.json";
import githubRepos from "../../content/github_repos.json";
import now from "../../content/now.json";

export const content = {
  about,
  projects,
  skills,
  experience,
  stats,
  photos,
  githubRepos,
  now,
  kushgpt: {
    careerGoals,
    workPhilosophy,
    strengths,
    achievements: kushgptAchievements,
    learningJourney,
    interviewAnswers,
    funFacts,
  },
};

export type Project = (typeof projects)[number];
export type Photo = (typeof photos)[number];
