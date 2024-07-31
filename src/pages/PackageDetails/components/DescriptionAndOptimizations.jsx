import { IoArrowBack } from "react-icons/io5";
import PackageRegSwitch from "../switch/PackageRegSwitch";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";

function DescriptionAndOptimizations({
  packageID,
  packageDetails,
  checkedRegSettings,
  setCheckedRegSettings,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredRegSettings, setFilteredRegSettings] = useState([]);
  const [filter, setFilter] = useState({ category: "all", owner: "all" });

  useEffect(() => {
    if (packageDetails?.optimizations && checkedRegSettings?.length === 0) {
      const newCheckedRegSettings = packageDetails.optimizations.map(
        (optimization) => {
          return {
            id: optimization?.id,
            title: optimization?.title,
            code: optimization?.code,
            owner: optimization?.owner,
          };
        },
      );

      if (newCheckedRegSettings?.length > 0) {
        setCheckedRegSettings([
          ...checkedRegSettings,
          ...newCheckedRegSettings,
        ]);
      }
    }
  }, [packageDetails, checkedRegSettings, packageID, setCheckedRegSettings]);

  useEffect(() => {
    setFilteredRegSettings(packageDetails?.optimizations || []);
  }, [packageDetails]);

  useEffect(() => {
    const applyFilter = () => {
      let filtered = packageDetails?.optimizations || [];
      if (filter.category && filter.category !== "all") {
        filtered = filtered.filter((reg) => reg.category === filter.category);
      }
      if (filter.owner && filter.owner !== "all") {
        filtered = filtered.filter((reg) => reg.owner === filter.owner);
      }
      if (filter.category === "all") {
        filtered = filtered.filter((reg) =>
          ["system", "graphic", "internet", "privacy", "other"].includes(
            reg.category,
          ),
        );
      }
      if (filter.owner === "all") {
        filtered = filtered.filter(
          (reg) => reg.owner === "user" || reg.owner === "admin",
        );
      }
      setFilteredRegSettings(filtered);
    };

    applyFilter();
  }, [filter, packageDetails]);

  return (
    <section className='column aic gap10'>
      <div className='header column aic'>
        <div className='title row aic jcc'>
          <button
            className='row aic jcc button dark'
            onClick={() =>
              location?.key === "default"
                ? navigate("/home/packages")
                : navigate(-1)
            }
          >
            <IoArrowBack /> Back
          </button>
          <div className='title-text row aic jcc'>
            {packageDetails?.title ? packageDetails?.title : null}
            {packageDetails?.error ? packageDetails?.error : null}
          </div>
        </div>
        <div className='package-description column aic gap10'>
          <div className='creator row aic gap10'>
            <div className='creator-details column'>
              <div className='row aic gap10'>
                <div className={`row aic nickname ${packageDetails?.role}`}>
                  {packageDetails?.nickname ? packageDetails?.nickname : null}
                  {packageDetails?.error
                    ? "Warning: This package is not available."
                    : null}
                </div>
                <div className='created-at row aic'>
                  {(() => {
                    if (packageDetails?.createdAt) {
                      return formatDistanceToNowStrict(
                        new Date(packageDetails?.createdAt * 1000),
                      );
                    } else if (packageDetails?.error) {
                      return "";
                    } else {
                      return "Date Error";
                    }
                  })()}
                </div>
              </div>
              <div className='role'>
                {packageDetails?.role ? packageDetails?.role : null}
                {packageDetails?.error ? "system" : null}
              </div>
            </div>
          </div>
          <p className='description row'>
            {packageDetails.description ? packageDetails?.description : null}
            {packageDetails?.error
              ? "Are there any problems? If you are sure that this was working before, the owner of the package may have removed the package from the store."
              : null}
          </p>
        </div>
      </div>
      {!packageDetails?.error && (
        <>
          <div className='filter-controls row aic gap10'>
            <select
              className='select'
              value={filter.category || "all"}
              onChange={(e) =>
                setFilter({ ...filter, category: e.target.value })
              }
            >
              <option value='all'>All Categories</option>
              <option value='system'>System</option>
              <option value='graphic'>Graphic</option>
              <option value='internet'>Internet</option>
              <option value='privacy'>Privacy</option>
              <option value='other'>Other</option>
            </select>
            <select
              className='select'
              value={filter.owner || "all"}
              onChange={(e) => setFilter({ ...filter, owner: e.target.value })}
            >
              <option value='all'>All Owners</option>
              <option value='user'>Custom</option>
              <option value='admin'>Default</option>
            </select>
          </div>
          <div className='optimizations-layout'>
            {filteredRegSettings.some((reg) => reg.owner === "user") && (
              <div className='owner-tag row aic gap20'>
                {packageDetails?.nickname}&apos;s Custom Optimizations{" "}
                {
                  filteredRegSettings.filter((reg) => reg.owner === "user")
                    .length
                }
                <div className='fastcheck-btns row aic gap10'>
                  <button
                    className='check-button check'
                    onClick={() => {
                      const userRegs = filteredRegSettings.filter(
                        (reg) =>
                          reg.owner === "user" &&
                          !checkedRegSettings.some(
                            (checked) => checked.id === reg.id,
                          ),
                      );
                      setCheckedRegSettings([
                        ...checkedRegSettings,
                        ...userRegs.map((reg) => ({
                          id: reg.id,
                          title: reg.title,
                          code: reg.code,
                          owner: reg.owner,
                        })),
                      ]);
                    }}
                  >
                    Check All
                  </button>
                  <button
                    className='check-button uncheck'
                    onClick={() => {
                      const uncheckedUserSettings = checkedRegSettings.filter(
                        (reg, index) => reg.owner !== "user" || index === 0,
                      );

                      setCheckedRegSettings(uncheckedUserSettings);
                    }}
                  >
                    Uncheck All Except First
                  </button>
                </div>
              </div>
            )}
            {filteredRegSettings
              .filter((reg) => reg.owner === "user")
              .map((reg, index) => (
                <PackageRegSwitch
                  key={reg.id}
                  id={reg.id}
                  title={reg.title}
                  description={reg.description}
                  code={reg.code}
                  category={reg.category}
                  owner={reg.owner}
                  createdAt={reg.createdAt}
                  checkedRegSettings={checkedRegSettings}
                  setCheckedRegSettings={setCheckedRegSettings}
                  packageID={packageID}
                  animationDelay={index * 0.001}
                />
              ))}
            {filteredRegSettings.some((reg) => reg.owner === "admin") && (
              <div className='owner-tag row aic gap20'>
                Default Optimizations{" "}
                {
                  filteredRegSettings.filter((reg) => reg.owner === "admin")
                    .length
                }
                <div className='fastcheck-btns row aic gap10'>
                  <button
                    className='check-button check'
                    onClick={() => {
                      const adminRegs = filteredRegSettings.filter(
                        (reg) =>
                          reg.owner === "admin" &&
                          !checkedRegSettings.some(
                            (checked) => checked.id === reg.id,
                          ),
                      );
                      setCheckedRegSettings([
                        ...checkedRegSettings,
                        ...adminRegs.map((reg) => ({
                          id: reg.id,
                          title: reg.title,
                          code: reg.code,
                          owner: reg.owner,
                        })),
                      ]);
                    }}
                  >
                    Check All
                  </button>
                  <button
                    className='check-button uncheck'
                    onClick={() => {
                      const uncheckedAdminSettings = checkedRegSettings.filter(
                        (reg, index) => reg.owner !== "admin" || index === 0,
                      );
                      setCheckedRegSettings(uncheckedAdminSettings);
                    }}
                  >
                    Uncheck All Except First
                  </button>
                </div>
              </div>
            )}
            {filteredRegSettings
              .filter((reg) => reg.owner === "admin")
              .map((reg, index) => (
                <PackageRegSwitch
                  key={reg.id}
                  id={reg.id}
                  title={reg.title}
                  description={reg.description}
                  code={reg.code}
                  category={reg.category}
                  owner={reg.owner}
                  createdAt={reg.createdAt}
                  checkedRegSettings={checkedRegSettings}
                  setCheckedRegSettings={setCheckedRegSettings}
                  packageID={packageID}
                  animationDelay={index * 0.001}
                />
              ))}
          </div>
        </>
      )}
    </section>
  );
}

DescriptionAndOptimizations.propTypes = {
  packageID: PropTypes.string,
  packageDetails: PropTypes.object,
  checkedRegSettings: PropTypes.array,
  setCheckedRegSettings: PropTypes.func,
};

export default DescriptionAndOptimizations;
