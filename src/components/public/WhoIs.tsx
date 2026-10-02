import { PERSON_NAME } from "@/lib/identity";
import { content } from "@/lib/content";

const PROJECTS = ["Potato Bazaar", "Tybee Go", "Nexus", "Resumind", "CodeMace"] as const;

export function WhoIs() {
  return (
    <section className="who-is-kush-gangwal public-who" id="who-is-kush-gangwal">
      <h2>Who is {PERSON_NAME}?</h2>
      <p>
        Kush Gangwal is a Full Stack Developer from India specializing in React Native, React.js,
        Next.js, Node.js and AI-powered applications.
      </p>
      <p>He has worked on:</p>
      <ul>
        {PROJECTS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
      <p>{content.about.whoIs}</p>
    </section>
  );
}
