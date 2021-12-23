import React, { useEffect } from 'react';

export default function LandmarksView(props: {selectedLandmarks: number[]}) {
  const { selectedLandmarks } = props;

  useEffect(() => {
    selectedLandmarks.forEach((landmarkID: number) => {
      document.querySelector(`#landmark-view #c-${landmarkID}`)?.setAttribute('fill', '#81ACEC');
      document.querySelector(`#landmark-view #c-${landmarkID}`)?.setAttribute('stroke', '#81ACEC');
      document.querySelector(`#landmark-view #c-${landmarkID}`)?.setAttribute('strokeOpacity', '1');
    });
    return () => {
      selectedLandmarks.forEach((landmarkID: number) => {
        document.querySelector(`#landmark-view #c-${landmarkID}`)?.setAttribute('fill', 'transparent');
        document.querySelector(`#landmark-view #c-${landmarkID}`)?.setAttribute('stroke', '#000000');
        document.querySelector(`#landmark-view #c-${landmarkID}`)?.setAttribute('strokeOpacity', '0.25');
      });
    };
  }, [selectedLandmarks]);

  return (
    <svg id="landmark-view" viewBox="0 0 479 479" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(50.5, 0)">
        <path d="M189.048 0.481155C34.309 0.481155 0.0966681 95.2478 0.0966797 189.534C0.0966797 223.303 4.53607 267.712 16.4669 317.056C28.5004 355.084 48.599 392.029 73.3467 421.392C96.376 448.715 118.573 473.708 189.048 478.456L189.048 0.481155Z" fill="#F6FAFE" />
        <path d="M189.048 0.480988C343.788 0.480988 378 95.2476 378 189.534C378 223.303 373.561 267.712 361.63 317.056C349.596 355.084 329.498 392.029 304.75 421.391C281.721 448.715 259.524 473.708 189.048 478.456L189.048 0.480988Z" fill="#F6FAFE" />

        {/* FACE CONTOUR */}

        <circle id="c-1" cx="7.49375" cy="208.05" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-2" cx="9.67466" cy="253.848" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-3" cx="17.3075" cy="300.191" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-4" cx="30.3924" cy="344.352" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-5" cx="52.7462" cy="384.153" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-6" cx="79.4613" cy="419.046" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-7" cx="111.083" cy="449.578" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-8" cx="150.884" cy="465.389" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-9" cx="189.593" cy="471.386" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-10" r="3.86167" transform="matrix(-1 0 0 1 226.668 465.389)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-11" r="3.86167" transform="matrix(-1 0 0 1 266.468 449.578)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-12" r="3.86167" transform="matrix(-1 0 0 1 298.09 419.046)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-13" r="3.86167" transform="matrix(-1 0 0 1 324.806 384.153)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-14" r="3.86167" transform="matrix(-1 0 0 1 347.159 344.352)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-15" r="3.86167" transform="matrix(-1 0 0 1 360.244 300.191)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-16" r="3.86167" transform="matrix(-1 0 0 1 367.877 253.848)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-17" r="3.86167" transform="matrix(-1 0 0 1 370.058 208.05)" stroke="black" strokeOpacity="0.25" />

        {/* LEFT BROW */}

        <circle id="c-18" r="3.86167" transform="matrix(1 0 0 -1 38.685 149.713)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-19" r="3.86167" transform="matrix(1 0 0 -1 59.4031 138.809)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-20" r="3.86167" transform="matrix(1 0 0 -1 86.1183 133.901)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-21" r="3.86167" transform="matrix(1 0 0 -1 113.379 133.901)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-22" r="3.86167" transform="matrix(1 0 0 -1 139.549 140.444)" stroke="black" strokeOpacity="0.25" />

        {/* RIGHT BROW */}

        <circle id="c-23" cx="238.662" cy="140.444" r="3.86167" transform="rotate(180 238.662 140.444)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-24" cx="264.833" cy="133.901" r="3.86167" transform="rotate(180 264.833 133.901)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-25" cx="292.093" cy="133.901" r="3.86167" transform="rotate(180 292.093 133.901)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-26" cx="318.808" cy="138.809" r="3.86167" transform="rotate(180 318.808 138.809)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-27" cx="339.526" cy="149.713" r="3.86167" transform="rotate(180 339.526 149.713)" stroke="black" strokeOpacity="0.25" />

        {/* NOSE */}

        <circle id="c-28" cx="189.593" cy="206.415" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-29" cx="189.593" cy="222.771" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-30" cx="189.593" cy="238.037" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-31" cx="189.593" cy="253.303" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-32" cx="160.698" cy="261.481" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-33" cx="173.783" cy="266.933" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-34" cx="189.593" cy="268.568" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-35" r="3.86167" transform="matrix(-1 0 0 1 204.859 266.933)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-36" r="3.86167" transform="matrix(-1 0 0 1 219.035 261.481)" stroke="black" strokeOpacity="0.25" />

        {/* LEFT EYE */}

        <circle id="c-37" r="3.86167" transform="matrix(1 0 0 -1 63.2195 187.332)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-38" r="3.86167" transform="matrix(1 0 0 -1 83.3922 175.338)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-39" r="3.86167" transform="matrix(1 0 0 -1 107.382 174.247)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-40" r="3.86167" transform="matrix(1 0 0 -1 129.19 185.151)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-41" r="3.86167" transform="matrix(1 0 0 -1 107.382 192.239)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-42" r="3.86167" transform="matrix(1 0 0 -1 83.9374 193.875)" stroke="black" strokeOpacity="0.25" />

        {/* RIGHT EYE */}

        <circle id="c-43" cx="251.202" cy="185.151" r="3.86167" transform="rotate(180 251.202 185.151)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-44" cx="271.92" cy="174.247" r="3.86167" transform="rotate(180 271.92 174.247)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-45" cx="295.91" cy="175.338" r="3.86167" transform="rotate(180 295.91 175.338)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-46" cx="316.627" cy="187.332" r="3.86167" transform="rotate(180 316.627 187.332)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-47" cx="295.91" cy="193.875" r="3.86167" transform="rotate(180 295.91 193.875)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-48" cx="271.92" cy="192.239" r="3.86167" transform="rotate(180 271.92 192.239)" stroke="black" strokeOpacity="0.25" />

        {/* MOUTH */}

        <circle id="c-49" cx="129.621" cy="374.884" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-50" cx="149.794" cy="358.528" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-51" cx="171.057" cy="348.714" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-52" cx="189.594" cy="350.35" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-53" r="3.86167" transform="matrix(-1 0 0 1 208.131 348.714)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-54" r="3.86167" transform="matrix(-1 0 0 1 230.485 358.528)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-55" r="3.86167" transform="matrix(-1 0 0 1 250.657 374.884)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-56" r="3.86167" transform="matrix(-1 0 0 1 230.485 392.331)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-57" r="3.86167" transform="matrix(-1 0 0 1 208.131 401.055)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-58" cx="189.594" cy="402.69" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-59" cx="171.057" cy="401.055" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-60" cx="149.794" cy="392.331" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-61" cx="152.099" cy="374.884" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-62" cx="171.057" cy="365.07" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-63" cx="189.594" cy="366.384" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-64" r="3.86167" transform="matrix(-1 0 0 1 208.131 365.07)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-65" r="3.86167" transform="matrix(-1 0 0 1 228.178 374.884)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-66" r="3.86167" transform="matrix(-1 0 0 1 208.131 383.608)" stroke="black" strokeOpacity="0.25" />
        <circle id="c-67" cx="189.594" cy="384.153" r="3.86167" stroke="black" strokeOpacity="0.25" />
        <circle id="c-68" cx="171.057" cy="383.608" r="3.86167" stroke="black" strokeOpacity="0.25" />
      </g>
    </svg>
  );
}
