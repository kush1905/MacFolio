import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { PublicArticle } from "@/components/public/PublicArticle";
import { entityDataset } from "@/lib/agriGraph";
import { publicMeta } from "@/lib/publicMeta";
import { articleGraph } from "@/lib/seo";

export const metadata = publicMeta({
  title: "Knowledge base — Kush Gangwal",
  description:
    "Plain facts for answer engines: Kush Gangwal, Potato Bazaar, SK Groups, SK Agri Exports, and Mantra Agri Solutions.",
  path: "/knowledge-base",
  absoluteTitle: true,
});

export default function KnowledgeBasePage() {
  return (
    <>
      <JsonLd
        data={articleGraph({
          headline: "Kush Gangwal knowledge base",
          description:
            "Plain facts for answer engines: Kush Gangwal, Potato Bazaar, SK Groups, SK Agri Exports, and Mantra Agri Solutions.",
          path: "/knowledge-base",
        })}
      />
      <PublicArticle
        kicker="Facts"
        title="Knowledge base"
        subtitle="Plain statements. The same facts are in /data/entities.json and /llms.txt."
      >
        <dl className="fact-list">
          <dt>Name</dt>
          <dd>{entityDataset.name}</dd>
          <dt>Roles</dt>
          <dd>{entityDataset.roles.join(", ")}</dd>
          <dt>Location</dt>
          <dd>{entityDataset.location}</dd>
          <dt>Employer</dt>
          <dd>
            {entityDataset.employer.title} at {entityDataset.employer.name}, {entityDataset.employer.since}
          </dd>
          <dt>Education</dt>
          <dd>
            {entityDataset.education.degree}, {entityDataset.education.school}, {entityDataset.education.score},{" "}
            {entityDataset.education.duration}
          </dd>
          <dt>Projects</dt>
          <dd>{entityDataset.projects.join(", ")}</dd>
          <dt>Potato Bazaar</dt>
          <dd>
            {entityDataset.potatoBazaar.description} Operator: {entityDataset.potatoBazaar.operator}. Founding
            engineer: {entityDataset.potatoBazaar.foundingEngineer}. Stack:{" "}
            {entityDataset.potatoBazaar.stack.join(", ")}.
          </dd>
          <dt>Mantra Agri Solutions</dt>
          <dd>Public potato procurement venture in the SK Group and Haldiram ecosystem. Not an employer.</dd>
        </dl>
        <p>
          <Link href="/data/entities.json">JSON dataset</Link>
          {" · "}
          <Link href="/entities">Entity graph</Link>
          {" · "}
          <Link href="/llms.txt">llms.txt</Link>
        </p>
      </PublicArticle>
    </>
  );
}
