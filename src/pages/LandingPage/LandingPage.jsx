import { Helmet } from "react-helmet";
import "./LandingPage.css";
import LandingOptimizations from "./components/LandingOptimizations";
import rlogo from "/r.svg";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function LandingPage() {
  const [currentSubtitle, setCurrentSubtitle] = useState(0);
  const [shuffledSubtitles, setShuffledSubtitles] = useState([]);

  const subtitles = [
    { id: 1, text: "Customize your own .reg file effortlessly!" },
    { id: 2, text: "Optimize your system performance!" },
    {
      id: 3,
      text: "Download packages prepared by professionals with one click!",
    },
    { id: 4, text: "Create your own packages and share with others!" },
    { id: 5, text: "Check out optimizations shared by others!" },
    {
      id: 6,
      text: "Develop all optimizations and find the best one for yourself!",
    },
    { id: 7, text: "Enhance your system security with ease!" },
    { id: 8, text: "Boost your productivity with custom tweaks!" },
    { id: 9, text: "Access a library of pre-made optimizations!" },
    { id: 10, text: "Stay updated with the latest optimization trends!" },
  ];

  useEffect(() => {
    setShuffledSubtitles(shuffleArray([...subtitles]));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitle((prev) => (prev + 1) % shuffledSubtitles.length);
    }, 3000); // Change subtitle every 3 seconds

    return () => clearInterval(interval);
  }, [shuffledSubtitles.length]);

  return (
    <div className='landing-page column aic jcc'>
      <Helmet>
        <title>RegStyler</title>
      </Helmet>
      <div className='text-container column aic jcc'>
        <div className='text-content column aic jcc gap50'>
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className='title'
          >
            RegStyler
          </motion.div>
          <div className='animated-subtitle column aic'>
            <motion.span
              key={shuffledSubtitles[currentSubtitle]?.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='subtitle'
            >
              {shuffledSubtitles[currentSubtitle]?.text
                ? shuffledSubtitles[currentSubtitle].text
                : ""}
            </motion.span>
            <div className='mobile-msg form-container'>
              Mobile support is not available yet, but I hope to add it soon...
              <br />
              <br />
              You can still access the Package Store.
              <br />
              <br />
              <Link to='/package-store' className='button purple'>
                Go to Package Store
              </Link>
            </div>
          </div>
        </div>
        <img src={rlogo} alt='rlogo' className='rlogo' />
      </div>
      <LandingOptimizations />
    </div>
  );
}

export default LandingPage;
