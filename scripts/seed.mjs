import { readFileSync } from "node:fs";
import { join } from "node:path";
import pg from "pg";
import { databaseUrl, loadEnv, root } from "./env.mjs";

loadEnv();
const url = databaseUrl();

function readJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

const docs = {
  about: readJson("content/about.json"),
  projects: readJson("content/projects.json"),
  skills: readJson("content/skills.json"),
  experience: readJson("content/experience.json"),
  stats: readJson("content/stats.json"),
  photos: readJson("content/photos.json"),
  "kushgpt.careerGoals": readJson("content/kushgpt/career_goals.json"),
  "kushgpt.workPhilosophy": readJson("content/kushgpt/work_philosophy.json"),
  "kushgpt.strengths": readJson("content/kushgpt/strengths.json"),
  "kushgpt.achievements": readJson("content/kushgpt/achievements.json"),
  "kushgpt.learningJourney": readJson("content/kushgpt/learning_journey.json"),
  "kushgpt.interviewAnswers": readJson("content/kushgpt/interview_answers.json"),
  "kushgpt.funFacts": readJson("content/kushgpt/fun_facts.json"),
  "kushgpt.personalStory": readFileSync(
    join(root, "content/kushgpt/personal_story.md"),
    "utf8",
  ),
  "kushgpt.systemPrompt": readFileSync(
    join(root, "content/kushgpt/assistant_system_prompt.txt"),
    "utf8",
  ),
};

const client = new pg.Client({ connectionString: url });
await client.connect();

for (const [key, payload] of Object.entries(docs)) {
  await client.query(
    `INSERT INTO content_documents (key, payload, updated_at)
     VALUES ($1, $2::jsonb, now())
     ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = now()`,
    [key, JSON.stringify(payload)],
  );
  console.log("seeded", key);
}

await client.end();
console.log("Seed complete.");
