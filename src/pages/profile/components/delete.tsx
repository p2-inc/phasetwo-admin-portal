import Button from "components/elements/forms/buttons/button";
import SectionHeader from "components/navs/section-header";
import { Link } from "react-router-dom";

const DeleteProfile = () => (
  <div className="pt-10">
    <div className="space-y-4 rounded border border-red-500 p-6">
      <SectionHeader
        variant="medium"
        title="Delete your profile"
        description="Permanently remove your profile and all of its contents. This action is not reversible, so please continue with caution."
      />
      <div>
        <Link to={`/profile-delete`}>
          <Button isBlackButton>Delete your profile</Button>
        </Link>
      </div>
    </div>
  </div>
);

export default DeleteProfile;
