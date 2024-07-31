import { useState } from "react";
import "./AddCustomRegStyle.css";
import { createOptimization } from "../../../services/optimizationsService";
import useAuth from "../../../hooks/useAuth";
import useScreenNotifi from "../../../hooks/useScreenNotifi/useScreenNotifi";
import { Helmet } from "react-helmet";
import InformationModalBtn from "../../../components/InformationModalBtn/InformationModalBtn";

function AddCustomRegStyle() {
  const { uid, token, browser } = useAuth();
  const { setNotifi, ScreenNotifiComponent, isDisabledNotifi } =
    useScreenNotifi();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("");

  const createRegStyle = async (e) => {
    e.preventDefault();
    const fetchCreateOptimization = await createOptimization(
      uid,
      token,
      browser,
      title,
      description,
      code,
      category,
    );

    setNotifi(
      fetchCreateOptimization.notification.type,
      fetchCreateOptimization.notification.text,
      3000,
    );
  };

  return (
    <div className='add-custom-regstyle column aifs'>
      <Helmet>
        <title>Add Custom RegStyle</title>
      </Helmet>
      <form
        onSubmit={(e) => createRegStyle(e)}
        className='form-container column gap20'
      >
        <div className='column gap5'>
          <label className='label' htmlFor='title'>
            Title (min 5, max 50)
          </label>
          <input
            className='input'
            type='text'
            id='title'
            autoComplete='off'
            placeholder='Disable Cortana'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
            minLength={5}
            maxLength={50}
          />
          <label className='label' htmlFor='title'>
            {title.length}/5
          </label>
        </div>
        <div className='column gap5'>
          <label className='label' htmlFor='desc'>
            Detail (min 5, max 250)
          </label>
          <textarea
            className='input'
            id='desc'
            autoComplete='off'
            placeholder="Cortana is Microsoft's virtual assistant designed to aid users with tasks using voice commands. Disabling Cortana can improve system performance and increase privacy by minimizing data shared with Microsoft, ensuring a more personalized computing environment."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={5}
            maxLength={250}
          />
        </div>
        <div className='column gap5'>
          <label className='label row aic gap5' htmlFor='code'>
            Code (min 5, max 250)
          </label>
          <InformationModalBtn
            title='RegStyler Information'
            description=';Disable Cortana: This line is a comment and does not perform any action in the registry file. It simply indicates the purpose of the file.

            [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Search]: This line specifies the registry key where the change will be made. This key contains the settings for Windows Search.

            "AllowCortana"=dword:00000000: This line creates a DWORD value named AllowCortana and sets its value to 0. The value 0 disables Cortana.'
            code=';Disable Cortana
[HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows Search]
"AllowCortana"=dword:00000000'
          />
          <pre>
            ;Disable Cortana
            <br />
            [HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows\Windows
            Search]
            <br />
            &quot;AllowCortana&quot;=dword:00000000
          </pre>
          <textarea
            className='input'
            id='code'
            autoComplete='off'
            placeholder='RegStyler'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            minLength={5}
            maxLength={250}
          />
        </div>
        <div className='column gap5'>
          <label className='label' htmlFor='category'>
            Category
          </label>
          <select
            id='category'
            className='select'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value='system'>System</option>
            <option value='graphic'>Graphic</option>
            <option value='internet'>Internet</option>
            <option value='privacy'>Privacy</option>
            <option value='other'>Other</option>
          </select>
        </div>
        <button
          className='button green'
          disabled={
            isDisabledNotifi ||
            title.length < 5 ||
            title.length > 50 ||
            description.length < 5 ||
            description.length > 250 ||
            code.length < 5 ||
            code.length > 250 ||
            category === ""
          }
          type='submit'
        >
          Create RegStyle
        </button>
      </form>
      <ScreenNotifiComponent />
    </div>
  );
}

export default AddCustomRegStyle;
