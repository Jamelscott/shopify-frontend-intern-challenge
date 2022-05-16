import { supabase } from '../Utility/supabseClient';
import { useState } from 'react';
import './form.css';
function Form({
  setLoading,
  getData,
  payload,
  setPayload,
  setResponses,
  responses,
}) {
  const [engine, setEngine] = useState('');

  const postData = async (newData, engine_name) => {
    let promisedData = await newData;
    let refinedData = promisedData.choices[0].text;

    const { data, error } = await supabase.from('Responses').insert([
      {
        prompt: payload.prompt,
        response: refinedData,
        engine_name: engine_name,
      },
    ]);
    console.log(data);
    getData();
    if (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    let engineName = '';

    console.log(engine);
    switch (engine) {
      case 'text-davinci-002':
        engineName = 'Dr. DaVinci';
        break;
      case 'text-curie-001':
        engineName = 'Admiral Currie';
        break;
      case 'text-babbage-001':
        engineName = 'Major Babbage';
        break;
      case 'text-ada-001':
        engineName = 'Professor Ada';
        break;
      default:
        engineName = 'Reponse';
    }

    fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    }).then((res) => {
      let newData = res.json();
      postData(newData, engineName);
      setPayload({
        prompt: '',
        temperature: 0.5,
        max_tokens: 64,
      });
    });
  };
  const handleTextareaChange = (e) => {
    setPayload({ ...payload, prompt: e.target.value });
  };

  return (
    // <div className="prompt-container">
    <form className="prompt-container" onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center' }} className="prompt-header">
        Artificial Intelligence AMA
      </h2>
      <textarea
        required
        className="prompt-textarea"
        value={payload.prompt}
        placeholder={'type your question here..'}
        onChange={(e) => handleTextareaChange(e)}
      />
      <div className="button-container">
        <select
          className="dropdown"
          onChange={(e) => setEngine(e.target.value)}
          required
        >
          <option hidden className="option" value="">
            Choose your conversing robo-partner   
          </option>
          <option className="option" value="text-davinci-002">
            Dr. DaVinci
          </option>
          <option className="option" value="text-curie-001">
            Admiral Curie
          </option>
          <option className="option" value="text-babbage-001">
            Major Babbage
          </option>
          <option className="option" value="text-ada-001">
            Professor Ada
          </option>
        </select>
        <input className="prompt-button" type="submit" value="Submit" />
      </div>
    </form>
    // </div>
  );
}

export default Form;
