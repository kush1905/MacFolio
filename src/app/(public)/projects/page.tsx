import { JsonLd } from "@/components/seo/JsonLd";
import { ProjectCard } from "@/components/public/ProjectCard";
import { PublicArticle } from "@/components/public/PublicArticle";
import { allProjects } from "@/lib/portfolio";
import { PERSON_NAME, personId } from "@/lib/identity";
import { publicMeta } from "@/lib/publicMeta";
import { personNode } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata = publicMeta({
  title: `Projects by ${PERSON_NAME}`,
  description: `Case studies by ${PERSON_NAME}: Nexus, Resumind, CodeMace, Potato Bazaar, Tybee Go, Findanio, and Macfolio.`,
  path: "/projects",
});

export default function ProjectsIndexPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            personNode(),
            {
              "@type": "CollectionPage",
              name: `Projects by ${PERSON_NAME}`,
              url: `${SITE_URL}/projects`,
              about: { "@id": personId },
            },
          ],
        }}
      />
      <PublicArticle
        kicker="Case studies"
        title={`Projects by ${PERSON_NAME}`}
        subtitle="Case studies of the products Kush Gangwal has built or worked on."
        width="wide"
      >
        <div className="project-grid">
          {allProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </PublicArticle>
    </>
  );
}
