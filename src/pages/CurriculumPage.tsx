import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { semesters, subjectsBySemester } from "../data/subjects";

export function CurriculumPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-10">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">Department Curriculum</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-ivory sm:text-4xl">Curriculum</h1>
      <p className="mt-2 max-w-xl text-sm text-ivory-faint">
        Literature organized the way it's taught — semester, paper, and subject — with each subject connecting
        out to its authors, works, and criticism.
      </p>

      <div className="mt-10 space-y-12">
        {semesters().map((sem) => (
          <div key={sem}>
            <h2 className="font-display text-xl font-semibold text-ivory">Semester {toRoman(sem)}</h2>
            <div className="mt-4 divide-y divide-border/70 border-y border-border/70">
              {subjectsBySemester(sem).map((subject, i) => (
                <Link
                  key={subject.slug}
                  to={`/curriculum/${subject.slug}`}
                  className="group flex items-center justify-between gap-4 py-4 transition-colors hover:bg-surface/50"
                >
                  <div className="flex min-w-0 items-baseline gap-4">
                    <span className="font-mono text-sm text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0">
                      <p className="truncate font-display text-base font-medium text-ivory group-hover:text-bronze-bright">
                        {subject.name}
                      </p>
                      <p className="font-mono text-[11px] uppercase tracking-wide text-ivory-faint">
                        {subject.paperCode}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-ivory-faint transition-transform group-hover:translate-x-1 group-hover:text-bronze-bright"
                  />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function toRoman(n: number) {
  const map: Record<number, string> = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII" };
  return map[n] ?? String(n);
}
