import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { HomePage } from "./pages/HomePage";
import { LibraryPage } from "./pages/LibraryPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { CurriculumPage } from "./pages/CurriculumPage";
import { SubjectDetailPage } from "./pages/SubjectDetailPage";
import { AuthorsPage } from "./pages/AuthorsPage";
import { AuthorDetailPage } from "./pages/AuthorDetailPage";
import { PeriodsPage } from "./pages/PeriodsPage";
import { PeriodDetailPage } from "./pages/PeriodDetailPage";
import { GenresPage } from "./pages/GenresPage";
import { SearchPage } from "./pages/SearchPage";
import { ResourcesPage, SourcesCreditsPage } from "./pages/ResourcesPage";

function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-[800px] flex-col items-center gap-2 px-4 py-24 text-center">
      <p className="font-display text-xl italic text-ivory-dim">This shelf is empty.</p>
      <p className="text-sm text-ivory-faint">The page you're looking for doesn't exist in this catalogue.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/library/:slug" element={<BookDetailPage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/curriculum/:slug" element={<SubjectDetailPage />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/authors/:slug" element={<AuthorDetailPage />} />
          <Route path="/periods" element={<PeriodsPage />} />
          <Route path="/periods/:slug" element={<PeriodDetailPage />} />
          <Route path="/genres" element={<GenresPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/sources" element={<SourcesCreditsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
