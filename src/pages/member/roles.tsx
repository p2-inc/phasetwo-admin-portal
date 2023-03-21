import SectionHeader from "components/navs/section-header";
import cs from "classnames";
import Button from "components/elements/forms/buttons/button";
import { useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery } from "store/apis/orgs";
import { useState } from "react";
import { config } from "config";
import { Link, useParams } from "react-router-dom";
import { User } from "lucide-react";
import RoleBadge from "components/elements/badges/role-badge";
import { Switch } from "@headlessui/react";

export const defaultRoles = [
  "view-organization",
  "manage-organization",
  "view-members",
  "manage-members",
  "view-roles",
  "manage-roles",
  "view-invitations",
  "manage-invitations",
  "view-identity-providers",
  "manage-identity-providers",
] as const;

const loadingIcon = (
  <div>
    <div className={cs("relative h-12 w-12 overflow-hidden rounded-md")}>
      <div className="absolute -inset-10 z-10 bg-gradient-to-tr from-[#C7DFF0] to-[#1476B7]"></div>
      <div className="absolute inset-[2px] z-20 flex items-center justify-center rounded bg-white">
        <User />
      </div>
    </div>
  </div>
);

const Loader = () => {
  return (
    <div className="flex space-x-2 justify-between py-4">
      <div className="flex space-x-2">
        <div className="animate-pulse">
          <div className="h-4 w-4 rounded-md bg-gray-300"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 w-20 rounded-md bg-gray-300"></div>
        </div>
      </div>
      <div className="animate-pulse">
        <div className="h-4 w-10 rounded-md bg-gray-300"></div>
      </div>
    </div>
  );
};

const SwitchItem = ({ name, isChecked }) => {
  const [enabled, setEnabled] = useState(isChecked);

  return (
    <Switch.Group>
      <div className="flex items-center justify-between py-2">
        <Switch.Label className="mr-4">
          <RoleBadge name={name} />
        </Switch.Label>
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={`${
            enabled ? "bg-blue-600" : "bg-gray-200"
          } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
        >
          <span
            className={`${
              enabled ? "translate-x-6" : "translate-x-1"
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </Switch>
      </div>
    </Switch.Group>
  );
};

const Roles = () => {
  let { orgId, memberId } = useParams();

  const { data: roles = [], isLoading } =
    useGetByRealmUsersAndUserIdOrgsOrgIdRolesQuery({
      orgId: orgId!,
      realm: config.env.realm,
      userId: memberId!,
    });

  const roleData = Array.from(defaultRoles)
    .sort()
    .map((item) => {
      return {
        name: item,
        isChecked: roles.findIndex((f) => f.name === item) >= 0,
      };
    });

  const isSendButtonDisabled = false;
  return (
    <div className="mt-4 md:mt-16">
      <SectionHeader
        title="Edit member roles"
        icon={loadingIcon}
        rightContent={
          <Link
            to={`/organizations/${orgId}/details`}
            className="inline-block rounded-lg px-4 py-2 font-medium opacity-60 transition hover:bg-gray-100 hover:opacity-100"
          >
            Cancel
          </Link>
        }
      />
      <form>
        <div className="mt-8 divide-y">
          {isLoading && <Loader />}
          {!isLoading &&
            roleData.map((item) => (
              <SwitchItem name={item.name} isChecked={item.isChecked} />
            ))}
          <div className="pt-4">
            <Button isBlackButton disabled={isSendButtonDisabled} type="submit">
              Edit roles
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Roles;
