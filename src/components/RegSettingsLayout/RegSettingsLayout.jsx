import { useEffect, useState } from "react";
import RegSwitch from "../RegSwitch/RegSwitch";
import "./RegSettingsLayout.css";
import CreatePackageModal from "../../utils/Modals/PackageModal/CreatePackageModal";
import { getOptimizations } from "../../services/optimizationsService";
import useAuth from "../../hooks/useAuth";

function RegSettingsLayout() {
  const { uid, token, browser } = useAuth();

  const [regSettings, setRegSettings] = useState([]);
  const [filteredRegSettings, setFilteredRegSettings] = useState([]);
  const [filter, setFilter] = useState({ category: "all", owner: "all" });

  const [checkedRegSettings, setCheckedRegSettings] = useState(
    JSON.parse(localStorage.getItem("checkedRegSettings")) || [],
  );

  const [isCreatePackageModalOpen, setIsCreatePackageModalOpen] =
    useState(false);

  // Fetch Reg Settings
  useEffect(() => {
    const fetchRegSettings = async () => {
      const optimizations = await getOptimizations(uid, token, browser);

      let reOrderedOptimizations = optimizations.sort((a, b) => {
        const order = ["system", "graphic", "internet", "privacy", "other"];
        return order.indexOf(a.category) - order.indexOf(b.category);
      });
      reOrderedOptimizations = reOrderedOptimizations.sort((a, b) => {
        const order = ["user", "admin"];
        return order.indexOf(a.owner) - order.indexOf(b.owner);
      });

      setRegSettings(reOrderedOptimizations);
      setFilteredRegSettings(reOrderedOptimizations);

      const localCheckeds =
        JSON.parse(localStorage.getItem("checkedRegSettings")) || [];
      const unmatchedCheckeds = filterUnmatchedCheckeds(
        localCheckeds,
        optimizations,
      );

      setCheckedRegSettings(unmatchedCheckeds);
    };

    fetchRegSettings();
  }, [uid, token, browser]);

  const filterUnmatchedCheckeds = (localCheckeds, optimizations) => {
    return optimizations.filter((opt) =>
      localCheckeds.some((localChecked) => localChecked.id === opt.id),
    );
  };

  // Filter Reg Settings
  useEffect(() => {
    const applyFilter = () => {
      let filtered = regSettings;
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
  }, [filter, regSettings]);

  const downloadCheckedRegSettings = () => {
    const regHeader = `Windows Registry Editor Version 5.00\n\n`;
    const regComments = `; RegStyler.blanch.dev\n\n`;
    const regContent = checkedRegSettings.map((reg) => reg.code).join("\n");

    const fullRegContent = `${regHeader}${regComments}${regContent}`;

    const blob = new Blob([fullRegContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "RegStyler_MyOptimizations.reg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='reg-settings-layout form-container column aifs jcsb'>
      <div className='filter-controls row aic gap10'>
        <select
          className='select'
          value={filter.category || "all"}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
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
      <section className='column aic gap10'>
        <div className='reg-settings'>
          {filteredRegSettings.some((reg) => reg.owner === "user") && (
            <div className='owner-tag row aic gap20'>
              My Optimizations{" "}
              {filteredRegSettings.filter((reg) => reg.owner === "user").length}
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
                      (reg) =>
                        !filteredRegSettings.some(
                          (filteredReg) =>
                            filteredReg.id === reg.id &&
                            filteredReg.owner === "user",
                        ),
                    );

                    setCheckedRegSettings(uncheckedUserSettings);
                  }}
                >
                  Uncheck All
                </button>
              </div>
            </div>
          )}
          {filteredRegSettings
            .filter((reg) => reg.owner === "user")
            .map((reg, index) => (
              <RegSwitch
                uid={uid}
                token={token}
                browser={browser}
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
                setRegSettings={setRegSettings}
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
                      (reg) =>
                        !filteredRegSettings.some(
                          (filteredReg) =>
                            filteredReg.id === reg.id &&
                            filteredReg.owner === "admin",
                        ),
                    );

                    setCheckedRegSettings(uncheckedAdminSettings);
                  }}
                >
                  Uncheck All
                </button>
              </div>
            </div>
          )}
          {filteredRegSettings
            .filter((reg) => reg.owner === "admin")
            .map((reg, index) => (
              <RegSwitch
                uid={uid}
                token={token}
                browser={browser}
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
                setRegSettings={setRegSettings}
                animationDelay={index * 0.001}
              />
            ))}
        </div>
      </section>
      <div className='reg-settings-footer row aic jcsb gap20'>
        <div className='row aic jcfs gap10'>
          <button
            className='button green'
            disabled={checkedRegSettings.length < 1}
            onClick={downloadCheckedRegSettings}
          >
            Download
          </button>
          <button
            className='button purple'
            onClick={() => setIsCreatePackageModalOpen(true)}
            disabled={checkedRegSettings.length < 1}
          >
            Create Package
          </button>
          <CreatePackageModal
            isCreatePackageModalOpen={isCreatePackageModalOpen}
            setIsCreatePackageModalOpen={setIsCreatePackageModalOpen}
          />
        </div>

        <div className='row aic '>
          <p className='label'>{checkedRegSettings.length} Selected</p>
        </div>
      </div>
    </div>
  );
}

export default RegSettingsLayout;
