import { useState } from 'react';
import { images } from './imageList';

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const { url, description } = images[currentIndex];

  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <img
        src={url}
        alt={description}
        style={{ maxWidth: '100%', borderRadius: 8 }}
      />
      <p>{description}</p>

      <div>
        <button onClick={handlePrevious} disabled={currentIndex === 0}>
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === images.length - 1}
          style={{ marginLeft: 10 }}
        >
          Next
        </button>
      </div>

      <p>
        Image {currentIndex + 1} of {images.length}
      </p>
    </div>
  );
}
