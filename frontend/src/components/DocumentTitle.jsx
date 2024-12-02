import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const DocumentTitle = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/login":
        return "Login | Pet Home";
      case "/registro":
        return "Registro | Pet Home";
      case "/dashboard":
        return "Dashboard | Pet Home";
      default:
        return "Pet Home | Inicio";
    }
  };

  return (
    <Helmet>
      <title>{getPageTitle()}</title>
    </Helmet>
  );
};

export default DocumentTitle;
