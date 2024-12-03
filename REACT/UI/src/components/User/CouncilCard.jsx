import React, { useState } from 'react';
import rpImage from '../../assets/Images/1.png';
import { Link } from 'react-router-dom';

const CouncilCard = ({ councillor }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  if (!councillor) {
    return null;
  }
  const getDescription = () => {
    const maxLength = 100;
    if (showFullDescription || councillor.description.length <= maxLength) {
      return councillor.description;
    } else {
      return councillor.description.substring(0, maxLength) + '...';
    }
  };
  return (
    <div className="bg-purple-100 rounded-md shadow-2xl flex flex-col items-center justify-center mx-5 my-5 py-10">
      <img src={rpImage} alt="councillor thumbnail" className="w-80 h-40" />
      <h2 className="font-bold text-lg text-purple-900">{councillor.councilName}</h2>
      <h3 className="font-bold text-lg text-purple-900">{councillor.occupation}</h3>

      <p className="text-black group-hover:text-white my-2 mx-5">{getDescription()}</p>
      {councillor.description.length > 100 && (
        <button className="text-blue-500 hover:underline mt-2" onClick={() => setShowFullDescription(!showFullDescription)}>
          {showFullDescription ? 'Show less' : 'Show more'}
        </button>
      )}

      <div className="flex flex-col items-center justify-center my-4">
        <h3 className="text-lg text-purple-900">Counselor: {councillor.councilName}</h3>
        <p className="text-black group-hover:text-white my-2 mx-5">{councillor.description}</p>
      </div>

      <Link to={`/podcast`} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 self-start mx-5">
        Entroll Now
      </Link>
    </div>
  );
};

export default CouncilCard