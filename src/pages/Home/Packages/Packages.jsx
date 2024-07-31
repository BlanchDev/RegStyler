import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { getPackages } from "../../../services/packageService";
import "./Packages.css";
import { Link } from "react-router-dom";
import { IoMdSettings } from "react-icons/io";
import { Helmet } from "react-helmet";
import { formatDistanceToNowStrict } from "date-fns";
import { motion } from "framer-motion";

function Packages() {
  const { uid, token, browser } = useAuth();
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      const fetchedPackages = await getPackages(uid, token, browser);
      setPackages(fetchedPackages);
    };

    fetchPackages();
  }, [uid, token, browser]);

  return (
    <div className='packages-layout form-container column aifs jcsb'>
      <Helmet>
        <title>My Packages</title>
      </Helmet>
      <section className='column gap10'>
        <div className='packages'>
          {packages.map((pack, index) => {
            const optimizations = JSON.parse(pack.optimizations);
            return (
              <motion.div
                className='package row aic jcsb'
                key={pack.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.001 }}
              >
                <div className='header column aic gap10'>
                  <div className='title row aic jcc'>{pack.title}</div>
                  <div className='description column jcsb'>
                    <p className='row aic'>{pack.description}</p>
                    <div className='analytics-item row aic gap5'>
                      <IoMdSettings />
                      {optimizations.length}
                    </div>
                  </div>
                </div>
                <div className='footer column aic jcsb'>
                  <div className='userData row aic gap10'>
                    <div className='userInfo column aic gap5'>
                      <div className='column aic'>
                        <div className={`nickname ${pack.role}`}>
                          {pack.nickname}
                        </div>
                        <div className='role'>{pack.role}</div>
                      </div>
                      <div className='created-at'>
                        {formatDistanceToNowStrict(
                          new Date(pack.createdAt * 1000),
                        )}
                      </div>
                    </div>
                  </div>
                  <div className='row aic jcc w100'>
                    <Link
                      to={`/package/${pack.urlParam}`}
                      className='button dark row aic jcc'
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Packages;
