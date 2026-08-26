import { Link } from "react-router-dom";
import { BookMarked } from "lucide-react";
import { AccordionItem } from "../ui/Accordion";

function GithubMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.1 3.29 9.4 7.86 10.94.57.1.78-.25.78-.55v-2.1c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.39-5.25 5.67.42.36.78 1.08.78 2.17v3.22c0 .3.2.66.79.55A10.96 10.96 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink-soft">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-ivory">
          <BookMarked size={19} className="text-bronze" />
          English Literature Library
        </div>
        <p className="mt-2 max-w-md text-sm text-ivory-faint">
          A digital literary resource for students, readers, and curious minds.
        </p>
        <p className="mt-1 font-mono text-xs uppercase tracking-wider text-bronze-bright">
          Powered by Tensoramax Lab
        </p>

        <div className="mt-8 border-t border-border/70">
          <AccordionItem title="About the Project">
            English Literature Library is a curriculum-aware discovery platform built to organize literary study
            the way students actually navigate it — by semester, paper, subject, author, and work — rather than
            as a flat list of titles.
          </AccordionItem>
          <AccordionItem title="Who Created This?">
            <p className="font-display text-base not-italic text-ivory">Yuri</p>
            <p className="mb-3 text-xs text-ivory-faint">English Literature Student · Developer · Creator of Tensoramax Lab</p>
            <p>
              Yuri is an English Literature student, developer, and creator of Tensoramax Lab, a student-led
              technology initiative focused on software development, open-source experimentation, and
              language-model research. Coming from a humanities background, he developed an interest in large
              and small language models, dataset engineering, fine-tuning, model experimentation, retrieval
              systems, and open-source development. English Literature Library combines his academic field with
              his interest in building language technology and digital tools. The long-term goal is to explore
              how language models can help students discover and navigate literature while maintaining reliable
              source attribution.
            </p>
          </AccordionItem>
          <AccordionItem title="About Tensoramax Lab">
            Tensoramax Lab is an independent student-led technology and research initiative exploring practical
            software, language models, open-source tools, experimental systems, and digital infrastructure. The
            Literature Library is one project within the Tensoramax ecosystem.
          </AccordionItem>
          <AccordionItem title="Technology & Development">
            Built with React, TypeScript, and Tailwind CSS. Areas of ongoing work across the Tensoramax
            ecosystem include software development, LLMs and SLMs, fine-tuning, dataset engineering, retrieval
            systems, and open-source tooling.
          </AccordionItem>
          <AccordionItem title="Sources & Attribution">
            <p className="mb-2">
              Book covers, author portraits, and reading texts are drawn from public-domain and open-access
              archives, with source and license information preserved for every item.
            </p>
            <Link to="/resources/sources" className="text-bronze-bright hover:underline">
              View full Sources &amp; Credits →
            </Link>
          </AccordionItem>
          <AccordionItem title="Open Source">
            This project is intended to become a public, open-source repository. Contributions, corrections, and
            curriculum additions will be welcome once the repository is public.
          </AccordionItem>
          <AccordionItem title="Future Development">
            A future LLM Librarian is planned — a retrieval system that answers questions about the curated
            library rather than a general-purpose chatbot. It is not active in this build.
          </AccordionItem>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 font-mono text-xs italic text-ivory-faint transition-colors hover:text-bronze-bright"
          >
            <GithubMark />
            where the code sleeps → GitHub
          </a>
          <p className="font-mono text-xs text-ivory-faint">
            © 2026 English Literature Library · Powered by Tensoramax Lab
          </p>
        </div>
      </div>
    </footer>
  );
}
