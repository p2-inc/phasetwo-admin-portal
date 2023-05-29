import ProfileData from "./components/profile";
import DeleteProfile from "./components/delete";
import { config } from "config";
import Internationalization from "./components/internationalization";

const GeneralProfile = () => {
  const { features: featureFlags } = config.env;

  return (
    <div>
      <ProfileData />
      {featureFlags.internationalizationEnabled && <Internationalization />}
      {featureFlags.deleteAccountAllowed && <DeleteProfile />}
    </div>
  );
};

export default GeneralProfile;
