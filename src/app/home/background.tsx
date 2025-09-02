import "./background.css";

export default function HomeBackground() {
  return (
    <div className="bg-curves">
      <svg
        className="curve-line curve-1"
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
      >
        <path
          d="M0,400 Q300,200 600,300 T1200,250"
          stroke="currentColor"
          fill="none"
        />
      </svg>
      <svg
        className="curve-line curve-2"
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
      >
        <path
          d="M0,600 Q400,400 800,500 T1200,450"
          stroke="currentColor"
          fill="none"
        />
      </svg>
      <svg
        className="curve-line curve-3"
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
      >
        <path
          d="M200,100 Q600,300 1000,200 T1400,350"
          stroke="currentColor"
          fill="none"
        />
      </svg>
      <svg
        className="curve-line curve-4"
        width="100%"
        height="100%"
        viewBox="0 0 1200 800"
      >
        <path
          d="M-100,700 Q300,500 700,600 T1300,550"
          stroke="currentColor"
          fill="none"
        />
      </svg>
    </div>
  );
}
