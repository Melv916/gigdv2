import { useLocation } from "react-router-dom";
import { ArticlePage } from "@/components/marketing/ArticlePage";
import { getSeoPageByPath } from "@/content/seoPages";
import NotFound from "./NotFound";

const SeoArticlePage = () => {
  const location = useLocation();
  const page = getSeoPageByPath(location.pathname);

  if (!page) {
    return <NotFound />;
  }

  return <ArticlePage page={page} />;
};

export default SeoArticlePage;
