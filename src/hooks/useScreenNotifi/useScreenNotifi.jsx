import { useCallback, useState } from "react";
import "./useScreenNotifi.css";
//import { IoCloseCircle } from "react-icons/io5";

function useScreenNotifi() {
  const [notifiType, setNotifiType] = useState("null");
  const [notifiText, setNotifiText] = useState("");
  const [visible, setVisible] = useState(false);
  const [cooldown, setCooldown] = useState(3000);
  const [isCooldown, setIsCooldown] = useState(false);
  const [isDisabledNotifi, setIsDisabledNotifi] = useState(false);

  const resetVisibility = useCallback(() => {
    const intervalId = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1000) {
          setVisible(false);
          setIsCooldown(false);
          setIsDisabledNotifi(false);
          clearInterval(intervalId);
        }
        return prev - 1000;
      });
    }, 1000);
  }, []);

  const setNotifi = useCallback(
    (type, text, time) => {
      if (isCooldown) return;

      setNotifiType(type);
      setNotifiText(text);
      setVisible(true);
      setCooldown(time);
      setIsCooldown(true);
      setIsDisabledNotifi(true);
      resetVisibility();
    },
    [isCooldown, resetVisibility],
  );

  /*const handleCloseNotifi = () => {
    setNotifiType("null");
    setNotifiText("");
    setVisible(false);
    setCooldown(0);
    setIsCooldown(false);
    setIsDisabledNotifi(false);
  };*/

  const ScreenNotifiComponent = () => {
    return (
      visible && (
        <div className={`row aic jcc gap20 screennotifi ${notifiType}`}>
          {/* <button className='close row aic jcc' onClick={handleCloseNotifi}>
            <IoCloseCircle />
          </button> */}
          <p>{notifiText}</p>
          <div className='timer row aic jcc'>{cooldown / 1000}</div>
        </div>
      )
    );
  };

  return { ScreenNotifiComponent, setNotifi, isDisabledNotifi };
}

export default useScreenNotifi;
